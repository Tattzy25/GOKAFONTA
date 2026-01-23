import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

export interface ImageProcessingOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

/**
 * Process an image buffer with Sharp.js
 */
export async function processImageBuffer(
  inputBuffer: Buffer,
  options: ImageProcessingOptions = {}
): Promise<Buffer> {
  const {
    width,
    height,
    quality = 80,
    format = 'webp',
    fit = 'cover'
  } = options;

  let pipeline = sharp(inputBuffer);

  if (width || height) {
    pipeline = pipeline.resize(width, height, { fit, withoutEnlargement: true });
  }

  switch (format) {
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality, mozjpeg: true });
      break;
    case 'png':
      pipeline = pipeline.png({ quality });
      break;
    case 'webp':
      pipeline = pipeline.webp({ quality });
      break;
    case 'avif':
      pipeline = pipeline.avif({ quality });
      break;
  }

  return pipeline.toBuffer();
}

/**
 * Process an image file with Sharp.js using promises
 */
export async function processImageFile(
  inputPath: string,
  outputPath: string,
  options: ImageProcessingOptions = {}
): Promise<void> {
  const {
    width,
    height,
    quality = 80,
    format = 'webp',
    fit = 'cover'
  } = options;

  let pipeline = sharp(inputPath).rotate();

  if (width || height) {
    pipeline = pipeline.resize(width, height, { fit, withoutEnlargement: true });
  }

  switch (format) {
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality, mozjpeg: true });
      break;
    case 'png':
      pipeline = pipeline.png({ quality });
      break;
    case 'webp':
      pipeline = pipeline.webp({ quality });
      break;
    case 'avif':
      pipeline = pipeline.avif({ quality });
      break;
  }

  await pipeline.toFile(outputPath);
}

/**
 * Create a new image programmatically
 */
export async function createImage(
  options: {
    width: number;
    height: number;
    channels?: number;
    background: { r: number; g: number; b: number; alpha?: number };
  }
): Promise<Buffer> {
  const { width, height, channels = 4, background } = options;

  return sharp({
    create: {
      width,
      height,
      channels: channels as any,
      background
    }
  })
  .png()
  .toBuffer();
}

/**
 * Apply rounded corners to an image using SVG mask
 */
export async function applyRoundedCorners(
  inputBuffer: Buffer,
  cornerRadius: number,
  size?: { width: number; height: number }
): Promise<Buffer> {
  const { width = 200, height = 200 } = size || {};

  const roundedCornersSvg = Buffer.from(
    `<svg><rect x="0" y="0" width="${width}" height="${height}" rx="${cornerRadius}" ry="${cornerRadius}"/></svg>`
  );

  return sharp(inputBuffer)
    .resize(width, height)
    .composite([{
      input: roundedCornersSvg,
      blend: 'dest-in'
    }])
    .png()
    .toBuffer();
}

/**
 * Process image with streaming (for large files)
 */
export function createRoundedCornerProcessor(
  cornerRadius: number,
  size: { width: number; height: number } = { width: 200, height: 200 }
) {
  const { width, height } = size;

  const roundedCornersSvg = Buffer.from(
    `<svg><rect x="0" y="0" width="${width}" height="${height}" rx="${cornerRadius}" ry="${cornerRadius}"/></svg>`
  );

  return sharp()
    .resize(width, height)
    .composite([{
      input: roundedCornersSvg,
      blend: 'dest-in'
    }])
    .png();
}

/**
 * Validate image file
 */
export async function validateImage(inputPath: string): Promise<{
  width: number;
  height: number;
  format: string;
  size: number;
}> {
  const metadata = await sharp(inputPath).metadata();
  const stats = await fs.stat(inputPath);

  return {
    width: metadata.width || 0,
    height: metadata.height || 0,
    format: metadata.format || 'unknown',
    size: stats.size
  };
}

/**
 * Batch process multiple images
 */
export async function batchProcessImages(
  inputs: Array<{ inputPath: string; outputPath: string; options?: ImageProcessingOptions }>,
  concurrency: number = 3
): Promise<void> {
  const chunks = [];
  for (let i = 0; i < inputs.length; i += concurrency) {
    chunks.push(inputs.slice(i, i + concurrency));
  }

  for (const chunk of chunks) {
    await Promise.all(
      chunk.map(({ inputPath, outputPath, options }) =>
        processImageFile(inputPath, outputPath, options)
      )
    );
  }
}

/**
 * Get image metadata without processing
 */
export async function getImageMetadata(inputPath: string) {
  return sharp(inputPath).metadata();
}

/**
 * Convert image format
 */
export async function convertImageFormat(
  inputBuffer: Buffer,
  fromFormat: string,
  toFormat: 'jpeg' | 'png' | 'webp' | 'avif',
  quality: number = 80
): Promise<Buffer> {
  let pipeline = sharp(inputBuffer);

  switch (toFormat) {
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality, mozjpeg: true });
      break;
    case 'png':
      pipeline = pipeline.png({ quality });
      break;
    case 'webp':
      pipeline = pipeline.webp({ quality });
      break;
    case 'avif':
      pipeline = pipeline.avif({ quality });
      break;
  }

  return pipeline.toBuffer();
}
