import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { fetchWithError, buildUrl } from "@/lib/utils/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get("input");

  if (!input) {
    return NextResponse.json({ predictions: [] });
  }

  try {
    const url = buildUrl('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
      input: input,
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      components: 'country:at',
      types: 'establishment|geocode'
    });

    const data = await fetchWithError(url);
    return NextResponse.json({ predictions: data.predictions });
  } catch (error) {
    console.error("Failed to fetch predictions:", error);
    return NextResponse.json({ predictions: [] });
  }
}