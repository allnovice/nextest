import { NextResponse } from 'next/server';
import client from "@/lib/edgedb";

export async function GET(req) {
  const region = req.headers.get("x-vercel-ip-country") || "unknown";
  console.log("🌍 Visitor region:", region);

  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("q")?.trim();
  const search = raw === "" ? null : raw;

  const query = search
    ? `
      select Asset {
        name,
        serial_number,
        type,
        location,
        user
      }
      filter
        .name ilike <str>$search or
        .type ilike <str>$search or
        .user ilike <str>$search or
        .serial_number ilike <str>$search or
        .location ilike <str>$search
    `
    : `
      select Asset {
        name,
        serial_number,
        type,
        location,
        user
      }
    `;

  try {
    const results = search
      ? await client.query(query, { search: `%${search}%` })
      : await client.query(query);

    return NextResponse.json({ assets: results });
  } catch (err) {
    console.error("❌ EdgeDB Query Error:", err.message);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}


export async function POST(req) {
  const body = await req.json();

  try {
    await client.query(`
      insert Asset {
        name := <str>$name,
        serial_number := <str>$serial_number,
        type := <str>$type,
        location := <optional str>$location,
        user := <optional str>$user
      }
    `, body);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Insert Error:", err.message);
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }
}
