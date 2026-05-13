// Tinybird analytics disabled for VideoTrack
export const tb = {
  pipe: async () => ({ data: [] }),
  query: async () => ({ data: [] }),
  buildPipe: async () => async () => ({ data: [] }),
  buildIngestEndpoint: async () => async () => ({ success: true }),
};