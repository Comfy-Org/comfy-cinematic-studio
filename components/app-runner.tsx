"use client";

import { useEffect, useMemo, useState } from "react";
import { cinematicPrompt, type Direction } from "../lib/prompt";

export function AppRunner() {
  const [scene, setScene] = useState("");
  const [direction, setDirection] = useState<Direction>({
    shot: "Wide establishing shot",
    camera: "35mm lens, shallow depth of field",
    light: "Soft window light",
    look: "Warm cinematic film",
  });
  const [image, setImage] = useState<string>();
  const [message, setMessage] = useState("Describe a scene to begin.");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const prompt = useMemo(() => cinematicPrompt(scene, direction), [scene, direction]);

  useEffect(() => () => { if (image) URL.revokeObjectURL(image); }, [image]);

  async function generate() {
    if (scene.trim().length < 3 || busy) return;
    setBusy(true); setError(false); setImage(undefined); setMessage("Sending the prompt to Comfy Router…");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ scene, direction }),
      });
      if (!response.ok) {
        const body = await response.json() as { error?: string };
        throw new Error(body.error || "Image generation failed.");
      }
      setImage(URL.createObjectURL(await response.blob()));
      setMessage("Image ready. Download it or change the direction and run again.");
    } catch (cause) {
      setError(true); setMessage(cause instanceof Error ? cause.message : "Image generation failed.");
    } finally { setBusy(false); }
  }

  return (
    <main className="shell">
      <header>
        <p className="eyebrow">COMFY ROUTER · IMAGE GUIDE</p>
        <h1>Cinematic<br />Studio</h1>
        <p className="lede">Describe the scene, choose a few camera and lighting directions, and send the composed prompt to an image model through Comfy Router.</p>
      </header>
      <section className="workspace">
        <div className="controls">
          <label className="field">Scene<textarea value={scene} maxLength={900} onChange={(event) => setScene(event.target.value)} placeholder="A lone astronaut finds a field of flowers on Mars…" /></label>
          <label className="field">Shot<select value={direction.shot} onChange={(event) => setDirection({ ...direction, shot: event.target.value as Direction["shot"] })}><option>Wide establishing shot</option><option>Medium shot</option><option>Close-up portrait</option><option>Low-angle shot</option><option>Overhead shot</option></select></label>
          <label className="field">Camera<select value={direction.camera} onChange={(event) => setDirection({ ...direction, camera: event.target.value as Direction["camera"] })}><option>35mm lens, shallow depth of field</option><option>Wide-angle lens, deep focus</option><option>85mm portrait lens, soft background</option><option>Handheld documentary camera</option></select></label>
          <label className="field">Light<select value={direction.light} onChange={(event) => setDirection({ ...direction, light: event.target.value as Direction["light"] })}><option>Soft window light</option><option>Golden-hour backlight</option><option>Hard noon sunlight</option><option>Blue-hour practical lights</option></select></label>
          <label className="field">Look<select value={direction.look} onChange={(event) => setDirection({ ...direction, look: event.target.value as Direction["look"] })}><option>Warm cinematic film</option><option>Cool science-fiction film</option><option>Natural documentary color</option><option>High-contrast noir</option></select></label>
          <button type="button" disabled={scene.trim().length < 3 || busy} onClick={() => void generate()}>{busy ? "Generating…" : "Generate image →"}</button>
          <p className={`status${error ? " error" : ""}`} role="status">{message}</p>
        </div>
        <div className="output">
          {image ? <><img src={image} alt="Generated cinematic image" /><a href={image} download="cinematic-studio.png">Download image</a></> : <p>Your image will appear here.</p>}
        </div>
      </section>
      <details className="prompt"><summary>See the prompt sent to the model</summary><p>{prompt || "Your selected directions will be combined with the scene description."}</p></details>
      <p className="small">The camera choices add words to the prompt; the image model does not physically simulate a lens or camera.</p>
    </main>
  );
}
