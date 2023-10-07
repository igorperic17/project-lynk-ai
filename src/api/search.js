import { createClient } from "@supabase/supabase-js";
import { codeBlock } from "common-tags";
import GPT3Tokenizer from "gpt3-tokenizer";
import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { ApplicationError, UserError } from "@/lib/errors";

const openAiKey = process.env.OPENAI_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

const config = new Configuration({
  apiKey: openAiKey,
});
const openai = new OpenAIApi(config);

export const runtime = "edge";

export default async function handler(req) {
  try {
    if (!openAiKey) {
      throw new ApplicationError("Missing environment variable OPENAI_KEY");
    }

    if (!supabaseUrl) {
      throw new ApplicationError("Missing environment variable SUPABASE_URL");
    }

    if (!supabaseKey) {
      throw new ApplicationError(
        "Missing environment variable SUPABASE_SERVICE_KEY",
      );
    }

    const requestData = await req.json();

    if (!requestData) {
      throw new UserError("Missing request data");
    }

    const { prompt: query } = requestData;

    if (!query) {
      throw new UserError("Missing query in request data");
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    const sanitizedQuery = query.trim();
    const moderationResponse = await openai
      .createModeration({ input: sanitizedQuery })
      .then((res) => res.json());

    const [results] = moderationResponse.results;

    if (results.flagged) {
      throw new UserError("Flagged content", {
        flagged: true,
        categories: results.categories,
      });
    }

    const embeddingResponse = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: sanitizedQuery.replaceAll("\n", " "),
    });

    if (embeddingResponse.status !== 200) {
      throw new ApplicationError(
        "Failed to create embedding for question",
        embeddingResponse,
      );
    }

    const {
      data: [{ embedding }],
    } = await embeddingResponse.json();

    const { error: matchError, data: pageSections } = await supabaseClient.rpc(
      "match_page_sections_lynk",
      {
        embedding,
        match_threshold: 0.78,
        match_count: 10,
        min_content_length: 50,
      },
    );

    if (matchError) {
      throw new ApplicationError("Failed to match page sections", matchError);
    }

    const tokenizer = new GPT3Tokenizer({ type: "gpt3" });
    let tokenCount = 0;
    let contextText = "";

    for (let i = 0; i < pageSections.length; i++) {
      const pageSection = pageSections[i];
      const content = pageSection.content;
      const encoded = tokenizer.encode(content);
      tokenCount += encoded.text.length;

      if (tokenCount >= 1500) {
        break;
      }

      contextText += `${content.trim()}\n---\n`;
    }

    const prompt = codeBlock`
      ${`You know all the scientists in the world and help them find each other. Please use context information to answer. If you are unsure - answer with "I don't know".\n\n`}

      Context sections:
      ${contextText}

      Question: """
      ${sanitizedQuery}
      """

      Answer as markdown:
    `;

    const chatMessage = {
      role: "user",
      content: prompt,
    };

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [chatMessage],
      max_tokens: 512,
      temperature: 0,
      stream: true,
    });

    if (!response.ok) {
      const err = await response.json();
      res.status(400).json({ error: err.message, data: err.data });
    }

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (err) {
    res.status(400).json({ error: err.message, data: err.data });
  }
}
