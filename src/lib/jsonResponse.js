const jsonResponse = (data, status = 200) =>
  new Response(
    JSON.stringify({
      status,
      ...data,
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );

export default jsonResponse;
