import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const response = await fetch(
      `https://api.comick.dev/user/${params.userId}/follows`,
      {
        headers: {
          "User-Agent": "ComickRecommendations/1.0",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching user follows:", error);
    return NextResponse.json(
      { error: "Failed to fetch user follows" },
      { status: 500 }
    );
  }
}
