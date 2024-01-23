import { createHash } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import sharp from "sharp";

async function renderImage(req: NextApiRequest, res: NextApiResponse<Buffer>) {
  const imageUrl = req.query.url as string;

  // Fetch image from url using fetch
  const imageBuf = await fetch(imageUrl).then(async (res) =>
    Buffer.from(await res.arrayBuffer())
  );

  const imageMetadata = await sharp(imageBuf).metadata();

  const image = await sharp(imageBuf)
    .resize({ width: Math.min(imageMetadata?.width || 624, 624) })
    .toFormat("png")
    .png({ quality: 100 })
    .toBuffer();

  res.setHeader("Content-Type", "image/png");
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  res.setHeader("ETag", `"${createHash("md5").update(image).digest("hex")}"`);

  res.send(image);
}

export default renderImage;
