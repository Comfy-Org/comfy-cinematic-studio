import assert from "node:assert/strict";
import test from "node:test";
import { cinematicPrompt } from "../lib/prompt.ts";

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
