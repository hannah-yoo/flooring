import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const baseId = "app0gYEl62r82qDqK";
const tableName = "CSM용 시트";
const outputPath = process.argv[2];
const token = process.env.AIRTABLE_TOKEN;
const fields = [
  "장판 이름 (한글)",
  "장판 이름 (영어)",
  "사진 image",
  "두께 Thickness",
  "촉감 Softness",
  "제작 목적 purpose",
  "장판 시리즈 series",
  "제조사 brand",
  "평당 가격",
];

if (!token) throw new Error("Missing AIRTABLE_TOKEN environment variable");
if (!outputPath) throw new Error("Pass output JSON path as the first argument");

const records = [];
let offset;

do {
  const url = new URL(
    `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`
  );
  url.searchParams.set("pageSize", "100");
  for (const field of fields) url.searchParams.append("fields[]", field);
  if (offset) url.searchParams.set("offset", offset);

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`Airtable request failed with status ${response.status}`);
  }

  const page = await response.json();
  if (!Array.isArray(page.records)) {
    throw new Error("Airtable response did not include records");
  }

  records.push(...page.records);
  offset = page.offset;
} while (offset);

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, JSON.stringify({ records }), "utf8");
console.log(`Wrote ${records.length} Airtable records.`);
