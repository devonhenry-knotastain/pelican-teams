let sessions = {}; // In-memory storage, cleared on redeploy

export async function handler(event, context) {
  const { httpMethod } = event;

  if (httpMethod === "POST") {
    // Receive note from phone
    const body = JSON.parse(event.body);
    const { session, original, text } = body;

    if (!session || !original || !text) {
      return { statusCode: 400, body: "Missing session or note fields" };
    }

    const newNote = { original, text, updated: new Date().toISOString() };
    sessions[session] = sessions[session] || [];
    sessions[session].unshift(newNote); // newest first

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  }

  if (httpMethod === "GET") {
    // Return notes for a specific session
    const session = event.queryStringParameters?.session;
    if (!session) return { statusCode: 400, body: "Missing session query" };

    const notes = sessions[session] || [];
    return { statusCode: 200, body: JSON.stringify(notes) };
  }

  return { statusCode: 405, body: "Method not allowed" };
}
