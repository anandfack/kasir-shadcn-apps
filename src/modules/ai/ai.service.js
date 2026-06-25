import jsonResponse from "@/lib/jsonResponse";
import { verifyAuth } from "@/lib/verifyAuth";
import { chatCompletion, generateCompletion } from "@/lib/ollama";

export async function chatWithAI(req) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return jsonResponse({ message: auth.error }, 401);

    const { messages, prompt, model } = await req.json();

    if (!messages && !prompt) {
      return jsonResponse({ message: "messages atau prompt wajib diisi" }, 400);
    }

    let result;
    if (messages) {
      result = await chatCompletion(messages, { model });
    } else {
      result = await generateCompletion(prompt, { model });
    }

    return jsonResponse({ data: result }, 200);
  } catch (error) {
    console.error("AI Error:", error);
    return jsonResponse({ message: "Internal Server Error" }, 500);
  }
}
