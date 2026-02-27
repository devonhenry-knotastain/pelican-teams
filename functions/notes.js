let sessions = {}; // in-memory store

export async function handler(event) {
  if (event.httpMethod === "POST") {
    const body = JSON.parse(event.body);
    const { session, original, text } = body;
    if (!session || !original || !text) return { statusCode: 400, body: "Missing fields" };

    sessions[session] = sessions[session] || [];
    sessions[session].unshift({ original, text, updated: new Date().toISOString() });

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  }

  if (event.httpMethod === "GET") {
    const session = event.queryStringParameters?.session;
    if (!session) return { statusCode: 400, body: "Missing session" };
    return { statusCode: 200, body: JSON.stringify(sessions[session] || []) };
  }

  return { statusCode: 405, body: "Method not allowed" };
}
