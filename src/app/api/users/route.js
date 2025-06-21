import client from "@/lib/edgedb";

export async function GET() {
  const result = await client.query(`SELECT User { username, email, address, city };`);
  return Response.json({ users: result });
}

export async function POST(req) {
  const body = await req.json();

  await client.query(`
    INSERT User {
      username := <str>$username,
      email := <str>$email,
      address := <optional str>$address,
      city := <optional str>$city
    };
  `, body);

  return Response.json({ ok: true });
}
