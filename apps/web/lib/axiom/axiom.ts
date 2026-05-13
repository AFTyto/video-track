// Axiom logging disabled for VideoTrack
export const axiomClient = {
  ingest: async () => {},
  query: async () => ({ status: {} }),
};