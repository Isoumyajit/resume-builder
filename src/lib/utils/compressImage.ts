const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_DIMENSION = 200;
const JPEG_QUALITY = 0.8;
const ACCEPTED_TYPES = ["image/jpeg", "image/png"];

export class ImageCompressionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageCompressionError";
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new ImageCompressionError("Failed to load image"));
    img.src = src;
  });
}

/**
 * Compresses an image file by resizing it to fit within MAX_DIMENSION x MAX_DIMENSION
 * and encoding as JPEG at the specified quality.
 *
 * @returns base64 data URL of the compressed image
 * @throws ImageCompressionError for invalid type, oversized files, or processing failures
 */
export async function compressImage(file: File): Promise<string> {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new ImageCompressionError(
      "Invalid file type. Only JPEG and PNG are accepted.",
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new ImageCompressionError("File is too large. Maximum size is 2MB.");
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () =>
      reject(new ImageCompressionError("Failed to read file"));
    reader.readAsDataURL(file);
  });

  const img = await loadImage(dataUrl);

  const canvas = document.createElement("canvas");
  let { width, height } = img;

  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new ImageCompressionError("Canvas context unavailable");
  }

  ctx.drawImage(img, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}
