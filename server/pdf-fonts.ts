import path from "path";
import type PDFDocument from "pdfkit";

/**
 * PDFKit's built-in Helvetica/Helvetica-Bold fonts only support the
 * WinAnsi/Latin-1 character set. Any Kannada (or other non-Latin) text
 * passed to doc.text() while one of those fonts is active gets silently
 * re-mapped through Latin-1 and comes out as mojibake
 * (e.g. "ÊL°Ëü—Ìb¹Ì¬²ÌÜ²" instead of a farmer's actual Kannada name).
 *
 * Fix: embed a Kannada-capable TTF (Noto Sans Kannada) and pick it
 * dynamically per string based on whether that string actually contains
 * Kannada characters. Latin-only strings still use Helvetica so existing
 * layout/kerning is unaffected.
 */

const FONT_DIR = path.join(__dirname, "..", "assets", "fonts");

export const KANNADA_FONT = "Kannada";
export const KANNADA_FONT_BOLD = "Kannada-Bold";

// Kannada Unicode block: U+0C80–U+0CFF
const KANNADA_RANGE = /[\u0C80-\u0CFF]/;

/** Register the Kannada fonts on a freshly-created PDFDocument. Call this
 *  once per `doc` right after construction, before any .text() calls. */
export function registerKannadaFonts(doc: PDFKit.PDFDocument): void {
  doc.registerFont(KANNADA_FONT, path.join(FONT_DIR, "NotoSansKannada-Regular.ttf"));
  doc.registerFont(KANNADA_FONT_BOLD, path.join(FONT_DIR, "NotoSansKannada-Bold.ttf"));
}

/** Returns the correct font name for a given piece of text — Kannada font
 *  if the text contains Kannada script, Helvetica otherwise. Use this
 *  wherever you render user-generated content (names, addresses, product
 *  names) that might be in Kannada. Static English UI labels you wrote
 *  yourself (e.g. "Product Catalog") don't need this. */
export function pdfFont(text: string | null | undefined, bold = false): string {
  const str = text || "";
  if (KANNADA_RANGE.test(str)) {
    return bold ? KANNADA_FONT_BOLD : KANNADA_FONT;
  }
  return bold ? "Helvetica-Bold" : "Helvetica";
}
