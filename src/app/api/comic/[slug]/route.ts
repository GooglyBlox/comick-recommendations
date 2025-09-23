import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const response = await fetch(
      `https://api.comick.dev/comic/${params.slug}/?tachiyomi=true`,
      {
        headers: {
          "User-Agent": "ComickRecommendations/1.0",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Comic not found" }, { status: 404 });
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching comic details:", error);
    return NextResponse.json(
      { error: "Failed to fetch comic details" },
      { status: 500 }
    );
  }
}
