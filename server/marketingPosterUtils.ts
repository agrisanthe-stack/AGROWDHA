/**
 * Santhe Marketing Poster Generator
 *
 * Renders a 1080-wide PNG poster (square or story) from verified product /
 * farmer / FPO data, with a small amount of AI-written copy layered on top.
 *
 * - PosterData (prices, dates, names, images) is always the source of truth.
 * - Ollama writes ONE short JSON blob of marketing copy — a single, simple
 *   prompt, no schema gymnastics. If it fails or is disabled, static
 *   fallback copy is used instead so the poster always renders.
 * - NLLB translates that copy when `language` isn't "en". English never
 *   goes through NLLB.
 * - "Quality Highlights" and "The Story" are deterministic (built straight
 *   from PosterData), not AI-generated — keeps the Ollama prompt small.
 *
 * Public API:
 *   generateMarketingPoster(data: PosterData): Promise<Buffer>
 *   getLanguageLabel(code): string
 */

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { resolveStoredImageUrl } from "../server/utils/image-url";

// ─── Types ───────────────────────────────────────────────────────────────────

export type PosterStyle =
  | "warm"
  | "modern"
  | "health"
  | "festive"
  | "trust"
  | "promotional";

export type PosterLanguage =
  | "en"
  | "kn"
  | "hi"
  | "te"
  | "ta"
  | "ml"
  | "mr"
  | "gu";

export interface PosterSections {
  howWeGrow: boolean;
  howWeProcess: boolean;
  whyItMatters: boolean;
  popularWays: boolean;
}

export interface PosterData {
  product: {
    name: string;
    imageUrl?: string | null;
    price: string;
    unit: string;
    harvestDate?: string | null;
    availableUntil?: string | null;
    wholesalePrice?: string | null;
    wholesaleUnit?: string | null;
    gradeVariety?: string | null;
    boxSizeLabel?: string | null;
    retailBoxPrice?: string | null;
    wholesaleBoxPrice?: string | null;
  };
  farmer: {
    farmName: string;
    farmerName?: string | null;
    imageUrl?: string | null;
    isZbnfCertified?: boolean;
    isOrganicCertified?: boolean;
  } | null;
  fpo: {
    orgName: string;
    orgLogoUrl?: string | null;
    storeUrl?: string | null;
    qrCodeUrl?: string | null;
    district?: string | null;
  };
  style: PosterStyle;
  format: "square" | "story";
  language: PosterLanguage;
  aiContent: boolean;
  sections: PosterSections;
}

interface CropContent {
  tagline: string;
  howWeGrow: string[];
  howWeProcess: string[];
  whyItMatters: string[];
  popularWays: string[];
  healthBenefits: string[];
}

// ─── Theme palettes ────────────────────────────────────────────────────────────

interface Theme {
  bg: string;
  accent: string;
  pill: string;
  dark: string;
}

const THEMES: Record<PosterStyle, Theme> = {
  warm: { bg: "#7c2d00", accent: "#f59e0b", pill: "rgba(120,45,0,0.85)", dark: "#2b1608" },
  modern: { bg: "#0f172a", accent: "#60a5fa", pill: "rgba(15,23,42,0.85)", dark: "#060a14" },
  health: { bg: "#14532d", accent: "#4ade80", pill: "rgba(20,83,45,0.85)", dark: "#0a2717" },
  festive: { bg: "#7c1010", accent: "#fb923c", pill: "rgba(120,16,16,0.85)", dark: "#2e0808" },
  trust: { bg: "#1e3a5f", accent: "#fbbf24", pill: "rgba(30,58,95,0.85)", dark: "#0d1c30" },
  promotional: { bg: "#4a0072", accent: "#e879f9", pill: "rgba(74,0,114,0.85)", dark: "#220034" },
};

export const LANG_LABELS: Record<PosterLanguage, string> = {
  en: "English",
  kn: "Kannada",
  hi: "Hindi",
  te: "Telugu",
  ta: "Tamil",
  ml: "Malayalam",
  mr: "Marathi",
  gu: "Gujarati",
};

// NLLB (FLORES-200) codes for each short language used by the UI.
const NLLB_LANG: Record<PosterLanguage, string> = {
  en: "eng_Latn",
  kn: "kan_Knda",
  hi: "hin_Deva",
  te: "tel_Telu",
  ta: "tam_Taml",
  ml: "mal_Mlym",
  mr: "mar_Deva",
  gu: "guj_Gujr",
};

export function getLanguageLabel(code: string): string {
  return LANG_LABELS[code as PosterLanguage] || code;
}

// ─── AI configuration ────────────────────────────────────────────────────────

const OLLAMA_URL = process.env.OLLAMA_URL || "";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2:3b";
const NLLB_URL = process.env.NLLB_URL || ""; // e.g. http://localhost:6060/translate — empty disables translation

// Application-local Kannada fonts are embedded into SVG because Sharp/libvips
// does not reliably see fonts that only exist inside the application folder.
function firstExistingPath(candidates: string[]): string | null {
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) return candidate;
    } catch {
      // ignore inaccessible candidate
    }
  }
  return null;
}

const KANNADA_REGULAR_FONT_PATH = firstExistingPath([
  path.join(process.cwd(), "server", "assets", "fonts", "NotoSansKannada-Regular.ttf"),
  path.join(process.cwd(), "public", "assets", "fonts", "NotoSansKannada-Regular.ttf"),
  path.join(process.cwd(), "public", "fonts", "NotoSansKannada-Regular.ttf"),
  path.join(process.cwd(), "dist", "assets", "fonts", "NotoSansKannada-Regular.ttf"),
]);

const KANNADA_BOLD_FONT_PATH = firstExistingPath([
  path.join(process.cwd(), "server", "assets", "fonts", "NotoSansKannada-Bold.ttf"),
  path.join(process.cwd(), "public", "assets", "fonts", "NotoSansKannada-Bold.ttf"),
  path.join(process.cwd(), "public", "fonts", "NotoSansKannada-Bold.ttf"),
  path.join(process.cwd(), "dist", "assets", "fonts", "NotoSansKannada-Bold.ttf"),
]);

function fontDataUri(filePath: string | null): string | null {
  if (!filePath) return null;
  try {
    return `data:font/ttf;base64,${fs.readFileSync(filePath).toString("base64")}`;
  } catch {
    return null;
  }
}

const KANNADA_REGULAR_DATA_URI = fontDataUri(KANNADA_REGULAR_FONT_PATH);
const KANNADA_BOLD_DATA_URI = fontDataUri(KANNADA_BOLD_FONT_PATH);

const FONT =
  "SantheKannada,Noto Sans Kannada,Noto Sans,Noto Sans Devanagari,Noto Sans Tamil,Noto Sans Telugu,Noto Sans Malayalam,Noto Sans Gujarati,DejaVu Sans,sans-serif";

const EMBEDDED_FONT_CSS = [
  KANNADA_REGULAR_DATA_URI
    ? `@font-face{font-family:"SantheKannada";src:url(${KANNADA_REGULAR_DATA_URI}) format("truetype");font-weight:400;font-style:normal;}`
    : "",
  KANNADA_BOLD_DATA_URI
    ? `@font-face{font-family:"SantheKannada";src:url(${KANNADA_BOLD_DATA_URI}) format("truetype");font-weight:700;font-style:normal;}`
    : "",
].filter(Boolean).join("");

if (!KANNADA_REGULAR_FONT_PATH || !KANNADA_BOLD_FONT_PATH) {
  console.warn(
    "[Poster Font] Kannada TTF not found. Expected assets/fonts/NotoSansKannada-Regular.ttf and assets/fonts/NotoSansKannada-Bold.ttf.",
  );
}

const W = 1080;

// ─── Small helpers ───────────────────────────────────────────────────────────

function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fmtDate(value?: string | null): string {
  if (!value) return "";
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return "";
  }
}

function shortText(value: string, max: number): string {
  const s = String(value || "").replace(/\s+/g, " ").trim();
  return s.length <= max ? s : `${s.slice(0, max - 1).trimEnd()}…`;
}

function wrapText(value: string, maxChars: number): string[] {
  const words = String(value || "").replace(/\s+/g, " ").trim().split(" ");
  if (!words[0]) return [];
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) current = next;
    else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function cleanArray(value: unknown, max: number): string[] {
  if (Array.isArray(value)) {
    return value.map((x) => String(x ?? "").replace(/\s+/g, " ").trim()).filter(Boolean).slice(0, max);
  }
  if (typeof value === "string" && value.trim()) {
    // Some models return one sentence instead of an array — split it into items
    // on sentence/clause boundaries so it still fills the 3-bullet slots.
    return value
      .split(/(?<=[.!?])\s+|\s*;\s*|\n+/)
      .map((s) => s.replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .slice(0, max);
  }
  return [];
}

function pick(value: string[], fallback: string[]): string[] {
  return value.length ? value : fallback;
}

function cleanText(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

/** Pulls a JSON object out of a model reply even if it's wrapped in prose or code fences. */
function extractJson(raw: string): any | null {
  const cleaned = raw.replace(/^\s*```(?:json)?/i, "").replace(/```\s*$/i, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    /* fall through */
  }
  const start = cleaned.indexOf("{");
  if (start < 0) return null;
  let depth = 0;
  for (let i = start; i < cleaned.length; i++) {
    if (cleaned[i] === "{") depth++;
    if (cleaned[i] === "}") {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(cleaned.slice(start, i + 1));
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

function svg(x: number, y: number, w: number, h: number, content: string): string {
  const style = EMBEDDED_FONT_CSS ? `<style>${EMBEDDED_FONT_CSS}</style>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${style}${content}</svg>`;
}

function text(
  x: number,
  y: number,
  value: string,
  size: number,
  fill: string,
  weight = 600,
  anchor: "start" | "middle" | "end" = "start",
): string {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(value)}</text>`;
}

function multiline(
  x: number,
  y: number,
  value: string,
  size: number,
  fill: string,
  maxChars: number,
  lineH: number,
  weight = 600,
  anchor: "start" | "middle" | "end" = "start",
  maxLines = 3,
): string {
  return wrapText(value, maxChars)
    .slice(0, maxLines)
    .map((line, i) => text(x, y + i * lineH, line, size, fill, weight, anchor))
    .join("");
}

function card(x: number, y: number, w: number, h: number, fill: string, radius = 20): string {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}"/>`;
}

/** The dark bordered card used for every content block (title, price, farmer, bullet cards, etc). */
function panelCard(x: number, y: number, w: number, h: number, r = 18): string {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="rgba(10,10,10,0.74)" stroke="rgba(255,196,110,0.35)" stroke-width="1.5"/>`;
}

/** Text with a dark outline so it stays legible directly over the photo (used where there's no card behind it). */
function textOutlined(
  x: number,
  y: number,
  value: string,
  size: number,
  fill: string,
  weight = 800,
  anchor: "start" | "middle" | "end" = "start",
): string {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}" paint-order="stroke" stroke="rgba(0,0,0,0.6)" stroke-width="${Math.max(2, size / 12)}" stroke-linejoin="round">${esc(value)}</text>`;
}

type IconType = "leaf" | "heart" | "bowl" | "ribbon" | "calendar" | "pin" | "pot" | "people";

/** Small decorative category icons — plain vector shapes, no external font/icon-set dependency. */
function icon(type: IconType, x: number, y: number, size: number, color: string): string {
  const s = size / 24;
  const shapes: Record<IconType, string> = {
    leaf: `<path d="M4 20c8-1 14-7 15-15C11 6 5 12 4 20z" fill="${color}"/>`,
    heart: `<path d="M12 21s-7-4.4-9.5-8.6C1 9 2.6 5 6 5c2 0 3.6 1.2 4 2.6 0.4-1.4 2-2.6 4-2.6 3.4 0 5 4 3.5 7.4C19 16.6 12 21 12 21z" fill="${color}"/>`,
    bowl: `<path d="M3 12a9 6 0 0018 0z" fill="${color}"/><path d="M12 3c-1 2 1 3 0 5" stroke="${color}" stroke-width="1.5" fill="none"/>`,
    ribbon: `<circle cx="12" cy="8" r="5" fill="${color}"/><path d="M9 12l-3 8 6-3 6 3-3-8" fill="${color}"/>`,
    calendar: `<rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="${color}" stroke-width="1.6"/><line x1="3" y1="9.5" x2="21" y2="9.5" stroke="${color}" stroke-width="1.6"/><line x1="7" y1="3" x2="7" y2="7" stroke="${color}" stroke-width="1.6"/><line x1="17" y1="3" x2="17" y2="7" stroke="${color}" stroke-width="1.6"/>`,
    pin: `<path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7z" fill="${color}"/><circle cx="12" cy="9" r="2.4" fill="rgba(0,0,0,0.35)"/>`,
    pot: `<rect x="4" y="10" width="16" height="9" rx="2" fill="${color}"/><rect x="2" y="9" width="20" height="2" rx="1" fill="${color}"/><path d="M8 8c0-2 1-3 1-5M14 8c0-2 1-3 1-5" stroke="${color}" stroke-width="1.5" fill="none"/>`,
    people: `<circle cx="8" cy="8" r="3" fill="${color}"/><circle cx="16" cy="8" r="3" fill="${color}"/><path d="M3 20c0-4 3-6 5-6s5 2 5 6M11 20c0-4 3-6 5-6s5 2 5 6" fill="none" stroke="${color}" stroke-width="1.6"/>`,
  };
  return `<g transform="translate(${x},${y}) scale(${s})">${shapes[type]}</g>`;
}

async function toPng(content: string): Promise<Buffer> {
  return sharp(Buffer.from(content)).png().toBuffer();
}

// ─── Image fetching / avatars ─────────────────────────────────────────────────

async function fetchImageBuffer(url?: string | null): Promise<Buffer | null> {
  if (!url) return null;
  try {
    if (url.startsWith("data:")) {
      const comma = url.indexOf(",");
      return comma >= 0 ? Buffer.from(url.slice(comma + 1), "base64") : null;
    }

    let absoluteUrl = resolveStoredImageUrl(url) || url;

    // Keep poster generation working when a raw /t/... Openinary path reaches it.
    if (absoluteUrl.startsWith("/")) {
      const storageType = process.env.STORAGE_TYPE || "openinary";
      const openinaryUrl = process.env.OPENINARY_URL || "http://openinary:3000";
      const appUrl = process.env.APP_URL || "http://127.0.0.1:5000";
      const base = storageType === "openinary" ? openinaryUrl : appUrl;
      absoluteUrl = `${base.replace(/\/$/, "")}${absoluteUrl}`;
    }

    const res = await fetch(absoluteUrl, { signal: AbortSignal.timeout(15_000) });
    if (!res.ok) {
      console.warn("[Poster Image] fetch failed:", res.status, absoluteUrl);
      return null;
    }
    return Buffer.from(await res.arrayBuffer());
  } catch (err) {
    console.warn("[Poster Image] fetch error:", err);
    return null;
  }
}

async function circularImage(url: string | null | undefined, size: number): Promise<Buffer | null> {
  const source = await fetchImageBuffer(url);
  if (!source) return null;
  try {
    const photo = await sharp(source).resize(size, size, { fit: "cover", position: "centre" }).png().toBuffer();
    const mask = Buffer.from(svg(0, 0, size, size, `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/>`));
    const clipped = await sharp(photo).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
    const outer = size + 8;
    const ring = Buffer.from(svg(0, 0, outer, outer, `<circle cx="${outer / 2}" cy="${outer / 2}" r="${outer / 2 - 1}" fill="white"/>`));
    return sharp({ create: { width: outer, height: outer, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 0 } } })
      .composite([{ input: ring, left: 0, top: 0 }, { input: clipped, left: 4, top: 4 }])
      .png()
      .toBuffer();
  } catch {
    return null;
  }
}

async function qrCard(url: string | null | undefined, size: number): Promise<Buffer | null> {
  const source = await fetchImageBuffer(url);
  if (!source) return null;
  try {
    const qr = await sharp(source).resize(size, size, { fit: "contain", background: "#ffffff" }).png().toBuffer();
    const pad = 14;
    const total = size + pad * 2;
    const frame = Buffer.from(svg(0, 0, total, total, `<rect width="${total}" height="${total}" rx="18" fill="white"/>`));
    return sharp({ create: { width: total, height: total, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
      .composite([{ input: frame, left: 0, top: 0 }, { input: qr, left: pad, top: pad }])
      .png()
      .toBuffer();
  } catch {
    return null;
  }
}

// ─── AI content (Ollama + NLLB) ────────────────────────────────────────────────

function fallbackContent(data: PosterData): CropContent {
  const crop = data.product.name || "This product";
  const grower = data.farmer?.farmerName || data.farmer?.farmName || "a local farmer";
  return {
    tagline: `${crop}, fresh from the farm.`,
    howWeGrow: [
      "Grown following the crop's natural season.",
      `Cared by ${shortText(grower, 30)}.`,
      "Farmed using trusted local practices.",
    ],
    howWeProcess: [
      "Cleaned and sorted after harvest.",
      "Handled carefully to keep it fresh.",
      "Packed and readied for market.",
    ],
    whyItMatters: [
      "Connects you directly with the farmer.",
      "Sourced through a trusted FPO.",
      "A simple way to buy farm-fresh food.",
    ],
    popularWays: ["Everyday home cooking", "Traditional family recipes", "Fresh in seasonal dishes"],
    healthBenefits: ["Fits into a balanced daily diet.", "A wholesome, farm-fresh choice."],
  };
}

/** One short prompt, ONE JSON object back — keeps Ollama's job simple. */
function buildPrompt(data: PosterData): string {
  const p = data.product;
  const f = data.farmer;
  const certs: string[] = [];
  if (f?.isZbnfCertified) certs.push("ZBNF certified");
  if (f?.isOrganicCertified) certs.push("organic certified");

  return [
    `Write short marketing copy for a farm product poster.`,
    `Crop: ${p.name}${p.gradeVariety ? ` (${p.gradeVariety})` : ""}.`,
    `Grown by: ${f?.farmerName || f?.farmName || "a local farmer"}${data.fpo.district ? `, ${data.fpo.district} district` : ""}.`,
    certs.length ? `Certifications: ${certs.join(", ")}.` : "",
    `Reply with ONLY this JSON object, nothing else — no other text, no markdown.`,
    `Use these EXACT lowercase keys: tagline, howWeGrow, howWeProcess, whyItMatters, popularWays, healthBenefits.`,
    `howWeGrow, howWeProcess, whyItMatters, popularWays, healthBenefits must each be a JSON array of separate short strings, NOT one combined sentence.`,
    `Every item must be under 10 words, simple everyday language, no emojis:`,
    `{"tagline":"one catchy line","howWeGrow":["...","...","..."],"howWeProcess":["...","...","..."],"whyItMatters":["...","...","..."],"popularWays":["...","...","..."],"healthBenefits":["...","..."]}`,
  ]
    .filter(Boolean)
    .join("\n");
}

/** Maps a loosely-cased/spaced key ("How We Grow", "how_we_grow") to the CropContent field it means. */
const AI_KEY_MAP: Record<string, keyof CropContent> = {
  tagline: "tagline",
  howwegrow: "howWeGrow",
  howweprocess: "howWeProcess",
  whyitmatters: "whyItMatters",
  popularways: "popularWays",
  healthbenefits: "healthBenefits",
};

/** Normalizes whatever key casing/spacing the model used back onto CropContent's exact field names. */
function normalizeAiContent(parsed: any): Partial<CropContent> | null {
  if (!parsed || typeof parsed !== "object") return null;
  const out: Partial<CropContent> = {};
  for (const [key, value] of Object.entries(parsed)) {
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
    const field = AI_KEY_MAP[normalizedKey];
    if (field) (out as any)[field] = value;
  }
  return out;
}

async function callOllama(data: PosterData): Promise<Partial<CropContent> | null> {
  if (!OLLAMA_URL) return null;
  const prompt = buildPrompt(data);
  console.log("[Ollama] prompt:", prompt);
  try {
    const res = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
        format: "json",
        options: { temperature: 0.3 },
      }),
      signal: AbortSignal.timeout(60_000),
    });
    if (!res.ok) {
      console.log("[Ollama] request failed:", res.status, res.statusText);
      return null;
    }
    const payload: any = await res.json();
    const raw = String(payload?.response ?? "").trim();
    console.log("[Ollama] raw response:", raw);
    if (!raw) return null;
    const parsed = extractJson(raw);
    const normalized = normalizeAiContent(parsed);
    console.log("[Ollama] parsed JSON:", parsed);
    console.log("[Ollama] normalized:", normalized);
    return normalized;
  } catch (err) {
    console.log("[Ollama] error:", err);
    return null;
  }
}

/** Translates every string/array field via NLLB. Skipped entirely for English. */
async function translateContent(content: CropContent, targetLang: string): Promise<CropContent> {
  if (!NLLB_URL || targetLang === "eng_Latn") return content;
  console.log("[NLLB] target language:", targetLang);

  const translateOne = async (text: string): Promise<string> => {
    const body = { text, source: "eng_Latn", target: targetLang };
    console.log(`[NLLB] (${targetLang}) input:`, body);
    try {
      const res = await fetch(NLLB_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(180_000),
      });
      if (!res.ok) {
        console.log(`[NLLB] (${targetLang}) request failed:`, res.status, res.statusText, "for text:", text);
        return text;
      }
      const data: any = await res.json();
      const translated = data.translation || data.result || text;
      console.log(`[NLLB] (${targetLang}) output:`, translated);
      return translated;
    } catch (err) {
      console.log(`[NLLB] (${targetLang}) error:`, err, "for text:", text);
      return text;
    }
  };

  const [tagline, howWeGrow, howWeProcess, whyItMatters, popularWays, healthBenefits] = await Promise.all([
    translateOne(content.tagline),
    Promise.all(content.howWeGrow.map(translateOne)),
    Promise.all(content.howWeProcess.map(translateOne)),
    Promise.all(content.whyItMatters.map(translateOne)),
    Promise.all(content.popularWays.map(translateOne)),
    Promise.all(content.healthBenefits.map(translateOne)),
  ]);

  return { tagline, howWeGrow, howWeProcess, whyItMatters, popularWays, healthBenefits };
}

async function generateContent(data: PosterData): Promise<CropContent> {
  const fallback = fallbackContent(data);
  if (!data.aiContent) return fallback;

  const ai = await callOllama(data);
  const merged: CropContent = {
    tagline: cleanText(ai?.tagline) || fallback.tagline,
    howWeGrow: pick(cleanArray(ai?.howWeGrow, 3), fallback.howWeGrow),
    howWeProcess: pick(cleanArray(ai?.howWeProcess, 3), fallback.howWeProcess),
    whyItMatters: pick(cleanArray(ai?.whyItMatters, 3), fallback.whyItMatters),
    popularWays: pick(cleanArray(ai?.popularWays, 3), fallback.popularWays),
    healthBenefits: pick(cleanArray(ai?.healthBenefits, 2), fallback.healthBenefits),
  };

  if (data.language === "en") return merged; // English needs no translation
  return translateContent(merged, NLLB_LANG[data.language] || "eng_Latn");
}

// ─── Static (non-AI) content ───────────────────────────────────────────────────

function qualityHighlights(data: PosterData): string[] {
  const items = ["Non-GMO, gluten-free, vegan-friendly"];
  if (data.farmer?.isOrganicCertified) items.push("Certified organic");
  if (data.farmer?.isZbnfCertified) items.push("ZBNF certified");
  items.push("Sourced through a verified FPO");
  return items.slice(0, 3);
}

function storyLine(data: PosterData): string {
  const grower = data.farmer?.farmerName || data.farmer?.farmName;
  const district = data.fpo.district;
  if (grower && district) return `Meet ${grower}, our trusted farmer in ${district}.`;
  if (grower) return `Meet ${grower}, our trusted farmer.`;
  return `Brought to you by ${data.fpo.orgName}.`;
}

// ─── Section builders ───────────────────────────────────────────────────────────
// Each returns an SVG PNG buffer plus the height it occupies. They're stacked
// top-to-bottom onto the canvas; the final canvas is resized to the exact
// target dimensions (1080×1080 / 1080×1920) at the end using fit:"fill" so
// content is always fully visible (see note on generateMarketingPoster).

const CONTENT_GREEN = "#8bc34a"; // fixed accent for section icons/headers, independent of theme
const GOLD = "#f4b400";

async function buildHeader(data: PosterData, theme: Theme): Promise<{ buf: Buffer; h: number }> {
  const h = 120;
  const logoSize = 60;
  const qrSize = 66;
  const logo = await circularImage(data.fpo.orgLogoUrl, logoSize);
  const qr = await qrCard(data.fpo.qrCodeUrl, qrSize);

  const orgLines = wrapText(data.fpo.orgName, 24).slice(0, 2);
  const textX = 104;
  const qrLeft = W - (qrSize + 28) - 20;
  const wordmarkX = qrLeft - 14;

  const base = await toPng(
    svg(0, 0, W, h, `
      ${orgLines.map((line, i) => textOutlined(textX, 34 + i * 27, line, 22, "#ffffff", 800)).join("")}
      ${data.fpo.district ? textOutlined(textX, 34 + orgLines.length * 27 + 6, shortText(data.fpo.district, 26), 14, "#e5e7eb", 500) : ""}
      ${textOutlined(wordmarkX, 32, "FARMERSANTHE", 15, "#ffffff", 900, "end")}
      ${textOutlined(wordmarkX, 50, "FARMERS AI MARKET", 10, theme.accent, 700, "end")}
    `),
  );

  // Each overlay's own height (circularImage adds +8, qrCard adds pad*2=28)
  // must stay within the header canvas height `h`, or sharp throws
  // "Image to composite must have same dimensions or smaller".
  const overlays: sharp.OverlayOptions[] = [{ input: base, left: 0, top: 0 }];
  if (logo) overlays.push({ input: logo, left: 20, top: Math.round((h - (logoSize + 8)) / 2) });
  if (qr) overlays.push({ input: qr, left: qrLeft, top: Math.round((h - (qrSize + 28)) / 2) });

  const buf = await sharp({ create: { width: W, height: h, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(overlays)
    .png()
    .toBuffer();
  return { buf, h };
}

async function buildTitle(data: PosterData, content: CropContent, theme: Theme): Promise<{ buf: Buffer; h: number }> {
  const nameLines = wrapText(data.product.name.toUpperCase(), 15).slice(0, 2);
  const nameStartY = 108;
  const nameLineH = 58;
  const nameEndY = nameStartY + (nameLines.length - 1) * nameLineH;

  let cursorY = nameEndY + 40;
  const grade = data.product.gradeVariety;
  let gradeRow = "";
  if (grade) {
    const gradeSize = 24;
    const halfText = shortText(grade, 20).length * gradeSize * 0.3;
    const cx = W / 2;
    gradeRow = `
      <line x1="${cx - halfText - 110}" y1="${cursorY - 8}" x2="${cx - halfText - 30}" y2="${cursorY - 8}" stroke="${theme.accent}" stroke-width="1.5" opacity="0.7"/>
      ${icon("leaf", cx - halfText - 26, cursorY - 20, 16, theme.accent)}
      ${text(cx, cursorY, shortText(grade, 20), gradeSize, theme.accent, 700, "middle")}
      ${icon("leaf", cx + halfText + 10, cursorY - 20, 16, theme.accent)}
      <line x1="${cx + halfText + 30}" y1="${cursorY - 8}" x2="${cx + halfText + 110}" y2="${cursorY - 8}" stroke="${theme.accent}" stroke-width="1.5" opacity="0.7"/>
    `;
    cursorY += 42;
  }

  const taglineLines = wrapText(content.tagline, 44).slice(0, 2);
  const taglineRow = taglineLines.map((line, i) => text(W / 2, cursorY + i * 26, line, 18, "#f3f4f6", 600, "middle")).join("");
  cursorY += taglineLines.length > 0 ? (taglineLines.length - 1) * 26 + 20 : 10;

  const h = Math.max(280, cursorY + 20);

  const buf = await toPng(
    svg(0, 0, W, h, `
      ${panelCard(20, 8, W - 40, h - 16, 26)}
      ${text(W / 2, 46, "FARMER • FPO • PRODUCT", 13, "#e5e7eb", 700, "middle")}
      ${nameLines.map((line, i) => text(W / 2, nameStartY + i * nameLineH, line, 52, "#ffffff", 900, "middle")).join("")}
      ${gradeRow}
      ${taglineRow}
    `),
  );
  return { buf, h };
}

async function buildPrice(data: PosterData, theme: Theme): Promise<{ buf: Buffer; h: number }> {
  const h = 150;
  const p = data.product;
  const hasWholesale = !!p.wholesalePrice;
  const boxLine = (price: string | null | undefined) =>
    price && p.boxSizeLabel ? `₹${price} / ${p.boxSizeLabel}` : "";

  const leftX = hasWholesale ? 56 : W / 2 - 200;
  const rightX = W / 2 + 56;

  const buf = await toPng(
    svg(0, 0, W, h, `
      ${panelCard(20, 8, W - 40, h - 16, 24)}
      ${hasWholesale ? `<line x1="${W / 2}" y1="34" x2="${W / 2}" y2="${h - 30}" stroke="rgba(255,255,255,0.22)" stroke-width="1.5"/>` : ""}
      ${text(leftX, 44, "RETAIL", 14, theme.accent, 800)}
      ${text(leftX, 90, `₹${p.price}/${p.unit}`, 36, "#ffffff", 900)}
      ${boxLine(p.retailBoxPrice) ? text(leftX, 114, boxLine(p.retailBoxPrice), 14, "#cbd5e1", 600) : ""}
      ${
        hasWholesale
          ? `
        ${text(rightX, 44, "WHOLESALE", 14, theme.accent, 800)}
        ${text(rightX, 90, `₹${p.wholesalePrice}/${p.wholesaleUnit || p.unit}`, 36, "#ffffff", 900)}
        ${boxLine(p.wholesaleBoxPrice) ? text(rightX, 114, boxLine(p.wholesaleBoxPrice), 14, "#cbd5e1", 600) : ""}
      `
          : ""
      }
    `),
  );
  return { buf, h };
}

async function buildFarmer(data: PosterData, theme: Theme): Promise<{ buf: Buffer; h: number }> {
  const h = 156;
  const photoSize = 82;
  const photo = await circularImage(data.farmer?.imageUrl, photoSize);
  const textX = photo ? 34 + photoSize + 24 : 34;

  const colStart = 560;
  const colW = (W - 40 - colStart) / 3;
  const col = (i: number) => colStart + i * colW;

  const infoCol = (i: number, iconType: IconType, label: string, value: string) => `
    ${i > 0 ? `<line x1="${col(i) - 12}" y1="30" x2="${col(i) - 12}" y2="${h - 30}" stroke="rgba(255,255,255,0.18)" stroke-width="1.5"/>` : ""}
    ${icon(iconType, col(i), 34, 18, theme.accent)}
    ${text(col(i) + 24, 48, label, 12, theme.accent, 800)}
    ${text(col(i), 78, value || "—", 16, "#ffffff", 700)}
  `;

  const base = await toPng(
    svg(0, 0, W, h, `
      ${panelCard(20, 8, W - 40, h - 16, 24)}
      ${text(textX, 42, "GROWN BY", 13, theme.accent, 800)}
      ${text(textX, 70, shortText(data.farmer?.farmName || "Farmer linked", 26), 22, "#ffffff", 800)}
      ${data.farmer?.farmerName ? text(textX, 94, `Farmer: ${shortText(data.farmer.farmerName, 24)}`, 15, "#cbd5e1", 600) : ""}
      <line x1="${colStart - 24}" y1="30" x2="${colStart - 24}" y2="${h - 30}" stroke="rgba(255,255,255,0.18)" stroke-width="1.5"/>
      ${infoCol(0, "calendar", "HARVEST", fmtDate(data.product.harvestDate))}
      ${infoCol(1, "calendar", "AVAILABLE", fmtDate(data.product.availableUntil))}
      ${infoCol(2, "pin", "DISTRICT", shortText(data.fpo.district || "—", 14))}
    `),
  );

  const overlays: sharp.OverlayOptions[] = [{ input: base, left: 0, top: 0 }];
  if (photo) overlays.push({ input: photo, left: 34, top: Math.round((h - (photoSize + 8)) / 2) });

  const buf = await sharp({ create: { width: W, height: h, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(overlays)
    .png()
    .toBuffer();
  return { buf, h };
}

/** Renders one or two side-by-side bullet cards. Pass null for a slot to skip it. */
async function buildTwinCard(
  left: { title: string; items: string[]; icon: IconType } | null,
  right: { title: string; items: string[]; icon: IconType } | null,
): Promise<{ buf: Buffer; h: number } | null> {
  if (!left && !right) return null;
  const h = 170;
  const half = (W - 48) / 2;

  const renderPanel = (x: number, w: number, panel: { title: string; items: string[]; icon: IconType }) => `
    ${panelCard(x, 4, w, h - 8, 18)}
    ${icon(panel.icon, x + 18, 20, 18, CONTENT_GREEN)}
    ${text(x + 46, 35, panel.title, 17, CONTENT_GREEN, 800)}
    ${panel.items
      .slice(0, 3)
      .map((item, i) => text(x + 22, 68 + i * 28, `• ${shortText(item, 42)}`, 15, "#f3f4f6", 500))
      .join("")}
  `;

  let content = "";
  if (left && right) {
    content = renderPanel(16, half, left) + renderPanel(16 + half + 16, half, right);
  } else {
    content = renderPanel(16, W - 32, (left || right)!);
  }

  const buf = await toPng(svg(0, 0, W, h, content));
  return { buf, h };
}

async function buildPopularWays(content: CropContent, theme: Theme): Promise<{ buf: Buffer; h: number }> {
  const h = 155;
  const items = content.popularWays.slice(0, 3);
  const icons: IconType[] = ["pot", "people", "leaf"];
  const iconColors = ["#4aa8ff", CONTENT_GREEN, "#ffb74a"];
  const colW = (W - 64) / Math.max(items.length, 1);

  const buf = await toPng(
    svg(0, 0, W, h, `
      ${panelCard(16, 6, W - 32, h - 12, 22)}
      ${icon("leaf", W / 2 - 130, 24, 16, theme.accent)}
      ${text(W / 2, 40, "POPULAR WAYS TO ENJOY", 17, theme.accent, 800, "middle")}
      ${icon("leaf", W / 2 + 114, 24, 16, theme.accent)}
      <line x1="40" y1="56" x2="${W - 40}" y2="56" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>
      ${items
        .map((item, i) => {
          const cx = 32 + i * colW + colW / 2;
          return `
            ${i > 0 ? `<line x1="${32 + i * colW}" y1="66" x2="${32 + i * colW}" y2="${h - 20}" stroke="rgba(255,255,255,0.18)" stroke-width="1"/>` : ""}
            ${icon(icons[i % icons.length], cx - 14, 70, 28, iconColors[i % iconColors.length])}
            ${multiline(cx, 122, item, 15, "#ffffff", 20, 20, 600, "middle", 2)}
          `;
        })
        .join("")}
    `),
  );
  return { buf, h };
}

async function buildQualityAndStory(data: PosterData): Promise<{ buf: Buffer; h: number }> {
  const h = 148;
  const highlights = qualityHighlights(data);
  const story = storyLine(data);

  const buf = await toPng(
    svg(0, 0, W, h, `
      ${panelCard(16, 4, W - 32, 68, 16)}
      ${icon("ribbon", 30, 18, 20, GOLD)}
      ${text(60, 32, "QUALITY HIGHLIGHTS", 14, GOLD, 800)}
      ${text(32, 56, highlights.join("   •   "), 14, "#f3f4f6", 500)}
      ${panelCard(16, 78, W - 32, 60, 16)}
      ${icon("leaf", 30, 92, 20, GOLD)}
      ${text(60, 106, "THE STORY", 13, GOLD, 800)}
      ${text(32, 128, shortText(story, 60), 14, "#f3f4f6", 500)}
    `),
  );
  return { buf, h };
}

async function buildFooter(data: PosterData, theme: Theme): Promise<{ buf: Buffer; h: number }> {
  const h = 120;
  const tagline = "From our fields to your home.";
  const taglineSize = 22;
  const taglineWidth = tagline.length * taglineSize * 0.32;
  const taglineX = W - 32;

  const buf = await toPng(
    svg(0, 0, W, h, `
      <rect width="${W}" height="${h}" fill="${theme.dark}"/>
      ${icon("leaf", 28, h / 2 - 28, 22, CONTENT_GREEN)}
      ${text(58, h / 2 - 8, "FARMERSANTHE", 20, "#ffffff", 900)}
      ${text(58, h / 2 + 16, "FARMERS AI MARKET", 12, theme.accent, 700)}
      <text x="${taglineX}" y="${h / 2 - 2}" text-anchor="end" font-family="${FONT}" font-size="${taglineSize}" font-style="italic" font-weight="500" fill="#ffffff">${esc(tagline)}</text>
      <path d="M${taglineX - taglineWidth} ${h / 2 + 12} Q ${taglineX - taglineWidth / 2} ${h / 2 + 22} ${taglineX} ${h / 2 + 12}" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" fill="none"/>
      ${icon("leaf", taglineX - 6, h / 2 + 16, 14, CONTENT_GREEN)}
    `),
  );
  return { buf, h };
}

// ─── Background layers ───────────────────────────────────────────────────────

async function buildBackground(data: PosterData, theme: Theme, naturalH: number): Promise<Buffer> {
  const productImg = await fetchImageBuffer(data.product.imageUrl);

  let bg: Buffer;
  if (productImg) {
    try {
      bg = await sharp(productImg).resize(W, naturalH, { fit: "cover", position: "centre" }).png().toBuffer();
    } catch {
      bg = await toPng(svg(0, 0, W, naturalH, `<rect width="${W}" height="${naturalH}" fill="${theme.bg}"/>`));
    }
  } else {
    bg = await toPng(svg(0, 0, W, naturalH, `<rect width="${W}" height="${naturalH}" fill="${theme.bg}"/>`));
  }

  const gradient = await toPng(
    svg(0, 0, W, naturalH, `
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#000" stop-opacity="0.55"/>
          <stop offset="20%" stop-color="#000" stop-opacity="0.15"/>
          <stop offset="60%" stop-color="#000" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#000" stop-opacity="0.85"/>
        </linearGradient>
      </defs>
      <rect width="${W}" height="${naturalH}" fill="url(#g)"/>
    `),
  );

  return sharp(bg).composite([{ input: gradient, blend: "over" }]).png().toBuffer();
}

// ─── Main export ─────────────────────────────────────────────────────────────

export async function generateMarketingPoster(data: PosterData): Promise<Buffer> {
  if (!data?.product) throw new Error("Poster generation requires product data.");

  const theme = THEMES[data.style] || THEMES.warm;
  const targetW = W;
  const targetH = data.format === "story" ? 1920 : 1080;
  // Small, fixed gap — content density (not blank padding) is what fills the
  // canvas now. See the fit:"fill" note below for how the two formats stay
  // fully visible despite their very different target heights.
  const gap = data.format === "story" ? 20 : 10;

  const content = await generateContent(data);

  const sectionResults: Array<{ buf: Buffer; h: number }> = [];
  sectionResults.push(await buildHeader(data, theme));
  sectionResults.push(await buildTitle(data, content, theme));
  sectionResults.push(await buildPrice(data, theme));
  sectionResults.push(await buildFarmer(data, theme));

  const growCard = data.sections.howWeGrow
    ? { title: "HOW WE GROW", items: content.howWeGrow, icon: "leaf" as IconType }
    : null;
  const handleCard = data.sections.howWeProcess
    ? { title: "HOW WE HANDLE", items: content.howWeProcess, icon: "leaf" as IconType }
    : null;
  const growTwin = await buildTwinCard(growCard, handleCard);
  if (growTwin) sectionResults.push(growTwin);

  if (data.sections.whyItMatters) {
    const whyCard = { title: "WHY IT MATTERS", items: content.whyItMatters, icon: "heart" as IconType };
    const wellnessCard = data.aiContent
      ? { title: "FOOD & WELLNESS", items: content.healthBenefits, icon: "bowl" as IconType }
      : null;
    const whyTwin = await buildTwinCard(whyCard, wellnessCard);
    if (whyTwin) sectionResults.push(whyTwin);
  }

  if (data.sections.popularWays) {
    sectionResults.push(await buildPopularWays(content, theme));
  }

  sectionResults.push(await buildQualityAndStory(data));
  sectionResults.push(await buildFooter(data, theme));

  const naturalH = sectionResults.reduce((sum, s) => sum + s.h, 0) + gap * (sectionResults.length - 1);

  let canvas = await buildBackground(data, theme, naturalH);

  let y = 0;
  const overlays: sharp.OverlayOptions[] = [];
  for (const section of sectionResults) {
    overlays.push({ input: section.buf, left: 0, top: Math.round(y) });
    y += section.h + gap;
  }
  canvas = await sharp(canvas).composite(overlays).png().toBuffer();

  // fit:"fill" is deliberate: naturalH (the stacked content) rarely matches
  // targetH exactly, and sharp's default fit ("cover") would CROP the
  // overflow instead of scaling it — silently cutting off the header or
  // footer. "fill" guarantees every section stays fully visible, at the
  // cost of a small, even vertical stretch/squeeze (usually under ~20%).
  return sharp(canvas).resize(targetW, targetH, { fit: "fill" }).png().toBuffer();
}
