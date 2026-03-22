# Text Summarizer CLI Tool
A command-line tool that accepts unstructured text input and produces a structured summary using the Google Gemini API.

## Features

- Accepts text input from a file or stdin
- Generates a structured output including a one-sentence summary, three key points, and sentiment
- Clean, readable terminal output
- Error handling for API failures and invalid input

## How It Works

1. The tool accepts input from either a file or standard input (stdin)
2. The input text is validated (e.g., non-empty, sufficient length)
3. A structured prompt is generated and sent to the Gemini API
4. The API returns a response in JSON format
5. The response is safely parsed and formatted for terminal display

## Setup

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Get a Google Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)
4. Create a `.env` file in the project root and add your API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

## Usage

### From a file:
```bash
node index.js path/to/your/textfile.txt
```

### From stdin (piped input):
```bash
echo "Your text here" | node index.js
```

Or paste text interactively:
```bash
node index.js
# Then paste your text and press Ctrl+D
```

## API Choice

I used the Google Gemini API (specifically `gemini-2.5-flash`) because:
- It offers a generous free tier suitable for development and small-scale use
- Provides reliable structured output capabilities
- Has good documentation and community support
- Integrates well with Node.js via simple HTTP requests

## Prompt Design

The prompt is carefully structured to enforce consistent and parseable output:

```
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
```

**Why this design:**

- Enforces strict JSON output → ensures reliable parsing
- Controls output structure → avoids inconsistent responses
- Standardizes sentiment labels → improves readability
- Minimizes hallucinated or extra text from the model

## Design Decisions

- **CLI-first approach:** Chosen for simplicity and fast implementation within time constraints
- **Strict JSON prompting:** Ensures predictable and machine-readable output
- **Safe JSON extraction:** Handles cases where the model includes extra text
- **Minimal dependencies:** Keeps the project lightweight and easy to run
- **Readable terminal output:** Improves user experience without adding UI complexity

## Example Output

```
 --- Result ---

 Summary:
Artificial Intelligence is helping industries improve efficiency and decision-making.

 Key Points:
1. AI automates repetitive tasks
2. It enhances decision-making
3. Companies are investing in AI for competitiveness

 Sentiment:
Positive
```

## Error Handling

- Validates presence of API key before execution
- Handles empty or very short input gracefully
- Detects and displays API-level errors clearly
- Safely extracts JSON from model responses
- Falls back to raw output if parsing fails

## What I Would Do Differently With More Time

- Add retry logic for transient API failures
- Implement more robust JSON validation and sanitization
- Add support for batch processing multiple files
- Include confidence scores or uncertainty flags in the output
- Add unit tests for the core functions
- Create a simple web UI for easier interaction
- Add configuration options for different output formats or model parameters

## Trade-offs and Shortcuts

- **JSON Parsing:** Assumes the LLM will always return valid JSON, which is generally reliable but could fail. In a production system, I'd add more sophisticated parsing with fallbacks.
- **Single Model:** Hardcoded to use gemini-2.5-flash. With more time, I'd make the model configurable.
- **No Caching:** Doesn't cache results, so repeated runs on the same text will call the API again.
- **Simple Error Messages:** Error handling is basic but functional. More detailed error categorization could be added.
- **No Rate Limiting:** Doesn't implement client-side rate limiting, relying on the API's limits.

## Notes

This project focuses on clean prompt design, reliable LLM integration, and clear communication of trade-offs rather than building a full production system.

## Dependencies

- `dotenv`: For environment variable management
- Google Gemini API: For text analysis (requires API key)

## License

This project is for demonstration purposes.