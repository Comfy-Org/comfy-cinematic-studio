import { comfy } from "@comfyorg/sdk";
import { NextResponse } from "next/server";
import { cinematicPrompt, isDirection } from "../../../lib/prompt";
import { fluxImageUrl } from "../../../lib/flux-output";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { scene?: unknown; direction?: unknown };
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Send a JSON request." }, { status: 400 }); }

  if (typeof body.scene !== "string" || body.scene.trim().length < 3 || body.scene.length > 900) {
    return NextResponse.json({ error: "Describe the scene in 3–900 characters." }, { status: 400 });
  }
  if (!isDirection(body.direction)) {
    return NextResponse.json({ error: "Choose a supported shot, camera, light and look." }, { status: 400 });
  }

  const apiKey = process.env.COMFY_API_KEY?.trim();
  if (!apiKey) return NextResponse.json({ error: "Add COMFY_API_KEY to .env.local and restart the app." }, { status: 503 });

  try {
    comfy.config({ credentials: apiKey });
    const prompt = cinematicPrompt(body.scene, body.direction);
    const result = await comfy.models.run("bfl/flux-2-pro", { prompt });
    if (result.kind !== "json") throw new Error("The model returned an unexpected binary response.");
    const url = fluxImageUrl(result.data);
    if (!url) throw new Error(`The model returned no image. Request ID: ${result.requestId}`);

    const image = await fetch(url);
    if (!image.ok || !image.body) throw new Error(`Could not download the generated image (${image.status}). Request ID: ${result.requestId}`);
    return new Response(image.body, {
      headers: {
        "Content-Type": image.headers.get("content-type") ?? "image/png",
        "X-Comfy-Request-Id": result.requestId ?? "unknown",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Comfy Router request failed.",
    }, { status: 502 });
  }
}
