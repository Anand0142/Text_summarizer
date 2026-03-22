import fs from "fs";
import readline from "readline";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("GEMINI_API_KEY not found. Check your .env file.");
  process.exit(1);
}

async function getInput() {
  const filePath = process.argv[2];

  if (filePath) {
    try {
      return fs.readFileSync(filePath, "utf-8");
    } catch (err) {
      console.error("Error reading file:", err.message);
      process.exit(1);
    }
  }

  console.log("Paste your text (Press Ctrl+D when done):");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let input = "";

  for await (const line of rl) {
    input += line + "\n";
  }

  return input.trim();
}

async function analyzeText(text) {
  if (!text) {
    console.error("No input provided.");
    process.exit(1);
  }

  if (text.length < 20) {
    console.error("Input too short to analyze.");
    process.exit(1);
  }

  const prompt = `
You are an AI that extracts structured insights.

Analyze the text and return ONLY valid JSON.

Requirements:
- summary: exactly ONE sentence
- key_points: exactly THREE short bullet points
- sentiment: one of ["Positive", "Neutral", "Negative"]

Return strictly in this format:
{
  "summary": "...",
  "key_points": ["...", "...", "..."],
  "sentiment": "Positive/Neutral/Negative"
}

Text:
${text}
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );
    const data = await response.json();
    if (!response.ok || !data.candidates) {
      console.error("API Error:");
      console.log(JSON.stringify(data, null, 2));
      process.exit(1);
    }

    return data.candidates[0].content.parts[0].text;

  } catch (err) {
    console.error(" Network/API Error:", err.message);
    process.exit(1);
  }
}
function extractJSON(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}") + 1;

  if (start === -1 || end === -1) {
    throw new Error("No valid JSON found in response");
  }

  return JSON.parse(text.slice(start, end));
}

function printResult(result) {
  try {
    const data = extractJSON(result);

    const sentiment =
      data.sentiment.charAt(0).toUpperCase() +
      data.sentiment.slice(1).toLowerCase();

    console.log("\n --- Result ---\n");

    console.log(" Summary:");
    console.log(data.summary);

    console.log("\n Key Points:");
    data.key_points.forEach((point, i) => {
      console.log(`${i + 1}. ${point}`);
    });

    console.log("\n Sentiment:");
    console.log(sentiment);

  } catch (err) {
    console.error("Parsing Error:");
    console.log(result);
  }
}
(async () => {
  const input = await getInput();
  const result = await analyzeText(input);
  printResult(result);
})();