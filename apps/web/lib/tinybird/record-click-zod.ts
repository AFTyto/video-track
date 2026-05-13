// Tinybird click recording disabled for VideoTrack
export const recordClickZod = async () => {};

// Placeholder schema for compatibility
export const recordClickZodSchema = {
  parse: (data: unknown) => data as Record<string, unknown>,
  safeParse: (data: unknown) => ({ success: true, data: data as Record<string, unknown> }),
};