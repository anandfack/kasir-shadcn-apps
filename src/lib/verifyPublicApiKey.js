export function verifyPublicApiKey(req) {
  const apiKey = req.headers.get("x-api-key");

  if (!apiKey || apiKey !== process.env.API_KEY_PUBLIC) {
    throw new Error("Unauthorized");
  }
}
