import assert from "node:assert/strict";
import test from "node:test";
import { cinematicPrompt } from "../lib/prompt.ts";
import { fluxImageUrl } from "../lib/flux-output.ts";

test("camera and lighting controls become visible prompt text", () => {
  assert.equal(
    cinematicPrompt("A red fox in snow", {
      shot: "Wide establishing shot",
      camera: "35mm lens, shallow depth of field",
      light: "Golden-hour backlight",
      look: "Warm cinematic film",
    }),
    "Wide establishing shot. A red fox in snow. 35mm lens, shallow depth of field. Golden-hour backlight. Warm cinematic film",
  );
});

test("reads the image URL from the documented FLUX result envelope", () => {
  assert.equal(fluxImageUrl({ result: { sample: "https://example.com/image.png" } }), "https://example.com/image.png");
  assert.equal(fluxImageUrl({ result: { sample: "http://localhost/image.png" } }), undefined);
  assert.equal(fluxImageUrl({ images: [{ url: "https://example.com/image.png" }] }), undefined);
});
