import client from "../../../lib/edgedb";

export async function GET() {
  const result = await client.query(`
    SELECT User {
      username,
      email,
      address,
      city
    };
  `);

  return Response.json({ users: result });
}
