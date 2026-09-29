export function fluxImageUrl(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return;
  const result = Reflect.get(data, "result");
  const sample = result && typeof result === "object" ? Reflect.get(result, "sample") : undefined;
  if (typeof sample !== "string") return;
  try {
    const url = new URL(sample);
    return url.protocol === "https:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}
