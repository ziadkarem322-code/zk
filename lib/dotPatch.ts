const FORBIDDEN = new Set(["__proto__", "prototype", "constructor"]);

/**
 * Validates a flat {"dot.path": value, ...} PATCH body before it's handed to
 * Mongoose's $set. Mongoose's own strict-mode schema already rejects fields
 * that don't exist on the schema; this only guards against prototype-pollution
 * style keys reaching the driver at all.
 */
export function sanitizeSetPayload(body: unknown): Record<string, unknown> {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new Error("Body must be a flat object of dot-path -> value pairs");
  }
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
    const segments = key.split(".");
    if (segments.length === 0 || segments.some((s) => FORBIDDEN.has(s) || s.length === 0)) {
      throw new Error(`Disallowed path "${key}"`);
    }
    out[key] = value;
  }
  if (Object.keys(out).length === 0) {
    throw new Error("Empty update payload");
  }
  return out;
}
