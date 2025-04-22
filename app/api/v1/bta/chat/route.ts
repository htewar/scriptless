// backend code (route.ts) - Corrected POST function with Zod tools

import { createOllama } from 'ollama-ai-provider'; // Keep if you might use it
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { streamText, tool } from 'ai';
import { z } from 'zod'; // Import Zod

// --- SYSTEM_PROMPT remains the same ---
const SYSTEM_PROMPT = `
  **IMPORTANT: You are an API Integration Test Suite Creation Assistant.** Your goal is to help users create end-to-end integration tests for their APIs.

  **CRITICAL INSTRUCTIONS - READ CAREFULLY:**

  1. **Phased Workflow:** You MUST follow a strict phase-based workflow. The phases are: Greeting -> Requirements Gathering -> Confirmation -> JSON Output. Do not deviate from this order.

  2. **Greeting Phase:**
     - **Objective:** Greet the user and introduce your purpose.
     - Start with a friendly greeting (e.g., "Hello!").
     - Briefly explain that you help create API end-to-end integration test suites.
     - Maintain a polite and helpful tone.
     - Be concise in your greeting.
     - **DO NOT ask for any API details in this phase.**

  3. **Requirements Gathering Phase:**
     - **Objective:** Collect ALL necessary details to create the API test suite. This is your PRIMARY TASK after greeting.
     - **Actively ASK questions** to gather information. Be proactive in your questioning.
     - Inquire about:
        - API Base URL(s)
        - Specific API Endpoints to test
        - HTTP Methods for each endpoint (GET, POST, PUT, DELETE, etc.)
        - Request Headers (if required) for each endpoint
        - Request Payloads/Bodies (if required, especially for POST/PUT) - Ask for examples or schema.
        - Expected Response Status Codes for each endpoint
        - Response Assertions - What specific data should be present in the response? Ask for examples or keywords to validate.
        - Dependencies between API calls (if any sequence is needed).
     - **Iterate and Clarify:** Keep asking questions and clarifying user responses until you are absolutely confident you have ALL the information needed to generate the JSON.
     - **File Attachments:** If the user provides file attachments (it can be .txt with API details, .pdf with scraped data from API documentation, or postman collection in .json format), prioritize using them to extract information. Analyze the attachments for API details.
     - **DO NOT assume you have enough information.** Keep asking until you feel confident. **Confirm with the user if you think you have everything before proceeding.**

  4. **Confirmation Phase:**
     - **Objective:** Confirm with the user before generating the final JSON.
     - **AFTER** you believe you have completed the Requirements Gathering Phase, state that you think you have all the necessary details.
     - **DO NOT generate the JSON yet.**
     - **Invoke the 'request_json_generation_confirmation' tool.** Use a message like "I believe I have all the details needed. Shall I generate the JSON configuration now?".
     - Wait for the user's confirmation via the tool result.

  5. **JSON Output Phase:**
     - **Objective:** Generate and present the JSON configuration *after user confirmation*.
     - **ONLY AFTER** receiving a positive confirmation result for the 'request_json_generation_confirmation' tool, proceed to this phase.
     - If the user denies confirmation, ask what information is missing or needs correction, returning to the Requirements Gathering phase.
     - Generate the structured JSON object representing the API test suite according to the format below.
     - **Invoke the 'display_json_output' tool** with the generated JSON object as the argument. The argument name should be 'testSuite'.
     - After invoking the 'display_json_output' tool, provide a polite closing message (e.g., "Here is the generated JSON configuration. Let me know if you have any questions.") as a normal text message in the stream.

  **Important Reminders:**

  - Be POLITE and HELPFUL throughout the conversation.
  - Stay focused on API integration testing. If the user asks about unrelated topics, politely redirect them back to API testing.
  - Be concise and to the point, especially in greetings and closing messages.

  **You MUST use the provided tools for confirmation and JSON display. Direct text responses for these actions are not allowed.**
`;

// --- Define Zod Schemas for Tools ---
const apiNodeSchema = z.object({
  type: z.literal("Action").describe("The type of the node, always 'Action' for API calls"),
  name: z.string().describe("A descriptive name for this API call"),
  url: z.string().describe("The complete URL for the API endpoint"),
  method: z.string().describe("The HTTP method (e.g., GET, POST, PUT, DELETE)"),
  headers: z.record(z.string(), z.string()).optional().describe("Optional key-value pairs for request headers"),
  queryParams: z.record(z.string(), z.string()).optional().describe("Optional key-value pairs for query parameters"),
  payload: z.union([
    z.string(),
    z.array(z.object({
      name: z.string(),
      value: z.string()
    }))
  ]).describe("The request payload, either as a string or array of name-value pairs"),
  payloadType: z.string().describe("The type of payload (e.g., 'x-www-form-urlencoded', 'None')"),
  metadata: z.object({
    position: z.object({
      x: z.number(),
      y: z.number()
    })
  }).describe("Metadata including position information")
});

// Schema for the entire test suite
const testSuiteSchema = z.object({
  nodes: z.array(apiNodeSchema).min(1).describe("An array of API nodes in the test workflow")
});

// --- LLM Provider Configuration ---
const openai = createOpenAI({
  baseURL: 'http://localhost:5436/v1',
  apiKey: '2ac395c1-4a97-430f-847a-0bee75e522b3',
  headers: {
    "Content-Type": "application/json",
    "openai-organization": "2ac395c1-4a97-430f-847a-0bee75e522b3",
    "rpc-service": "genai-api",
    "rpc-caller": "ctf-code-review-bot",
    "x-vercel-ai-data-stream": "v1"
  },
  compatibility: 'compatible',
});

const openaiprovider = createOpenAICompatible({
  name: 'openaiprovider',
  baseURL: 'http://localhost:5436/v1',
  apiKey: '2ac395c1-4a97-430f-847a-0bee75e522b3',
  headers: {
    "Content-Type": "application/json",
    "openai-organization": "2ac395c1-4a97-430f-847a-0bee75e522b3",
    "rpc-service": "genai-api",
    "rpc-caller": "ctf-code-review-bot",
    'X-Vercel-AI-Data-Stream': 'v1',
  },
});

const google = createGoogleGenerativeAI();
const ollama = createOllama();

export async function POST(req: Request) {
  const { messages } = await req.json();
  try {
    const result = await streamText({
      //model: openaiprovider('gpt-4.1-nano'),
      model: openai('gpt-4.1-nano'),
      //model: google('models/gemini-2.0-flash'), // Use a specific, available model name
      system: SYSTEM_PROMPT,
      messages,
      maxSteps: 3,
      tools: {
        request_json_generation_confirmation: tool({
          description: 'Asks the user via the UI to confirm if the AI should proceed with generating the JSON test suite configuration.',
          parameters: z.object({
            message: z.string().describe('The confirmation message to display to the user in the UI (e.g., "Should I generate the JSON now?").')
          }),
        }),
        display_json_output: tool({
          description: 'Signals the client UI to display the generated JSON configuration for the API test suite.',
          parameters: z.object({
            testSuite: testSuiteSchema
          }),
        })
      },
      async onFinish({ response }) {
        console.log("onFinish responseMessages", JSON.stringify(response, null, 2));
      },
      async onError({ error }) {
        console.log("onError error", JSON.stringify(error, null, 2));
      }
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in POST handler:", error);
    // Improved error handling to potentially capture ZodErrors
    let errorMessage = 'Internal Server Error';
    if (error instanceof z.ZodError) {
        errorMessage = `Schema validation error: ${error.errors.map(e => `${e.path.join('.')} - ${e.message}`).join(', ')}`;
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 400, // Bad Request for validation errors
            headers: { 'Content-Type': 'application/json' },
          });
    } else if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    } else {
        errorMessage = JSON.stringify(error); // Fallback
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}