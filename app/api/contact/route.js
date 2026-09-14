export async function POST(request) {
  const contentType = request.headers.get("content-type") || "";
  let data = {};

  if (contentType.includes("application/json")) {
    data = await request.json();
  } else {
    const body = await request.text();
    data = Object.fromEntries(new URLSearchParams(body));
  }

  const fullname = (data.fullname || `${data.fname || ""} ${data.lname || ""}`).trim();
  const email = (data.email || "").trim();
  const subject = (data.subject || "").trim();
  const message = (data.message || "").trim();

  let errorMSG = "";
  if (!fullname) errorMSG += "Full Name is required. ";
  if (!email) errorMSG += "Email is required. ";
  if (!subject) errorMSG += "Subject is required. ";
  if (!message) errorMSG += "Message is required. ";

  if (errorMSG) {
    return new Response(errorMSG, { status: 400 });
  }

  return new Response("success", { status: 200 });
}
