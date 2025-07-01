const axios = require("axios");
const dotenv = require("dotenv");
const fs = require("fs");
const crypto = require("crypto");
const { stringify } = require("csv-stringify/sync");

dotenv.config();

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;

// ======= CONFIGURATION =======
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE_ID = process.env.AIRTABLE_TABLE_ID;
const VIEW_ID = process.env.AIRTABLE_VIEW_ID;

const OUTPUT_CSV = "./data/latest.csv";
const OUTPUT_JSON = "./data/latest.json";
const README_PATH = "./README.md";

// ======= UTILITY FUNCTIONS =======
function generateSHA256(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash("sha256");
  hashSum.update(fileBuffer);
  return hashSum.digest("hex");
}

function getCurrentUTCTimestamp() {
  return new Date().toISOString();
}

// ======= FETCH FUNCTION =======
async function fetchAirtableRecords() {
  let allRecords = [];
  let offset = undefined;

  do {
    const url =
      `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?view=${VIEW_ID}` +
      (offset ? `&offset=${offset}` : "");
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` },
    });
    const records = response.data.records.map((r) => r.fields);
    allRecords = allRecords.concat(records);
    offset = response.data.offset;
  } while (offset);

  return allRecords;
}

// ======= CLEAN AND FORMAT DATA =======
function cleanRecords(records) {
  const currentTimestamp = getCurrentUTCTimestamp();

  // First filter the records
  const filteredRecords = records.filter((r) => r.procedure && r.city);

  // Group by procedure + city to calculate sample sizes
  const groupedData = {};
  filteredRecords.forEach((r) => {
    const key = `${r.procedure}_${r.city}`;
    if (!groupedData[key]) {
      groupedData[key] = [];
    }
    groupedData[key].push(r);
  });

  // Map records with calculated sample sizes
  return filteredRecords.map((r) => {
    const key = `${r.procedure}_${r.city}`;
    const sampleSize = groupedData[key].length;

    return {
      procedure: r.procedure || "",
      procedure_slug: r.procedure_slug || "",
      city: r.city || "",
      city_slug: r.city_slug || "",
      low: (r.low || "").toString().replace(/,/g, ""),
      mid: (r.mid || "").toString().replace(/,/g, ""),
      high: (r.high || "").toString().replace(/,/g, ""),
      source_url: r.source_url || "",
      sample_size: sampleSize,
      last_updated_UTC: currentTimestamp,
    };
  });
}

// ======= WRITE TO FILES =======
function writeFiles(cleaned) {
  // Write JSON
  fs.writeFileSync(OUTPUT_JSON, JSON.stringify(cleaned, null, 2));

  // Write CSV
  const csv = stringify(cleaned, {
    header: true,
    columns: [
      "procedure",
      "procedure_slug",
      "city",
      "city_slug",
      "low",
      "mid",
      "high",
      "source_url",
      "sample_size",
      "last_updated_UTC",
    ],
  });
  fs.writeFileSync(OUTPUT_CSV, csv);
}

// ======= UPDATE README WITH HASHES =======
function updateReadmeWithHashes(csvHash, jsonHash) {
  try {
    if (!fs.existsSync(README_PATH)) {
      console.log("README.md not found, skipping hash update");
      return;
    }

    let readme = fs.readFileSync(README_PATH, "utf8");

    // Update CSV hash
    readme = readme.replace(
      /- \[latest\.csv\]\(\.\/data\/latest\.csv\) - SHA256: [a-f0-9]{5,8}\.\.\./,
      `- [latest.csv](./data/latest.csv) - SHA256: ${csvHash.substring(
        0,
        8
      )}...`
    );

    // Update JSON hash
    readme = readme.replace(
      /- \[latest\.json\]\(\.\/data\/latest\.json\) - SHA256: [a-f0-9]{5,8}\.\.\./,
      `- [latest.json](./data/latest.json) - SHA256: ${jsonHash.substring(
        0,
        8
      )}...`
    );

    fs.writeFileSync(README_PATH, readme);
    console.log("README.md updated with new hashes");
  } catch (error) {
    console.log("Could not update README with hashes:", error.message);
  }
}

// ======= MAIN =======
(async () => {
  if (!AIRTABLE_API_KEY || !BASE_ID || !TABLE_ID || !VIEW_ID) {
    console.error("Error: Please set all required environment variables:");
    console.error("- AIRTABLE_API_KEY");
    console.error("- AIRTABLE_BASE_ID");
    console.error("- AIRTABLE_TABLE_ID");
    console.error("- AIRTABLE_VIEW_ID");
    process.exit(1);
  }

  try {
    console.log("Fetching Airtable data...");
    const records = await fetchAirtableRecords();

    console.log("Cleaning and formatting data...");
    const cleaned = cleanRecords(records);

    console.log("Writing files...");
    writeFiles(cleaned);

    console.log("Generating SHA-256 hashes...");
    const csvHash = generateSHA256(OUTPUT_CSV);
    const jsonHash = generateSHA256(OUTPUT_JSON);

    console.log(`CSV SHA256: ${csvHash.substring(0, 8)}...`);
    console.log(`JSON SHA256: ${jsonHash.substring(0, 8)}...`);

    // Update README with new hashes
    updateReadmeWithHashes(csvHash, jsonHash);

    console.log(
      `✅ Done! Wrote ${cleaned.length} records to ${OUTPUT_JSON} and ${OUTPUT_CSV}`
    );
    console.log(`📊 Files generated at: ${getCurrentUTCTimestamp()}`);
  } catch (err) {
    console.error("❌ Error fetching or writing data:", err.message);
    process.exit(1);
  }
})();
