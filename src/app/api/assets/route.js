import { NextResponse } from 'next/server';
import client from "@/lib/edgedb";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("q")?.trim();
  const search = raw === "" ? null : raw;

  try {
    let results;

    if (search?.includes(" ")) {
      const keywords = search.split(/\s+/);
      const query = `
        select Asset {
          name,
          serial_number,
          type,
          location,
          user
        }
        filter any(
          word in array_unpack(<array<str>>$keywords)
        ) (
          .name ilike '%' ++ word ++ '%' or
          .type ilike '%' ++ word ++ '%' or
          .user ilike '%' ++ word ++ '%' or
          .serial_number ilike '%' ++ word ++ '%' or
          .location ilike '%' ++ word ++ '%'
        )
      `;
      results = await client.query(query, { keywords });
    } else if (search) {
      const query = `
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
      `;
      results = await client.query(query, { search: `%${search}%` });
    } else {
      const query = `
        select Asset {
          name,
          serial_number,
          type,
          location,
          user
        }
      `;
      results = await client.query(query);
    }

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
