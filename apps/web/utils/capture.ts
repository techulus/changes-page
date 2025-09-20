import { Capture } from "capture-node";

export function getPageScreenshotUrl(url: string) {
  const capture = new Capture(
    process.env.CAPTURE_API_KEY,
    process.env.CAPTURE_API_SECRET
  );

  return capture.buildImageUrl(url, {
    vw: 1280,
    vh: 720,
    scaleFactor: 1.5,
  });
}
