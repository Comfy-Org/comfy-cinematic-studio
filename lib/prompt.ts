export const choices = {
  shot: ["Wide establishing shot", "Medium shot", "Close-up portrait", "Low-angle shot", "Overhead shot"],
  camera: ["35mm lens, shallow depth of field", "Wide-angle lens, deep focus", "85mm portrait lens, soft background", "Handheld documentary camera"],
  light: ["Soft window light", "Golden-hour backlight", "Hard noon sunlight", "Blue-hour practical lights"],
  look: ["Warm cinematic film", "Cool science-fiction film", "Natural documentary color", "High-contrast noir"],
} as const;

export type Direction = { [K in keyof typeof choices]: (typeof choices)[K][number] };

export function cinematicPrompt(scene: string, direction: Direction) {
  return [direction.shot, scene.trim(), direction.camera, direction.light, direction.look]
    .filter(Boolean)
    .join(". ");
}

export function isDirection(value: unknown): value is Direction {
  if (!value || typeof value !== "object") return false;
  const direction = value as Record<string, unknown>;
  return (Object.keys(choices) as (keyof typeof choices)[]).every((key) =>
    choices[key].includes(direction[key] as never),
  );
}
