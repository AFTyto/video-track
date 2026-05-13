// Upstash Vector disabled for VideoTrack - using local database instead
export const vectorIndex = {
  upsert: async () => {},
  query: async () => ({ vectors: [] }),
};
