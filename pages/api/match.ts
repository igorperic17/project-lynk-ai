import { createClient } from "@supabase/supabase-js";
import { codeBlock } from "common-tags";
import GPT3Tokenizer from "gpt3-tokenizer";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import OllamaService from '../../src/app/OllamaService'
import { NextApiRequest, NextApiResponse } from "next";

const openAiKey = process.env.OPENAI_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

const config = new Configuration({
  apiKey: openAiKey,
});
const openai = new OpenAIApi(config);

export const runtime = "edge";

type ResponseData = {
  error: string
  data: string
}

type RequestBody = {
  prompt: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  // Read from the ReadableStream
  const chunks = [];
  const reader = req.body.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  // Convert the chunks to a string and then parse it as JSON
  const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));

  // Log the parsed body
  // console.log('Parsed Request Body:', body);

  // Destructure and use the body content
  const { prompt: query } = body;
  // Log the parsed body
  // console.log('Prompt:', query);

  // const { prompt: query } = await req.body;
  try {
    if (!openAiKey) {
      throw new Error("Missing environment variable OPENAI_KEY");
    }
    if (!supabaseUrl) {
      throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_URL");
    }
    
    if (!supabaseKey) {
      throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_KEY");
    }

    if (!query) {
      throw new Error("Missing query in request data");
    }


    const sanitizedQuery = query.trim();
    
    const embeddingService = new OllamaService();
    const embedding = await embeddingService.generateEmbeddings({
      model: 'llama2',
      prompt: sanitizedQuery,
      // prompt: "test",
    });

    // console.log(`Embedding generated: ${embedding}`)

    const supabaseClient = createClient(supabaseUrl, supabaseKey);
    const { error: matchError, data: pageSections } = await supabaseClient.rpc(
      "match_page_sections",
      {
        embedding,
        match_threshold: 0.78,
        match_count: 10,
        min_content_length: 50,
      },
    );

    if (matchError) {
      console.log(matchError);
      throw new Error("Failed to match page sections ${matchError}");
    }


    return new Response(JSON.stringify(
      { status: 200, error: null, data: pageSections }
    ));

    // const tokenizer = new GPT3Tokenizer({ type: "gpt3" });
    // let tokenCount = 0;
    // let contextText = "";

    // for (let i = 0; i < pageSections.length; i++) {
    //   const pageSection = pageSections[i];
    //   const content = pageSection.content;
    //   const encoded = tokenizer.encode(content);
    //   tokenCount += encoded.text.length;

    //   if (tokenCount >= 1500) {
    //     break;
    //   }

    //   contextText += `${content.trim()}\n---\n`;
    // }

    // const prompt = codeBlock`
    //   ${`You know all the scientists in the world and help them find each other. Please use context information to answer. If you are unsure - answer with "I don't know".\n\n`}

    //   Context sections:
    //   ${contextText}

    //   Question: """
    //   ${sanitizedQuery}
    //   """

    //   Answer as markdown:
    // `;

    // const chatMessage: ChatCompletionRequestMessage = {
    //   role: "user",
    //   content: prompt,
    // };

    // const response = await openai.createChatCompletion({
    //   model: "gpt-3.5-turbo",
    //   messages: [chatMessage],
    //   max_tokens: 512,
    //   temperature: 0,
    //   stream: true,
    // });

    // console.log(res);
    // console.log(response);

    // if (!response.ok) {
    //   const err = await response.json();
    //   return new Response(JSON.stringify(
    //     { error: err.message, data: err.data }
    //   ));
    // }

    // const stream = OpenAIStream(response);
    // return new StreamingTextResponse(stream);

    // let { data: projects, error } = await supabaseClient
    //   .from('projects')
    //   .select('name')
    
    // console.log(projects);
    
    // return new Response(JSON.stringify(
    //   { status: 400, error: null, data: projects }
    // )).json();

  } catch (err: any) {
    console.log(err);

    return new Response(JSON.stringify(
      { status: 400, error: err.message, data: err.data }
    ));
  }
}
