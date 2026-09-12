import { spawn, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import sharp from 'sharp';

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);

export const VOICE_OPTIONS: Record<string, {
  label:      string;
  name:       string;          // Microsoft edge-tts voice name (fallback / dev)
  piperModel: string;          // Piper TTS model name (self-hosted production)
  lang:       string;
  gender:     'Female' | 'Male';
  nllbLang:   string | null;   // NLLB language code for translation; null = English (no translation)
  style?:     string;
}> = {
  // ── English ──────────────────────────────────────────────────────────────
  'en-female':            { label: 'English — Female',            name: 'en-IN-NeerjaNeural',           piperModel: 'en_US-lessac-medium', lang: 'English', gender: 'Female', nllbLang: null },
  'en-female-expressive': { label: 'English — Female Expressive', name: 'en-IN-NeerjaExpressiveNeural', piperModel: 'en_US-lessac-medium', lang: 'English', gender: 'Female', nllbLang: null, style: 'Expressive' },
  'en-male':              { label: 'English — Male',              name: 'en-IN-PrabhatNeural',          piperModel: 'en_US-ryan-high',     lang: 'English', gender: 'Male',   nllbLang: null },
  // ── Hindi (full support: Piper hi_IN voice + NLLB translation) ───────────
  'hi-female':            { label: 'Hindi — Female',              name: 'hi-IN-SwaraNeural',            piperModel: 'hi-IN-SwaraNeural', lang: 'Hindi',   gender: 'Female', nllbLang: 'hin_Deva' },
  'hi-male':              { label: 'Hindi — Male',                name: 'hi-IN-MadhurNeural',           piperModel: 'hi-IN-MadhurNeural', lang: 'Hindi',   gender: 'Male',   nllbLang: 'hin_Deva' },
  // ── Kannada (NLLB translation + English Piper voice; native kn model not yet in piper-voices) ──
  'kn-female':            { label: 'Kannada — Female',            name: 'kn-IN-SapnaNeural',            piperModel: 'kn-IN-SapnaNeural', lang: 'Kannada', gender: 'Female', nllbLang: 'kan_Knda' },
  'kn-male':              { label: 'Kannada — Male',              name: 'kn-IN-GaganNeural',            piperModel: 'kn-IN-GaganNeural', lang: 'Kannada', gender: 'Male',   nllbLang: 'kan_Knda' },
  // ── Telugu (NLLB translation + English Piper voice; native te model not yet in piper-voices) ───
  'te-female':            { label: 'Telugu — Female',             name: 'te-IN-ShrutiNeural',           piperModel: 'te-IN-ShrutiNeural', lang: 'Telugu',  gender: 'Female', nllbLang: 'tel_Telu' },
  'te-male':              { label: 'Telugu — Male',               name: 'te-IN-MohanNeural',            piperModel: 'te-IN-MohanNeural',     lang: 'Telugu',  gender: 'Male',   nllbLang: 'tel_Telu' },
  // ── Tamil (NLLB translation + English Piper voice; native ta model not yet in piper-voices) ────
  'ta-female':            { label: 'Tamil — Female',              name: 'ta-IN-PallaviNeural',          piperModel: 'ta-IN-PallaviNeural', lang: 'Tamil',   gender: 'Female', nllbLang: 'tam_Taml' },
  'ta-male':              { label: 'Tamil — Male',                name: 'ta-IN-ValluvarNeural',         piperModel: 'ta-IN-ValluvarNeural',     lang: 'Tamil',   gender: 'Male',   nllbLang: 'tam_Taml' },
};

// ─── Content Styles & Highlights ────────────────────────────────────────────

export type ContentStyle = 'warm' | 'modern' | 'health' | 'festive' | 'trust' | 'promotional';
export type ContentHighlight = 'natural' | 'bulk' | 'festive_greeting' | 'delivery';

export const CONTENT_STYLE_OPTIONS: Record<ContentStyle, {
  label: string; description: string; emoji: string;
  intro: (fpoName: string, location: string | null) => string;
  farmer: (farmName: string, location: string | null, tags: string) => string;
  productOpener: (name: string, availability: string) => string;
  productCloser: string;
  cta: (fpoName: string) => string;
}> = {
  warm: {
    label: 'Warm & Storytelling', description: "Heartfelt, personal — farmer's story", emoji: '🤝',
    intro: (fpo, loc) => `Welcome to ${fpo}. ${loc ? `${loc}. ` : ''}Fresh, traceable produce — straight from the farmer's hands to your home.`,
    farmer: (farm, loc, tags) => `Meet ${farm}${loc ? `, a farm from ${loc}` : ''}. ${tags ? `Lovingly growing ${tags}.` : 'Dedicated to natural farming with heart.'}`,
    productOpener: (name, avail) => `${name}. ${avail} Grown with care, delivered with love.`,
    productCloser: 'Order now for farm-fresh goodness.',
    cta: (fpo) => `Order fresh produce directly from ${fpo}. We bring the farmer's love straight to your doorstep. Scan the QR or visit our store today.`,
  },
  modern: {
    label: 'Modern & Direct', description: 'Clean, punchy — no fluff', emoji: '⚡',
    intro: (fpo, loc) => `${fpo}. Fresh produce. No middlemen. ${loc ? `${loc}. ` : ''}Direct from farmer — maximum freshness guaranteed.`,
    farmer: (farm, loc, tags) => `Sourced from ${farm}${loc ? `, ${loc}` : ''}. ${tags ? `Specialising in ${tags}.` : 'Quality natural farming.'}`,
    productOpener: (name, avail) => `${name}. ${avail}`,
    productCloser: '',
    cta: (fpo) => `Shop now. Fresh. Direct. Fast. Order from ${fpo} today.`,
  },
  health: {
    label: 'Health Focused', description: 'Chemical-free, wholesome, nutritious', emoji: '🥗',
    intro: (fpo, loc) => `Welcome to ${fpo}. ${loc ? `${loc}. ` : ''}Naturally grown, wholesome produce — free from chemicals, full of nutrition.`,
    farmer: (farm, loc, tags) => `${farm}${loc ? ` in ${loc}` : ''} practises natural farming${tags ? `, growing chemical-free ${tags}` : ''} for your family's health.`,
    productOpener: (name, avail) => `${name} — naturally grown and chemical-free. ${avail}`,
    productCloser: 'Pure, natural, and healthy.',
    cta: (fpo) => `Choose health. Choose freshness. Order from ${fpo} and nourish your family with nature's best.`,
  },
  festive: {
    label: 'Festive & Seasonal', description: 'Celebratory — perfect for festivals', emoji: '🎉',
    intro: (fpo, loc) => `Greetings from ${fpo}! ${loc ? `${loc}. ` : ''}Celebrate every occasion with the finest fresh produce — straight from our farms to your table.`,
    farmer: (farm, loc, tags) => `From the fields of ${farm}${loc ? ` in ${loc}` : ''} — celebrating ${tags ? `the harvest of ${tags}` : "nature's finest produce"} this season!`,
    productOpener: (name, avail) => `Make your celebration special with ${name}! ${avail}`,
    productCloser: 'Order now for your festive table!',
    cta: (fpo) => `This season, celebrate with fresh farm produce from ${fpo}. Scan the QR code or visit our store — and make every meal a celebration!`,
  },
  trust: {
    label: 'Trust & Heritage', description: 'Credibility-first, traditional farming', emoji: '🏆',
    intro: (fpo, loc) => `Welcome to ${fpo}. ${loc ? `${loc}. ` : ''}Built on trust, rooted in tradition — bringing you the finest farm produce you can count on.`,
    farmer: (farm, loc, tags) => `${farm}${loc ? `, ${loc}` : ''} — a trusted farm with generations of expertise${tags ? ` in ${tags}` : ''}.`,
    productOpener: (name, avail) => `${name} — grown with generational expertise you can trust. ${avail}`,
    productCloser: 'Quality guaranteed.',
    cta: (fpo) => `Trust the source. Order from ${fpo} — farmer-grown, quality-assured, and delivered with integrity.`,
  },
  promotional: {
    label: 'Promotional & Deals', description: 'Price-forward, strong call-to-action', emoji: '💰',
    intro: (fpo, loc) => `Great prices on fresh farm produce! Welcome to ${fpo}. ${loc ? `${loc}. ` : ''}Direct from farmer — no middlemen, unbeatable value!`,
    farmer: (farm, loc, tags) => `Directly from ${farm}${loc ? `, ${loc}` : ''}${tags ? ` — fresh ${tags}` : ''} at the best prices.`,
    productOpener: (name, avail) => `Amazing value on ${name}! ${avail}`,
    productCloser: 'Limited stock — order now!',
    cta: (fpo) => `Order now from ${fpo} and save big! Fresh farm produce at the best prices — direct from farmer to your door. Do not miss out!`,
  },
};

export const CONTENT_HIGHLIGHT_OPTIONS: Record<ContentHighlight, { label: string; emoji: string }> = {
  natural:          { label: 'Chemical-free / Natural farming', emoji: '🌿' },
  bulk:             { label: 'Highlight bulk order deals',       emoji: '📦' },
  festive_greeting: { label: 'Add festive season greeting',      emoji: '✨' },
  delivery:         { label: 'Mention home delivery',            emoji: '🚚' },
};

// ─── AI Service configuration ─────────────────────────────────────────────────
// Set TTS_PROVIDER=piper in Docker to use self-hosted Piper TTS.
// Without it (dev), the original edge-tts is used as fallback.
// NLLB_URL and OLLAMA_URL are optional — graceful fallback when not set.

const TTS_PROVIDER  = process.env.TTS_PROVIDER  || 'edge';   // 'piper' | 'edge'
//const PIPER_TTS_URL = process.env.PIPER_TTS_URL || 'http://piper-tts:5001';
const NLLB_URL      = process.env.NLLB_URL      || '';
const OLLAMA_URL    = process.env.OLLAMA_URL    || '';
const OLLAMA_MODEL  = process.env.OLLAMA_MODEL  || 'llama3.2:3b';

// ─── CogVideoX — optional GPU image-to-video service ─────────────────────────
// CogVideoX is deliberately isolated in its own container because it requires
// a CUDA/PyTorch runtime and substantial GPU memory. The Node backend only
// prepares the source image/prompt and consumes the generated MP4.
const COGVIDEOX_URL = process.env.COGVIDEOX_URL || '';
const COGVIDEOX_ENABLED = process.env.COGVIDEOX_ENABLED !== 'false';
const COGVIDEOX_MAX_AI_SLIDES = Math.max(0, Number(process.env.COGVIDEOX_MAX_AI_SLIDES || 4));
const COGVIDEOX_STEPS = Math.max(4, Number(process.env.COGVIDEOX_STEPS || 15));
const COGVIDEOX_NUM_FRAMES = Math.max(9, Number(process.env.COGVIDEOX_NUM_FRAMES || 25));
const COGVIDEOX_GUIDANCE = Number(process.env.COGVIDEOX_GUIDANCE || 6);
const COGVIDEOX_FPS = Math.max(4, Number(process.env.COGVIDEOX_FPS || 16));
const COG_SHARED_DIR = process.env.COGVIDEOX_SHARED_DIR || '/shared';

const TTS_MAX_RETRIES = 3;

// ─── Piper TTS — HTTP call to self-hosted service ────────────────────────────

async function callPiperTTS(text: string, piperModel: string, outputPath: string): Promise<void> {
  console.log(`[Piper-TTS Input] Model: ${piperModel} | Text: "${text}"`);
  const resp = await fetch(`${PIPER_TTS_URL}/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice: piperModel }),
    signal: AbortSignal.timeout(90_000),
  });
  if (!resp.ok) {
    throw new Error(`Piper TTS error ${resp.status}: ${(await resp.text()).slice(0, 300)}`);
  }
  const buf = Buffer.from(await resp.arrayBuffer());
  fs.writeFileSync(outputPath, buf);
  console.log(`[Piper-TTS Output] Audio successfully generated and saved to: ${outputPath}`);
}

// ─── edge-tts — Microsoft Neural (dev / fallback when TTS_PROVIDER=edge) ─────

function resolvePython3(): string {
  try {
    const p = execSync('which python3', { encoding: 'utf8', timeout: 3000 }).trim();
    if (p) return p;
  } catch {}
  for (const c of [
    '/home/runner/workspace/.pythonlibs/bin/python3',
    '/usr/bin/python3',
    '/usr/local/bin/python3',
  ]) {
    if (fs.existsSync(c)) return c;
  }
  return 'python3';
}

const PYTHON3_BIN = TTS_PROVIDER === 'edge' ? resolvePython3() : '';

function attemptEdgeTTS(text: string, edgeVoice: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(PYTHON3_BIN, [
      '-m', 'edge_tts',
      '--voice', edgeVoice,
      '--text',  text,
      '--write-media', outputPath,
    ]);
    let stderr = '';
    const killer = setTimeout(() => {
      try { proc.kill('SIGKILL'); } catch {}
      reject(new Error('edge-tts timed out after 120s'));
    }, 120_000);
    proc.stderr.on('data', (d: Buffer) => { stderr += d.toString(); });
    proc.on('close', (code) => {
      clearTimeout(killer);
      if (code === 0) resolve();
      else reject(new Error(`edge-tts exit ${code}: ${stderr.slice(0, 300)}`));
    });
    proc.on('error', (err) => { clearTimeout(killer); reject(err); });
  });
}

// ─── NLLB-200 Translation — HTTP call to self-hosted service ─────────────────

async function callNLLBTranslate(text: string, targetLang: string): Promise<string> {
  console.log(`[NLLB Input] From: eng_Latn -> To: ${targetLang} | Text: "${text}"`);
  if (!NLLB_URL) return text;
  try {
    const resp = await fetch(`${NLLB_URL}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, source_lang: 'eng_Latn', target_lang: targetLang }),
      signal: AbortSignal.timeout(180_000),
    });
    if (!resp.ok) {
      const errText = await resp.text();
      console.error(`[NLLB Error Route] Server responded with code ${resp.status}: ${errText}`);
      return text;
    }
    
    const data: any = await resp.json();
    const translatedText = data.translated_text || data.translation || data.translated;
    console.log(`[NLLB Output] Translated Text: "${translatedText}"`);
    return translatedText || text;
    
   } catch (error: any) {
    // CRITICAL: Log the actual error instead of hiding it
    console.error(`[NLLB Network/Timeout Error]:`, error.message || error);
    return text; 
  } 
  //} catch {
  //  return text; // graceful fallback to English
  //}
}

// ─── Llama (Ollama) — AI script generation ───────────────────────────────────

export async function callLlamaScript(slideContext: string, style: string): Promise<string> {
  if (!OLLAMA_URL) return '';
  try {
    const prompt =
      `You are a marketing narrator for Santhe, an Indian agricultural marketplace connecting farmers with consumers.\n` +
      `Write a 2–3 sentence engaging voice narration for a video slide. Style: ${style}.\n` +
      `Be warm, natural, and concise. Use simple language suited for rural Indian audiences.\n` +
      `Slide content: ${slideContext}\n` +
      `Return ONLY the narration text. No quotes, no labels.`;

    const resp = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: OLLAMA_MODEL, prompt, stream: false }),
      signal: AbortSignal.timeout(60_000),
    });
    if (!resp.ok) return '';
    const data: any = await resp.json();
    return (data.response || '').trim().replace(/^["']|["']$/g, '');
  } catch {
    return ''; // graceful fallback to template narration
  }
}

// ─── Silent audio fallback ────────────────────────────────────────────────────

function generateSilentAudio(outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(FFMPEG_BIN, [
      '-y', '-f', 'lavfi', '-i', 'anullsrc=r=24000:cl=mono',
      '-t', '3', '-q:a', '9', '-acodec', 'libmp3lame', outputPath,
    ]);
    let stderr = '';
    proc.stderr.on('data', (d: Buffer) => { stderr += d.toString(); });
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`silent audio failed: ${stderr.slice(0, 200)}`));
    });
    proc.on('error', reject);
  });
}

// ─── Unified TTS entry point ──────────────────────────────────────────────────
// voiceKey: one of the keys in VOICE_OPTIONS (e.g. 'en-female', 'hi-male')
// Routes to Piper (self-hosted) or edge-tts (dev) based on TTS_PROVIDER env.
// Optionally translates text via NLLB-200 when nllbLang is set for the voice.

export async function generateTTS(text: string, voiceKey: string, outputPath: string): Promise<void> {
  const voiceOpt = VOICE_OPTIONS[voiceKey] ?? VOICE_OPTIONS['en-female'];
  let lastErr: Error | null = null;

  // Translate narration text only when:
  //   1. NLLB service is configured (NLLB_URL is set), AND
  //   2. Voice has a target language (nllbLang set), AND
  //   3. A NATIVE Piper model exists for that language (piperModel doesn't start with 'en_')
  //      — feeding Kannada/Telugu/Tamil script to an English Piper model produces garbage.
  //      For KN/TE/TA the nllbLang field is "future-ready" for when native models arrive.
  const hasNativePiperModel = !voiceOpt.piperModel.startsWith('en_');
  let ttsText = text;
  if (NLLB_URL && voiceOpt.nllbLang) { 
  ttsText = await callNLLBTranslate(text, voiceOpt.nllbLang);
  }
  //if (NLLB_URL && voiceOpt.nllbLang && hasNativePiperModel) {
  //  ttsText = await callNLLBTranslate(text, voiceOpt.nllbLang);
  //}

  for (let attempt = 1; attempt <= TTS_MAX_RETRIES; attempt++) {
    try {
      if (TTS_PROVIDER === 'piper') {
        await callPiperTTS(ttsText, voiceOpt.piperModel, outputPath);
      } else {
        await attemptEdgeTTS(ttsText, voiceOpt.name, outputPath);
      }
      return;
    } catch (err: any) {
      lastErr = err;
      console.warn(`[TTS] attempt ${attempt}/${TTS_MAX_RETRIES} failed: ${err.message}`);
      if (attempt < TTS_MAX_RETRIES) {
        await new Promise(r => setTimeout(r, attempt * 3000));
      }
    }
  }
  console.warn(`[TTS] all retries failed, using silent audio. Last error: ${lastErr?.message}`);
  try {
    await generateSilentAudio(outputPath);
  } catch (silentErr: any) {
    throw new Error(`TTS failed (${lastErr?.message}) and silent fallback also failed: ${silentErr.message}`);
  }
}

// ─── Slide data types ────────────────────────────────────────────────────────

export interface FpoVideoData {
  fpo: {
    orgName: string;
    orgLogoUrl?: string | null;
    orgPhone?: string | null;
    district?: string | null;
    deliveryDistricts?: string[];
    storeUrl?: string | null;
    qrCodeUrl?: string | null;
  };
  farmers: Array<{
    farmName: string;
    imageUrl?: string | null;
    logoUrl?: string | null;
    location?: string | null;
    tags?: any;
    farmImages?: string[];
  }>;
  products: Array<{
    name: string;
    imageUrl?: string | null;
    price: string | number;
    unit: string;
    harvestDate?: string | Date | null;
    availableUntil?: string | Date | null;
    isQuoteMode?: boolean;
    b2bQuantity?: number | null;
    b2cQuantity?: number | null;
    priceSlabs?: Array<{
      minQuantity: number;
      maxQuantity?: number | null;
      pricePerUnit: string | number;
      slabType: 'b2c' | 'b2b';
    }>;
  }>;
  event?: {
    title: string;
    description: string;
    eventType: string;
    location: string;
    address: string;
    startTime: string;
    endTime: string;
    pricePerSeat: string | number;
    coverImage?: string | null;
    nextDate?: string | null;
    activities?: Array<{ activityName: string; durationMinutes?: number | null }>;
    galleryImages?: string[];
  };
}

interface Slide {
  type: 'intro' | 'farmer' | 'product' | 'cta' | 'event';
  title: string;
  subtitle?: string;
  detail?: string;
  imageUrl?: string | null;      // main image: full-bleed bg OR qr code on cta
  bgImageUrl?: string | null;    // cta background image (separate from QR imageUrl)
  logoUrl?: string | null;       // small logo badge overlay (top-left circle)
  narration: string;
}

const COLORS = {
  intro:   { bg: '#1a5c38', accent: '#a8d5b5', text: '#ffffff', pill: '#2d8c57' },
  farmer:  { bg: '#2d4a1e', accent: '#c8e6a0', text: '#ffffff', pill: '#4a7c2e' },
  product: { bg: '#7b3f00', accent: '#ffd6b0', text: '#ffffff', pill: '#c07030' },
  cta:     { bg: '#1a5c38', accent: '#a8d5b5', text: '#ffffff', pill: '#2d8c57' },
  event:   { bg: '#1e3a1e', accent: '#b8e0a0', text: '#ffffff', pill: '#2d6e2d' },
};

const PLACEHOLDERS = {
  intro: '🌾', farmer: '👨‍🌾', product: '🌽', cta: '🛒', event: '🎪',
};

// ─── Build slide list ────────────────────────────────────────────────────────

export function buildSlides(
  data: FpoVideoData,
  contentStyle: ContentStyle = 'warm',
  highlights: ContentHighlight[] = [],
): Slide[] {
  const slides: Slide[] = [];
  const fpoName = data.fpo.orgName || 'Our FPO';
  const style = CONTENT_STYLE_OPTIONS[contentStyle] || CONTENT_STYLE_OPTIONS.warm;

  const hasNatural         = highlights.includes('natural');
  const hasBulk            = highlights.includes('bulk');
  const hasFestiveGreeting = highlights.includes('festive_greeting');
  const hasDelivery        = highlights.includes('delivery');

  // Build location and delivery info for intro slide
  const locationText = data.fpo.district ? `Located at ${data.fpo.district}` : null;
  const delivDistricts = (data.fpo.deliveryDistricts || []).filter(Boolean);

  const introSubtitle = locationText || 'FPO Marketplace';
  const introDetail = 'Fresh • Traceable • Direct from Farmer';
  let introNarration = style.intro(fpoName, locationText);
  if (hasFestiveGreeting) introNarration = `Wishing you a joyful festive season! ${introNarration}`;
  if (hasBulk) introNarration += ' Bulk orders welcome — great prices for retailers and businesses.';

  slides.push({
    type: 'intro',
    title: fpoName,
    subtitle: introSubtitle,
    detail: introDetail,
    imageUrl: data.fpo.orgLogoUrl,
    narration: introNarration,
  });

  // Dedicated delivery districts slide — clearly shows every area served
  if (delivDistricts.length > 0) {
    // Split districts into at most 2 lines of 4 each for the pill
    const line1 = delivDistricts.slice(0, 4).join('  •  ');
    const line2 = delivDistricts.length > 4 ? delivDistricts.slice(4, 8).join('  •  ') : null;
    const delivDetail = line2 ? `${line1} | ${line2}` : line1;
    slides.push({
      type: 'intro',
      title: 'We Deliver To',
      subtitle: delivDistricts.slice(0, 4).join('  •  '),
      detail: delivDistricts.length > 4 ? delivDistricts.slice(4).join('  •  ') : 'Fresh produce at your doorstep',
      imageUrl: data.fpo.orgLogoUrl,
      narration: `${fpoName} currently delivers fresh produce to ${delivDistricts.join(', ')}.${hasDelivery ? ' Fast, reliable delivery to your doorstep.' : ''}`,
    });
  }

  for (const f of data.farmers) {
    const tagsRaw = f.tags;
    const tagsArr: string[] = Array.isArray(tagsRaw)
      ? tagsRaw.slice(0, 3)
      : typeof tagsRaw === 'string'
      ? (tagsRaw as string).split(',').slice(0, 3).map((t: string) => t.trim())
      : [];
    const tagsStr = tagsArr.join(', ');

    // Main farmer intro slide (profile photo)
    let farmerNarration = style.farmer(f.farmName, f.location || null, tagsStr);
    if (hasNatural) farmerNarration += ' Using natural, chemical-free farming methods.';
    slides.push({
      type: 'farmer',
      title: f.farmName,
      subtitle: f.location || '',
      detail: tagsStr ? `Grows: ${tagsStr}` : 'Natural Farming',
      imageUrl: f.imageUrl,
      narration: farmerNarration,
    });

    // Farm gallery slides — up to 3 additional photos from the farm gallery
    const galleryImgs = (f.farmImages || []).filter(Boolean).slice(0, 3);
    galleryImgs.forEach((imgUrl, idx) => {
      slides.push({
        type: 'farmer',
        title: f.farmName,
        subtitle: f.location || '',
        detail: `Farm Tour ${idx + 1} / ${galleryImgs.length}`,
        imageUrl: imgUrl,
        narration: idx === 0
          ? `Take a look inside ${f.farmName}${f.location ? ` in ${f.location}` : ''}.`
          : `More from ${f.farmName}'s farm.`,
      });
    });
  }

  for (const p of data.products) {
    const isB2B = p.isQuoteMode || (p.b2bQuantity != null && p.b2bQuantity > 0);
    const isB2C = !p.isQuoteMode && (p.b2cQuantity == null || p.b2cQuantity > 0);
    const listingLabel = isB2B && isB2C ? 'B2B & B2C' : isB2B ? 'B2B (Bulk)' : 'B2C (Retail)';

    // ── Availability status ────────────────────────────────────────────────
    const now = new Date();
    const harvestDateObj = p.harvestDate ? new Date(p.harvestDate) : null;
    const isPreOrder = harvestDateObj !== null && harvestDateObj > now;
    const availabilityLabel = isPreOrder ? 'Pre-Order' : 'Available Now';
    const availabilityNarration = isPreOrder
      ? `Available for pre-order.`
      : `Available now.`;

    const b2cSlabs = (p.priceSlabs || [])
      .filter(s => s.slabType === 'b2c')
      .sort((a, b) => a.minQuantity - b.minQuantity);
    const b2bSlabs = (p.priceSlabs || [])
      .filter(s => s.slabType === 'b2b')
      .sort((a, b) => a.minQuantity - b.minQuantity);

    const fmtQty = (s: { minQuantity: number; maxQuantity?: number | null }, unit: string) =>
      s.maxQuantity ? `${s.minQuantity}–${s.maxQuantity} ${unit}` : `${s.minQuantity}+ ${unit}`;
    const fmtPrice = (s: { pricePerUnit: string | number }) =>
      `₹${Number(s.pricePerUnit).toFixed(0)}`;

    // ── Subtitle (one line) — includes availability label ─────────────────
    let subtitle: string;
    if (b2cSlabs.length > 0 || b2bSlabs.length > 0) {
      const parts: string[] = [];
      parts.push(availabilityLabel);
      if (b2cSlabs.length > 0) {
        const lo = Number(b2cSlabs[b2cSlabs.length - 1].pricePerUnit);
        const hi = Number(b2cSlabs[0].pricePerUnit);
        parts.push(lo === hi ? `Retail ₹${hi}/${p.unit}` : `Retail ₹${lo}–₹${hi}/${p.unit}`);
      }
      if (b2bSlabs.length > 0) {
        parts.push(`Bulk from ₹${Number(b2bSlabs[0].pricePerUnit).toFixed(0)}/${p.unit}`);
      }
      subtitle = parts.join('  •  ');
    } else {
      subtitle = `${availabilityLabel}  •  ₹${Number(p.price).toFixed(0)} / ${p.unit}`;
    }

    // ── Detail pill (bottom bar) — show top pricing tiers compactly ────────
    let detail: string;
    if (b2cSlabs.length > 0) {
      detail = b2cSlabs.slice(0, 2)
        .map(s => `${fmtQty(s, p.unit)}: ${fmtPrice(s)}`)
        .join(' | ');
      if (b2bSlabs.length > 0) {
        detail += `  •  Bulk ${fmtPrice(b2bSlabs[0])}+`;
      }
    } else {
      const formatShort = (d: string | Date | null | undefined) => {
        if (!d) return null;
        try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
        catch { return null; }
      };
      const harvest = formatShort(p.harvestDate);
      const until = formatShort(p.availableUntil);
      detail = harvest && until ? `Harvest: ${harvest} • Until: ${until}`
        : harvest ? `Harvested: ${harvest}`
        : until ? `Available till: ${until}`
        : listingLabel;
    }

    // ── Narration ─────────────────────────────────────────────────────────
    const formatShort = (d: string | Date | null | undefined) => {
      if (!d) return null;
      try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
      catch { return null; }
    };
    const harvest = formatShort(p.harvestDate);
    const until = formatShort(p.availableUntil);

    // Style-driven opener; pricing details follow in all styles for accuracy
    let narration = style.productOpener(p.name, availabilityNarration) + ' ';

    if (b2cSlabs.length > 0) {
      const slabLines = b2cSlabs.map(s => {
        const qty = s.maxQuantity
          ? `${s.minQuantity} to ${s.maxQuantity} ${p.unit}`
          : `${s.minQuantity} ${p.unit} and above`;
        return `${qty} at ₹${Number(s.pricePerUnit).toFixed(0)} per ${p.unit}`;
      });
      narration += `Retail price: ${slabLines.join(', ')}. `;
    } else {
      narration += `₹${Number(p.price).toFixed(0)} per ${p.unit}. `;
    }

    if (b2bSlabs.length > 0) {
      const slabLines = b2bSlabs.map(s => {
        const qty = s.maxQuantity
          ? `${s.minQuantity} to ${s.maxQuantity} ${p.unit}`
          : `${s.minQuantity} ${p.unit} and above`;
        return `${qty} at ₹${Number(s.pricePerUnit).toFixed(0)}`;
      });
      narration += `Bulk orders: ${slabLines.join(', ')}. `;
    } else if (isB2B) {
      narration += `Available for bulk orders. `;
    }

    if (harvest) narration += `Harvested ${harvest}. `;
    if (until) narration += `Available until ${until}. `;
    if (hasNatural && contentStyle !== 'health') narration += 'Grown without chemicals. ';
    if (hasBulk && b2bSlabs.length > 0) narration += 'Great bulk discounts available. ';
    if (style.productCloser) narration += style.productCloser + ' ';

    slides.push({
      type: 'product',
      title: p.name,
      subtitle,
      detail,
      imageUrl: p.imageUrl,
      narration: narration.replace(/  +/g, ' ').trim(),
    });
  }

  const storeUrl = data.fpo.storeUrl || null;
  const ctaSubtitle = storeUrl
    ? storeUrl
    : data.fpo.orgPhone
    ? `Call: ${data.fpo.orgPhone}`
    : 'Order on Santhe';
  let ctaNarration = style.cta(fpoName);
  if (hasDelivery) ctaNarration += ' We deliver fast, right to your doorstep.';

  slides.push({
    type: 'cta',
    title: `Shop Fresh — ${fpoName}`,
    subtitle: ctaSubtitle,
    detail: data.fpo.qrCodeUrl ? 'Scan the QR code to order now!' : 'Direct from Farmer to Your Home',
    imageUrl: data.fpo.qrCodeUrl || null,
    narration: ctaNarration,
  });

  return slides;
}

// ─── Event slide builder ─────────────────────────────────────────────────────

export function buildEventSlides(data: FpoVideoData): Slide[] {
  const ev = data.event!;
  const fpoName = data.fpo.orgName || 'Our FPO';
  const slides: Slide[] = [];

  const fmtDate = (d: string | null | undefined) => {
    if (!d) return null;
    try { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }); }
    catch { return null; }
  };

  const dateStr  = fmtDate(ev.nextDate);
  const priceNum = Number(ev.pricePerSeat);
  const priceStr = priceNum > 0 ? `₹${priceNum.toFixed(0)} per seat` : 'Contact us for pricing';
  const timeRange = `${ev.startTime} – ${ev.endTime}`;
  const evTypeCap = ev.eventType.charAt(0).toUpperCase() + ev.eventType.slice(1).replace(/_/g, ' ');

  // ── Build image pool from all sources ──────────────────────────────────────
  // Accept any absolute http(s) URL (e.g. Unsplash/Cloudinary) OR a relative
  // path (e.g. Openinary "/t/..." transform URL) — fetchImageBuffer() below
  // knows how to resolve relative paths to the Openinary container.
  const isUsableUrl = (u: any): u is string =>
    typeof u === 'string' && u.trim().length > 0 && (u.startsWith('http') || u.startsWith('/'));

  // 1. Farmer images (profile pics + farm galleries) — first farmer in list has priority
  const farmerProfileImgs: string[] = [];   // profile pics
  const farmGalleryImgs: string[]   = [];   // farm gallery / additional photos

  for (const f of (data.farmers || [])) {
    if (isUsableUrl(f.imageUrl))  farmerProfileImgs.push(f.imageUrl);
    if (Array.isArray(f.farmImages)) {
      for (const fi of f.farmImages) { if (isUsableUrl(fi)) farmGalleryImgs.push(fi); }
    }
    if (isUsableUrl(f.logoUrl) && !farmerProfileImgs.includes(f.logoUrl!)) {
      farmGalleryImgs.push(f.logoUrl!);
    }
  }

  // 2. Event gallery + cover
  const gallery       = (ev.galleryImages || []).filter(isUsableUrl);
  const eventCover    = isUsableUrl(ev.coverImage) ? ev.coverImage : null;

  // Combined pool: event gallery first, then farm images, then profiles
  const imgPool: string[] = [
    ...gallery,
    ...farmGalleryImgs,
    ...farmerProfileImgs,
  ].filter((v, i, a) => a.indexOf(v) === i); // deduplicate

  let poolIdx = 0;
  const nextPoolImg = (): string | null => imgPool.length > 0 ? imgPool[poolIdx++ % imgPool.length] : null;

  console.log(`[buildEventSlides] farmers=${data.farmers?.length ?? 0} profiles=${farmerProfileImgs.length} farmGallery=${farmGalleryImgs.length} eventGallery=${gallery.length} cover="${eventCover}" poolTotal=${imgPool.length}`);

  // ── Slide 1: Intro — FPO presents this event ────────────────────────────────
  // Background: event cover > first gallery > first farm image > first farmer profile
  // Each slide gets a DIFFERENT pool image by calling nextPoolImg() in sequence.
  // Pool order: [...gallery, ...farmGalleryImgs, ...farmerProfileImgs]
  const slide1Bg = eventCover || nextPoolImg() || null;
  slides.push({
    type: 'intro',
    title: fpoName,
    subtitle: 'Invites You To',
    detail: ev.title,
    imageUrl: slide1Bg,
    logoUrl: data.fpo.orgLogoUrl || null,
    narration: `${fpoName} is proud to present ${ev.title}. An exciting farm experience you will never forget.`,
  });

  // ── Slide 2: Event cover — title, date, location, price ────────────────────
  slides.push({
    type: 'event',
    title: ev.title,
    subtitle: dateStr ? `${dateStr}  •  ${ev.location}` : ev.location,
    detail: `${priceStr}  •  ${timeRange}`,
    imageUrl: eventCover || nextPoolImg() || slide1Bg || null,
    narration: `Join us for ${ev.title}${dateStr ? ` on ${dateStr}` : ''}. Located at ${ev.location}. From ${timeRange}. ${priceStr}.`,
  });

  // ── Slide 3: About the event — description ──────────────────────────────────
  const shortDesc = ev.description.length > 200
    ? ev.description.slice(0, 197).trim() + '…'
    : ev.description;
  slides.push({
    type: 'event',
    title: 'About the Event',
    subtitle: `${evTypeCap} Experience  •  ${ev.location}`,
    detail: ev.address || ev.location,
    imageUrl: nextPoolImg() || eventCover || slide1Bg || null,
    narration: shortDesc,
  });

  // ── Slide 4: Activities (if any) ────────────────────────────────────────────
  if (ev.activities && ev.activities.length > 0) {
    const actArr = ev.activities.slice(0, 4);
    const line1  = actArr.slice(0, 2).map(a => a.activityName).join('  •  ');
    const line2  = actArr.slice(2, 4).map(a => a.activityName).join('  •  ');
    slides.push({
      type: 'farmer',
      title: "What's Included",
      subtitle: line1,
      detail: line2 || evTypeCap,
      imageUrl: nextPoolImg() || eventCover || slide1Bg || null,
      narration: `The event includes ${actArr.map(a => a.activityName).join(', ')}. A truly immersive and memorable experience awaits.`,
    });
  }

  // ── Slides 5+: Event gallery photos (up to 3) ──────────────────────────────
  const galToShow = gallery.slice(0, 3);
  galToShow.forEach((img, idx) => {
    slides.push({
      type: 'event',
      title: ev.title,
      subtitle: ev.location,
      detail: 'Farm Experience',
      imageUrl: img,
      narration: idx === 0
        ? `Take a glimpse of what awaits you at ${ev.title}.`
        : idx === 1
        ? `Beautiful moments from our farm await you.`
        : `Join us for an unforgettable experience at ${ev.location}.`,
    });
  });

  // ── Slides: Farmer spotlight (each linked farmer with an image) ─────────────
  const farmersToFeature = (data.farmers || []).filter(f =>
    isUsableUrl(f.imageUrl) ||
    (Array.isArray(f.farmImages) && f.farmImages.some(isUsableUrl))
  ).slice(0, 2);

  farmersToFeature.forEach(f => {
    const profileImg = isUsableUrl(f.imageUrl) ? f.imageUrl : null;
    const firstFarmImg = Array.isArray(f.farmImages) ? f.farmImages.find(isUsableUrl) || null : null;
    const bgImg = firstFarmImg || profileImg || nextPoolImg();
    const tagStr = Array.isArray(f.tags) && f.tags.length > 0
      ? f.tags.slice(0, 3).join(' • ')
      : 'Fresh from the farm';
    slides.push({
      type: 'farmer',
      title: f.farmName,
      subtitle: f.location || ev.location,
      detail: tagStr,
      imageUrl: bgImg,
      narration: `Meet ${f.farmName}${f.location ? `, based in ${f.location}` : ''}. Fresh, natural produce grown with care.`,
    });
  });

  // ── CTA: Booking call-to-action ─────────────────────────────────────────────
  const ctaDetail = data.fpo.qrCodeUrl
    ? 'Scan the QR code to book your spot!'
    : data.fpo.storeUrl
    ? `Visit ${data.fpo.storeUrl}`
    : 'Contact us to book your spot!';

  // Pick a background image for CTA — advance the pool so it's a fresh image
  const ctaBg = nextPoolImg() || farmerProfileImgs[0] || farmGalleryImgs[farmGalleryImgs.length - 1] || slide1Bg || null;

  slides.push({
    type: 'cta',
    title: 'Book Your Spot!',
    subtitle: priceStr,
    detail: ctaDetail,
    imageUrl: data.fpo.qrCodeUrl || null,   // QR code
    bgImageUrl: ctaBg,                       // farm photo background behind QR
    narration: `Do not miss this incredible experience! Book your spot for ${ev.title} at just ${priceStr}. Seats are limited — ${data.fpo.qrCodeUrl ? 'scan the QR code' : data.fpo.storeUrl ? `visit ${data.fpo.storeUrl}` : 'contact us'} to register today. We look forward to seeing you!`,
  });

  return slides;
}

// ─── Slide PNG renderer ──────────────────────────────────────────────────────

async function fetchImageBuffer(url: string): Promise<Buffer | null> {
  try {
    // Direct routing to the Openinary container inside the Docker network
    let absoluteUrl = url;
    if (url.startsWith("/")) {
      const storageType = process.env.STORAGE_TYPE || "openinary";
      const openinaryUrl = process.env.OPENINARY_URL || "http://openinary:3000";
      
      if (storageType === "openinary") {
        absoluteUrl = `${openinaryUrl.replace(/\/$/, "")}${url}`;
      } else {
        const appUrl = process.env.APP_URL || "http://localhost:2000";
        absoluteUrl = `${appUrl.replace(/\/$/, "")}${url}`;
      }
    }
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(absoluteUrl, { signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function wrapText(text: string, maxChars = 22): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxChars) {
      if (cur) lines.push(cur.trim());
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  }
  if (cur) lines.push(cur.trim());
  return lines;
}

export async function generateSlidePng(slide: Slide, w: number, h: number): Promise<Buffer> {
  const c = COLORS[slide.type];

  const titleFontSize  = w < 800 ? 38 : 52;
  const subFontSize    = w < 800 ? 24 : 32;
  const detailFontSize = w < 800 ? 19 : 26;
  const titleLines     = wrapText(slide.title, w < 800 ? 18 : 24);

  const isCtaWithQr  = slide.type === 'cta' && !!slide.imageUrl;
  const useFullBleed = !isCtaWithQr && !!slide.imageUrl;
  // CTA slides can also have a separate farm photo background (bgImageUrl)
  const ctaHasBg     = isCtaWithQr && !!slide.bgImageUrl;

  // ── Layer 1 : Background ─────────────────────────────────────────────────
  let buf: Buffer;

  const buildPhotoBg = async (url: string): Promise<Buffer | null> => {
    const imgBuf = await fetchImageBuffer(url);
    if (!imgBuf) return null;
    try {
      return await sharp(imgBuf).resize(w, h, { fit: 'cover', position: 'centre' }).png().toBuffer();
    } catch { return null; }
  };

  if (useFullBleed) {
    buf = (await buildPhotoBg(slide.imageUrl!)) ?? (await buildColorBg(w, h, c));
  } else if (ctaHasBg) {
    // CTA with QR: use bgImageUrl as background photo
    buf = (await buildPhotoBg(slide.bgImageUrl!)) ?? (await buildColorBg(w, h, c));
  } else {
    // Solid-colour background (CTA with no bg, or no image at all)
    buf = await buildColorBg(w, h, c);
  }

  // ── Layer 2 : Gradient vignette (full-bleed & CTA-with-bg slides) ─────────
  if (useFullBleed || ctaHasBg) {
    const grad = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
        <defs>
          <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#000" stop-opacity="0.30"/>
            <stop offset="42%"  stop-color="#000" stop-opacity="0.05"/>
            <stop offset="52%"  stop-color="#000" stop-opacity="0.55"/>
            <stop offset="100%" stop-color="#000" stop-opacity="0.92"/>
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="url(#vg)"/>
      </svg>`
    );
    const gradBuf = await sharp(grad).png().toBuffer();
    buf = await sharp(buf).composite([{ input: gradBuf, blend: 'over' }]).png().toBuffer();
  }

  // ── Layer 3 : QR code (CTA only) ─────────────────────────────────────────
  if (isCtaWithQr) {
    const qrBuf = await fetchImageBuffer(slide.imageUrl!);
    if (qrBuf) {
      try {
        const qrSize = Math.round(Math.min(w, h) * 0.42);
        const radius = Math.round(qrSize * 0.06);
        const qrResized = await sharp(qrBuf).resize(qrSize, qrSize, { fit: 'fill' }).png().toBuffer();
        const card = await sharp({
          create: { width: qrSize, height: qrSize, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
        }).composite([{ input: qrResized }]).png().toBuffer();
        const mask = Buffer.from(
          `<svg width="${qrSize}" height="${qrSize}"><rect width="${qrSize}" height="${qrSize}" rx="${radius}" ry="${radius}" fill="white"/></svg>`
        );
        const clipped = await sharp(card).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
        buf = await sharp(buf).composite([{
          input: clipped,
          left: Math.round(w / 2 - qrSize / 2),
          top: Math.round(h * 0.10),
        }]).png().toBuffer();
      } catch { /* keep slide without QR */ }
    }
  }

  // ── Layer 3.5 : Logo badge overlay (intro slides) ────────────────────────
  if (slide.logoUrl) {
    const logoBuf = await fetchImageBuffer(slide.logoUrl);
    if (logoBuf) {
      try {
        const badgeSize = Math.round(Math.min(w, h) * 0.14); // ~14% of shorter side
        const pad = Math.round(Math.min(w, h) * 0.04);
        const resized = await sharp(logoBuf)
          .resize(badgeSize, badgeSize, { fit: 'cover', position: 'centre' })
          .png()
          .toBuffer();
        // Circle mask
        const mask = Buffer.from(
          `<svg width="${badgeSize}" height="${badgeSize}">` +
          `<circle cx="${badgeSize / 2}" cy="${badgeSize / 2}" r="${badgeSize / 2}" fill="white"/>` +
          `</svg>`
        );
        const circled = await sharp(resized)
          .composite([{ input: mask, blend: 'dest-in' }])
          .png()
          .toBuffer();
        // White border ring
        const ringSize = badgeSize + 6;
        const ring = await sharp({
          create: { width: ringSize, height: ringSize, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 230 } },
        })
          .composite([{
            input: Buffer.from(`<svg width="${ringSize}" height="${ringSize}"><circle cx="${ringSize/2}" cy="${ringSize/2}" r="${ringSize/2}" fill="white"/></svg>`),
            blend: 'dest-in',
          }])
          .png()
          .toBuffer();
        const badgeWithRing = await sharp(ring)
          .composite([{ input: circled, left: 3, top: 3 }])
          .png()
          .toBuffer();
        buf = await sharp(buf).composite([{
          input: badgeWithRing,
          left: pad,
          top: pad,
        }]).png().toBuffer();
      } catch { /* skip logo on error */ }
    }
  }

  // ── Layer 4 : Text overlay ───────────────────────────────────────────────
  const hasPhotoBg   = useFullBleed || ctaHasBg;
  const textColor    = '#ffffff';
  const accentColor  = hasPhotoBg ? '#d4f5d0' : c.accent;
  const pillFill     = hasPhotoBg ? 'rgba(0,0,0,0.55)' : c.pill;
  const strokeW      = hasPhotoBg ? 2 : 0;

  const titleStartY  = isCtaWithQr ? h * 0.57 : h * 0.61;
  const titleBlockH  = titleLines.length * titleFontSize * 1.25;

  const tx: string[] = [`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">`];

  // Fallback emoji for slides that have no image at all
  if (!slide.imageUrl && !slide.bgImageUrl && !isCtaWithQr) {
    const imgR  = Math.min(w, h) * 0.20;
    const imgCx = w / 2;
    const imgCy = h * 0.32;
    tx.push(`<circle cx="${imgCx}" cy="${imgCy}" r="${imgR + 6}" fill="${c.accent}" opacity="0.30"/>`);
    tx.push(`<circle cx="${imgCx}" cy="${imgCy}" r="${imgR}" fill="${c.bg}"/>`);
    tx.push(`<text x="${imgCx}" y="${imgCy + imgR * 0.38}" text-anchor="middle" font-size="${imgR * 1.1}">${PLACEHOLDERS[slide.type]}</text>`);
  }

  // Title
  titleLines.forEach((line, i) => {
    tx.push(
      `<text x="${w / 2}" y="${titleStartY + i * titleFontSize * 1.25}"` +
      ` text-anchor="middle" font-family="Noto Sans,Noto Sans Kannada,DejaVu Sans,sans-serif"` +
      ` font-size="${titleFontSize}" font-weight="900" fill="${textColor}"` +
      ` paint-order="stroke" stroke="rgba(0,0,0,0.6)" stroke-width="${strokeW}" stroke-linejoin="round"` +
      `>${esc(line)}</text>`
    );
  });

  // Subtitle
  if (slide.subtitle) {
    const sy = titleStartY + titleBlockH + 10;
    const sz = isCtaWithQr ? Math.round(subFontSize * 0.75) : subFontSize;
    tx.push(
      `<text x="${w / 2}" y="${sy}" text-anchor="middle"` +
      ` font-family="Noto Sans,Noto Sans Kannada,DejaVu Sans,sans-serif" font-size="${sz}" fill="${accentColor}"` +
      ` paint-order="stroke" stroke="rgba(0,0,0,0.5)" stroke-width="${strokeW}"` +
      `>${esc(slide.subtitle)}</text>`
    );
  }

  // Detail pill — supports 1 or 2 lines; splits on ' | ' separator or auto-splits long text
  if (slide.detail) {
    const pillW = w * 0.84;
    // Estimate max chars for one line (Arial ~0.54× char-width ratio)
    const maxChars = Math.floor(pillW / (detailFontSize * 0.56));
    let detailLines: string[];
    if (slide.detail.includes(' | ')) {
      detailLines = slide.detail.split(' | ').map(s => s.trim()).filter(Boolean);
    } else if (slide.detail.length > maxChars) {
      // Split on a bullet separator near the middle
      const parts = slide.detail.split(/\s{2,}•\s{2,}/);
      if (parts.length >= 2) {
        const mid = Math.ceil(parts.length / 2);
        detailLines = [
          parts.slice(0, mid).join('  •  '),
          parts.slice(mid).join('  •  '),
        ];
      } else {
        // Hard-split on space near midpoint
        const midIdx = Math.floor(slide.detail.length / 2);
        const splitAt = slide.detail.lastIndexOf(' ', midIdx);
        detailLines = splitAt > 0
          ? [slide.detail.slice(0, splitAt).trim(), slide.detail.slice(splitAt).trim()]
          : [slide.detail];
      }
    } else {
      detailLines = [slide.detail];
    }
    const lineH   = detailFontSize * 1.4;
    const pillH   = detailLines.length > 1 ? lineH * 2.2 : detailFontSize * 1.8;
    const pillTop = h * 0.89 - pillH * 0.75;
    const rx      = pillH / 2;
    tx.push(`<rect x="${(w - pillW) / 2}" y="${pillTop}" width="${pillW}" height="${pillH}" rx="${rx}" fill="${pillFill}" opacity="0.85"/>`);
    const baseY = detailLines.length > 1
      ? pillTop + pillH * 0.38
      : pillTop + pillH * 0.65;
    detailLines.forEach((line, i) => {
      tx.push(
        `<text x="${w / 2}" y="${baseY + i * lineH}" text-anchor="middle"` +
        ` font-family="Noto Sans,Noto Sans Kannada,DejaVu Sans,sans-serif" font-size="${detailFontSize}" fill="${textColor}">` +
        `${esc(line)}</text>`
      );
    });
  }

  tx.push('</svg>');

  const textBuf = await sharp(Buffer.from(tx.join(''))).png().toBuffer();
  buf = await sharp(buf).composite([{ input: textBuf, blend: 'over' }]).png().toBuffer();

  return buf;
}

// Solid-colour background helper
async function buildColorBg(w: number, h: number, c: { bg: string; accent: string }): Promise<Buffer> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${c.bg}"/>
        <stop offset="100%" stop-color="${c.bg}cc"/>
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <circle cx="${w * 0.08}" cy="${h * 0.08}" r="${w * 0.18}" fill="${c.accent}" opacity="0.10"/>
    <circle cx="${w * 0.92}" cy="${h * 0.92}" r="${w * 0.22}" fill="${c.accent}" opacity="0.08"/>
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}


// ─── CogVideoX helpers ────────────────────────────────────────────────────────

function cogEligibleSlide(slide: Slide): boolean {
  // Never animate QR-code CTA slides. Intro/delivery slides normally contain
  // only an organisation logo, which is not a useful I2V source.
  return Boolean(
    COGVIDEOX_URL &&
    COGVIDEOX_ENABLED &&
    slide.imageUrl &&
    slide.type !== 'cta' &&
    (slide.type === 'farmer' || slide.type === 'product' || slide.type === 'event')
  );
}

function buildCogPrompt(slide: Slide, contentStyle: ContentStyle): string {
  const base =
    'Create a premium, photorealistic agricultural promotional video from this exact source image. ' +
    'Preserve the identity, appearance, colors and composition of the main subject. ' +
    'Use subtle natural motion, realistic depth, gentle camera movement and cinematic lighting. ' +
    'Do not invent text, logos, labels, packaging, prices, people or objects. No captions or watermarks. ';

  if (slide.type === 'farmer') {
    return base +
      `Show a natural Indian farming environment. Keep the farmer's face and clothing consistent. ` +
      `Use a very gentle camera push-in and subtle natural movement such as breathing, blinking, ` +
      `soft movement of leaves or crops in the background. Marketing style: ${contentStyle}.`;
  }

  if (slide.type === 'product') {
    return base +
      `Keep the agricultural product visually accurate to the source. Add a slow cinematic push-in, ` +
      `subtle breeze and natural farm movement around the product. The product must remain the hero. ` +
      `Marketing style: ${contentStyle}.`;
  }

  return base +
    `Create an atmospheric farm/event moment with restrained camera movement and realistic environmental motion. ` +
    `Marketing style: ${contentStyle}.`;
}

async function callCogVideoX(params: {
  imagePath: string;
  outputPath: string;
  prompt: string;
  seed: number;
}): Promise<string | null> {
  if (!COGVIDEOX_URL || !COGVIDEOX_ENABLED) return null;

  try {
    const resp = await fetch(`${COGVIDEOX_URL.replace(/\/$/, '')}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_path: params.imagePath,
        output_path: params.outputPath,
        prompt: params.prompt,
        num_frames: COGVIDEOX_NUM_FRAMES,
        num_inference_steps: COGVIDEOX_STEPS,
        guidance_scale: COGVIDEOX_GUIDANCE,
        fps: COGVIDEOX_FPS,
        seed: params.seed,
      }),
      signal: AbortSignal.timeout(20 * 60_000),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      console.error(`[CogVideoX] HTTP ${resp.status}: ${detail.slice(0, 500)}`);
      return null;
    }

    const data: any = await resp.json();
    if (!data.output_path) {
      console.error('[CogVideoX] Service returned no output_path');
      return null;
    }

    console.log(`[CogVideoX] Generated ${data.output_path} in ${data.elapsed_seconds ?? '?'}s`);
    return data.output_path;
  } catch (error: any) {
    console.error(`[CogVideoX] Request failed: ${error?.message || error}`);
    return null;
  }
}

async function generateSlideTextOverlay(slide: Slide, w: number, h: number): Promise<Buffer> {
  const c = COLORS[slide.type];
  const titleFontSize  = w < 800 ? 38 : 52;
  const subFontSize    = w < 800 ? 24 : 32;
  const detailFontSize = w < 800 ? 19 : 26;
  const titleLines = wrapText(slide.title, w < 800 ? 18 : 24);

  const isCtaWithQr = slide.type === 'cta' && !!slide.imageUrl;
  const titleStartY = isCtaWithQr ? h * 0.57 : h * 0.61;
  const titleBlockH = titleLines.length * titleFontSize * 1.25;

  const tx: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">`,
    `<defs><linearGradient id="bottomShade" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0%" stop-color="#000" stop-opacity="0"/>` +
      `<stop offset="55%" stop-color="#000" stop-opacity="0.18"/>` +
      `<stop offset="100%" stop-color="#000" stop-opacity="0.78"/>` +
    `</linearGradient></defs>`,
    `<rect width="${w}" height="${h}" fill="url(#bottomShade)"/>`,
  ];

  titleLines.forEach((line, i) => {
    tx.push(
      `<text x="${w / 2}" y="${titleStartY + i * titleFontSize * 1.25}"` +
      ` text-anchor="middle" font-family="Noto Sans,Noto Sans Kannada,DejaVu Sans,sans-serif"` +
      ` font-size="${titleFontSize}" font-weight="900" fill="#ffffff"` +
      ` paint-order="stroke" stroke="#000000" stroke-opacity="0.60" stroke-width="2"` +
      `>${esc(line)}</text>`
    );
  });

  if (slide.subtitle) {
    const sy = titleStartY + titleBlockH + 10;
    tx.push(
      `<text x="${w / 2}" y="${sy}" text-anchor="middle"` +
      ` font-family="Noto Sans,Noto Sans Kannada,DejaVu Sans,sans-serif"` +
      ` font-size="${subFontSize}" fill="#d4f5d0"` +
      ` paint-order="stroke" stroke="#000000" stroke-opacity="0.50" stroke-width="2"` +
      `>${esc(slide.subtitle)}</text>`
    );
  }

  if (slide.detail) {
    const pillW = w * 0.84;
    const maxChars = Math.floor(pillW / (detailFontSize * 0.56));
    let detailLines: string[];
    if (slide.detail.includes(' | ')) {
      detailLines = slide.detail.split(' | ').map(s => s.trim()).filter(Boolean);
    } else if (slide.detail.length > maxChars) {
      const parts = slide.detail.split(/\s{2,}•\s{2,}/);
      if (parts.length >= 2) {
        const mid = Math.ceil(parts.length / 2);
        detailLines = [
          parts.slice(0, mid).join('  •  '),
          parts.slice(mid).join('  •  '),
        ];
      } else {
        const midIdx = Math.floor(slide.detail.length / 2);
        const splitAt = slide.detail.lastIndexOf(' ', midIdx);
        detailLines = splitAt > 0
          ? [slide.detail.slice(0, splitAt).trim(), slide.detail.slice(splitAt).trim()]
          : [slide.detail];
      }
    } else {
      detailLines = [slide.detail];
    }

    const lineH = detailFontSize * 1.4;
    const pillH = detailLines.length > 1 ? lineH * 2.2 : detailFontSize * 1.8;
    const pillTop = h * 0.89 - pillH * 0.75;
    const rx = pillH / 2;

    tx.push(
      `<rect x="${(w - pillW) / 2}" y="${pillTop}" width="${pillW}" height="${pillH}"` +
      ` rx="${rx}" fill="#000000" fill-opacity="0.55"/>`
    );

    const baseY = detailLines.length > 1
      ? pillTop + pillH * 0.38
      : pillTop + pillH * 0.65;

    detailLines.forEach((line, i) => {
      tx.push(
        `<text x="${w / 2}" y="${baseY + i * lineH}" text-anchor="middle"` +
        ` font-family="Noto Sans,Noto Sans Kannada,DejaVu Sans,sans-serif"` +
        ` font-size="${detailFontSize}" fill="#ffffff">` +
        `${esc(line)}</text>`
      );
    });
  }

  tx.push('</svg>');
  return sharp(Buffer.from(tx.join(''))).png().toBuffer();
}

async function buildCogVideoSegment(
  cogVideoPath: string,
  overlayPath: string,
  audioPath: string,
  outPath: string,
  w: number,
  h: number,
): Promise<void> {
  const vf =
    `[0:v]scale=${w}:${h}:force_original_aspect_ratio=increase,` +
    `crop=${w}:${h},fps=25,format=yuv420p[bg];` +
    `[2:v]format=rgba[ov];` +
    `[bg][ov]overlay=0:0:format=auto[v]`;

  return spawnFfmpeg([
    '-stream_loop', '-1',
    '-i', cogVideoPath,
    '-i', audioPath,
    '-loop', '1',
    '-i', overlayPath,
    '-filter_complex', vf,
    '-map', '[v]',
    '-map', '1:a:0',
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '20',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-shortest',
    outPath,
  ]);
}

// ─── FFmpeg helpers ───────────────────────────────────────────────────────────

function resolveFfmpeg(): string {
  // Try PATH first (works in most environments)
  try {
    const p = execSync('which ffmpeg', { encoding: 'utf8', timeout: 3000 }).trim();
    if (p) return p;
  } catch {}
  // Fallback: scan known nix locations
  const candidates = [
    '/nix/store/6myb4lpm5hkx3b5w8m49va8qq3gp834j-replit-runtime-path/bin/ffmpeg',
    '/usr/bin/ffmpeg',
    '/usr/local/bin/ffmpeg',
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  // Last resort: glob the nix store for any ffmpeg-full binary
  try {
    const found = execSync(
      "find /nix/store -maxdepth 3 -name 'ffmpeg' -type f 2>/dev/null | grep 'ffmpeg-full' | head -1",
      { encoding: 'utf8', timeout: 5000 }
    ).trim();
    if (found) return found;
  } catch {}
  return 'ffmpeg'; // let OS resolve it; will throw ENOENT with a clear message if missing
}

const FFMPEG_BIN = resolveFfmpeg();

function spawnFfmpeg(args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(FFMPEG_BIN, ['-y', ...args]);
    let stderr = '';
    proc.stderr.on('data', (d: Buffer) => { stderr += d.toString(); });
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exit ${code}: ${stderr.slice(-400)}`));
    });
    proc.on('error', reject);
  });
}

function buildSegment(pngPath: string, audioPath: string, outPath: string, w: number, h: number): Promise<void> {
  return spawnFfmpeg([
    '-loop', '1', '-i', pngPath,
    '-i', audioPath,
    '-c:v', 'libx264', '-tune', 'stillimage', '-preset', 'fast',
    '-c:a', 'aac', '-b:a', '128k',
    '-pix_fmt', 'yuv420p',
    '-r', '25',
    '-vf', `scale=${w}:${h}`,
    '-shortest',
    outPath,
  ]);
}

function concatenateSegments(listPath: string, outPath: string): Promise<void> {
  return spawnFfmpeg([
    '-f', 'concat', '-safe', '0', '-i', listPath,
    '-c', 'copy',
    outPath,
  ]);
}

// ─── Main entry point ─────────────────────────────────────────────────────────

const JOB_TIMEOUT_MS = 60 * 60_000; // 60-minute hard limit; CogVideoX runs sequentially on the dedicated GPU container.

export async function generateMarketingVideo(params: {
  data: FpoVideoData;
  voice: string;
  aspectRatio: '9:16' | '16:9';
  contentStyle?: ContentStyle;
  highlights?: ContentHighlight[];
  tmpDir: string;
  onProgress?: (msg: string) => void;
}): Promise<string> {
  const { data, voice, aspectRatio, contentStyle = 'warm', highlights = [], tmpDir, onProgress } = params;
  const progress = onProgress ?? (() => {});

  // Wrap entire generation in an absolute timeout
  let jobTimedOut = false;
  const jobTimer = setTimeout(() => { jobTimedOut = true; }, JOB_TIMEOUT_MS);

  const checkTimeout = () => {
    if (jobTimedOut) throw new Error(`Video generation timed out after ${JOB_TIMEOUT_MS / 60000} minutes`);
  };

  try {
    await mkdir(tmpDir, { recursive: true });

    const w = aspectRatio === '9:16' ? 720 : 1280;
    const h = aspectRatio === '9:16' ? 1280 : 720;
    const voiceKey = VOICE_OPTIONS[voice] ? voice : 'en-female';

    const slides = data.event ? buildEventSlides(data) : buildSlides(data, contentStyle, highlights);
    const total = slides.length;
    progress(`Preparing ${total} slides…`);

    // ── Optional: enhance narrations with Llama (if OLLAMA_URL is configured) ─
    if (OLLAMA_URL) {
      progress('Generating AI narration scripts…');
      checkTimeout();
      await Promise.all(slides.map(async (slide) => {
        const ctx = [slide.title, slide.subtitle, slide.detail].filter(Boolean).join('. ');
        const enhanced = await callLlamaScript(ctx, contentStyle);
        if (enhanced) slide.narration = enhanced;
      }));
    }

    // ── Phase 1: generate all PNGs + TTS in parallel ─────────────────────────
    progress(`Generating slide images and voice narration (${total} slides)…`);
    checkTimeout();

    const pngPaths = slides.map((_, i) => path.join(tmpDir, `slide_${i}.png`));
    const audPaths = slides.map((_, i) => path.join(tmpDir, `audio_${i}.mp3`));
    const segPaths = slides.map((_, i) => path.join(tmpDir, `seg_${i}.mp4`));

    // CogVideoX needs a shared filesystem because it runs in a separate GPU container.
    const cogJobDir = path.join(COG_SHARED_DIR, path.basename(tmpDir));
    const cogInputPaths = slides.map((_, i) => path.join(cogJobDir, `cog_input_${i}.png`));
    const cogOutputPaths = slides.map((_, i) => path.join(cogJobDir, `cog_output_${i}.mp4`));
    const cogOverlayPaths = slides.map((_, i) => path.join(tmpDir, `cog_overlay_${i}.png`));

    if (COGVIDEOX_URL && COGVIDEOX_ENABLED) {
      await mkdir(cogJobDir, { recursive: true });
    }

    await Promise.all(slides.map(async (slide, i) => {
      checkTimeout();
      const png = await generateSlidePng(slide, w, h);
      await writeFile(pngPaths[i], png);
      await generateTTS(slide.narration, voiceKey, audPaths[i]);
    }));

    checkTimeout();

    // ── Phase 2: generate cinematic I2V clips on the dedicated GPU service ────
    // Run one CogVideoX request at a time. This protects the GPU from OOM and
    // keeps the existing Ollama/NLLB/TTS pipeline independent.
    let cogCount = 0;
    const cogVideos: Array<string | null> = slides.map(() => null);

    if (COGVIDEOX_URL && COGVIDEOX_ENABLED && COGVIDEOX_MAX_AI_SLIDES > 0) {
      progress(`Generating cinematic AI motion clips (up to ${COGVIDEOX_MAX_AI_SLIDES})…`);

      for (let i = 0; i < slides.length && cogCount < COGVIDEOX_MAX_AI_SLIDES; i++) {
        checkTimeout();
        const slide = slides[i];
        if (!cogEligibleSlide(slide)) continue;

        const sourceBuf = await fetchImageBuffer(slide.imageUrl!);
        if (!sourceBuf) {
          console.warn(`[CogVideoX] Could not fetch source image for slide ${i + 1}; using static slide.`);
          continue;
        }

        await writeFile(cogInputPaths[i], sourceBuf);

        const prompt = buildCogPrompt(slide, contentStyle);
        progress(`Animating slide ${i + 1} / ${total} with CogVideoX…`);

        const generated = await callCogVideoX({
          imagePath: cogInputPaths[i],
          outputPath: cogOutputPaths[i],
          prompt,
          seed: 1000 + i,
        });

        if (generated && fs.existsSync(generated)) {
          cogVideos[i] = generated;
          cogCount++;
        } else {
          console.warn(`[CogVideoX] Slide ${i + 1} fell back to static image.`);
        }
      }
    }

    checkTimeout();
    progress(`Encoding ${total} video segments…`);

    // ── Phase 3: combine AI motion + TTS, with static fallback ───────────────
    for (let i = 0; i < slides.length; i++) {
      checkTimeout();
      progress(`Encoding slide ${i + 1} / ${total}…`);

      if (cogVideos[i]) {
        const overlay = await generateSlideTextOverlay(slides[i], w, h);
        await writeFile(cogOverlayPaths[i], overlay);

        await buildCogVideoSegment(
          cogVideos[i]!,
          cogOverlayPaths[i],
          audPaths[i],
          segPaths[i],
          w,
          h,
        );
      } else {
        await buildSegment(pngPaths[i], audPaths[i], segPaths[i], w, h);
      }
    }

    checkTimeout();
    progress('Combining segments into final video…');

    const listPath = path.join(tmpDir, 'concat_list.txt');
    await writeFile(listPath, segPaths.map(p => `file '${p}'`).join('\n'));

    const outPath = path.join(tmpDir, 'marketing_video.mp4');
    await concatenateSegments(listPath, outPath);

    progress('Done.');
    return outPath;

  } finally {
    clearTimeout(jobTimer);
    // CogVideoX input/output files live in the shared Docker volume.
    // Best-effort cleanup prevents the GPU container's disk from filling up.
    if (COGVIDEOX_URL && COGVIDEOX_ENABLED) {
      try {
        const cogJobDir = path.join(COG_SHARED_DIR, path.basename(tmpDir));
        await cleanupDir(cogJobDir);
      } catch {}
    }
  }
}

// ─── Cleanup ──────────────────────────────────────────────────────────────────

export async function cleanupDir(dir: string): Promise<void> {
  try {
    const files = fs.readdirSync(dir);
    await Promise.all(files.map(f => unlink(path.join(dir, f)).catch(() => {})));
    fs.rmdirSync(dir);
  } catch { /* best effort */ }
}
