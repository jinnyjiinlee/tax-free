import OpenAI from "openai";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const PDF_FILES = ["25년세금절약가이드1권.pdf"];

async function main() {
  const pdfDir = path.join(process.cwd(), "public/tax-pdfs");
  const fileIds: string[] = [];

  for (const fileName of PDF_FILES) {
    const filePath = path.join(pdfDir, fileName);

    if (!fs.existsSync(filePath)) {
      console.error(`❌ 파일을 찾을 수 없습니다: ${fileName}`);
      continue;
    }

    const fileStream = fs.createReadStream(filePath);
    const file = await openai.files.create({
      file: fileStream,
      purpose: "assistants",
    });

    fileIds.push(file.id);
    console.log(`${fileName}: ${file.id}`);
  }

  if (fileIds.length === 0) {
    console.log("업로드된 파일이 없습니다.");
  }
}

main().catch((error) => {
  console.error("PDF upload failed:", error);
  process.exit(1);
});
