export function logAPICall(data: {
  conversationId: string;
  duration: number;
  error?: string;
}) {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      service: "tax-free-api",
      ...data,
    })
  );
}
