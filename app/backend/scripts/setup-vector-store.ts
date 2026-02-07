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
  console.log("🚀 Tax-Free Vector Store 설정 시작\n");

  console.log("1️⃣ Vector Store 생성 중...");
  const vectorStore = await openai.beta.vectorStores.create({
    name: "Tax-Free Knowledge Base",
    metadata: {
      project: "tax-free",
      version: "1.0",
      created_at: new Date().toISOString(),
    },
  });

  console.log(`✅ Vector Store 생성 완료: ${vectorStore.id}\n`);

  const pdfDir = path.join(process.cwd(), "public/tax-pdfs");
  console.log(`2️⃣ ${PDF_FILES.length}개 PDF 파일 업로드 중...\n`);

  const fileIds: string[] = [];

  for (const fileName of PDF_FILES) {
    const filePath = path.join(pdfDir, fileName);

    if (!fs.existsSync(filePath)) {
      console.error(`❌ 파일을 찾을 수 없습니다: ${fileName}`);
      continue;
    }

    console.log(`   📄 업로드 중: ${fileName}...`);

    const fileStream = fs.createReadStream(filePath);
    const file = await openai.files.create({
      file: fileStream,
      purpose: "assistants",
    });

    fileIds.push(file.id);
    console.log(`   ✓ 완료 (ID: ${file.id})`);
  }

  console.log(`\n✅ ${fileIds.length}개 파일 업로드 완료\n`);

  console.log("3️⃣ Vector Store에 파일 추가 중...\n");

  for (let i = 0; i < fileIds.length; i += 1) {
    await openai.beta.vectorStores.files.create(vectorStore.id, {
      file_id: fileIds[i],
    });
    console.log(`   ✓ 파일 ${i + 1}/${fileIds.length} 추가 완료`);
  }

  console.log("\n4️⃣ 벡터화 진행 중...\n");

  let status = "in_progress";
  let previousCompleted = 0;

  while (status === "in_progress") {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const vs = await openai.beta.vectorStores.retrieve(vectorStore.id);
    status = vs.status;

    const completed = vs.file_counts.completed;
    const total = vs.file_counts.total;

    if (completed > previousCompleted) {
      console.log(`   진행률: ${completed}/${total} 파일 처리 완료`);
      previousCompleted = completed;
    }
  }

  const finalVS = await openai.beta.vectorStores.retrieve(vectorStore.id);

  console.log("\n🎉 설정 완료!\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("다음 내용을 .env.local 파일에 추가하세요:\n");
  console.log(`VECTOR_STORE_ID=${vectorStore.id}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log(`상태: ${finalVS.status}`);
  console.log(`총 파일: ${finalVS.file_counts.total}개`);
  console.log(`처리 완료: ${finalVS.file_counts.completed}개`);
  console.log(`실패: ${finalVS.file_counts.failed}개`);
}

main().catch((error) => {
  console.error("Vector Store setup failed:", error);
  process.exit(1);
});
