import sharp from "sharp";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imgDir = path.join(__dirname, "../public/assets/img");

const images = [
  { name: "banner.jpg", width: 1920, height: 1080, quality: 80, retina: true },
  { name: "book-2020-war.png", width: 340, height: 488, quality: 80 },
  { name: "book-gothic.png", width: 340, height: 488, quality: 80 },
  { name: "book-time-traveler.png", width: 340, height: 488, quality: 80 },
  { name: "book-doctor-who.png", width: 340, height: 488, quality: 80 },
  { name: "book-siloed.png", width: 340, height: 488, quality: 80 },
  { name: "logo.png", width: 180, height: 60, quality: 95 },
];

async function convertImages() {
  console.log("Bắt đầu quá trình chuyển đổi hình ảnh...\n");

  for (const img of images) {
    const inputPath = path.join(imgDir, img.name);
    const outputPath = path.join(
      imgDir,
      img.name.replace(/\.(jpg|png)$/, ".webp")
    );

    try {
      const stats = await fs.stat(inputPath);
      const originalSize = (stats.size / 1024).toFixed(2);

      await sharp(inputPath)
        .resize(img.width, img.height, {
          fit: "cover",
          position: "center",
        })
        .webp({ quality: img.quality })
        .toFile(outputPath);

      const newStats = await fs.stat(outputPath);
      const newSize = (newStats.size / 1024).toFixed(2);
      const savings = ((1 - newStats.size / stats.size) * 100).toFixed(1);

      console.log(`✓ ${img.name}`);
      console.log(
        `  Ảnh gốc: ${originalSize}KB → WebP: ${newSize}KB (Giảm ${savings}%)\n`
      );
    } catch (error) {
      console.error(`✗ Lỗi khi chuyển đổi ${img.name}:`, error.message);
    }
  }

  console.log("Quá trình chuyển đổi hình ảnh hoàn tất!");
}

convertImages();
