import { NextResponse } from 'next/server';
import client from "@/lib/edgedb"; 

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("q")?.trim();

  let query;
  let vars = {};

  if (search) {
    const keywords = search.split(/\s+/);
    let filters = [];

    keywords.forEach((word, i) => {
      const param = `kw${i}`;
      vars[param] = `%${word}%`;

      filters.push(`
        .name ilike <str>$${param} or
        .type ilike <str>$${param} or
        .user ilike <str>$${param}
      `);
    });

    query = `
      select Asset {
        name,
        serial_number,
        type,
        location,
        user
      }
      filter ${filters.map(f => `(${f})`).join(' and ')}
    `;
  } else {
    query = `
      select Asset {
        name,
        serial_number,
        type,
        location,
        user
      }
    `;
  }

  try {
    const results = await client.query(query, vars);
    return NextResponse.json({ assets: results });
  } catch (err) {
    console.error("❌ EdgeDB Search Error:", err.message);
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
