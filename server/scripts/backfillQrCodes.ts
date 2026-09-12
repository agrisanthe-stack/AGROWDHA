import { db } from "@db";
import { users } from "@shared/schema.ts";
import { eq, isNull } from "drizzle-orm";
import { generateAndUploadQRCode } from "../qrCodeUtils";

async function backfillQrCodes() {
  const dms = await db.query.users.findMany({
    where: (u, { eq, and, isNull }) =>
      and(eq(u.role, "district_manager"), isNull(u.orgQrCodeUrl))
  });

  console.log(`Found ${dms.length} DMs without QR codes`);

  for (const dm of dms) {
    const orgSlug = dm.orgSlug;
    if (!orgSlug) {
      console.log(`  Skipping DM ${dm.id} (${dm.username}) - no orgSlug`);
      continue;
    }
    console.log(`  Generating QR for DM ${dm.id} (${dm.username}) slug=${orgSlug} ...`);
    try {
      const qrUrl = await generateAndUploadQRCode(orgSlug, dm.orgLogoUrl);
      if (qrUrl) {
        await db.update(users)
          .set({ orgQrCodeUrl: qrUrl })
          .where(eq(users.id, dm.id));
        console.log(`    ✅ QR uploaded: ${qrUrl}`);
      } else {
        console.log(`    ⚠️  QR generation returned null`);
      }
    } catch (err) {
      console.error(`    ❌ Error:`, err);
    }
  }
  console.log("Done.");
  process.exit(0);
}

backfillQrCodes();
