// Tinybird analytics disabled for VideoTrack - using local database instead
export const tb = {
  pipe: async () => ({ data: [] }),
  query: async () => ({ data: [] }),
  buildPipe: async () => ({ data: [] }),
  buildIngestEndpoint: async () => async () => ({ success: true }),
};

export const recordClick = async () => {};
export const recordLead = async () => {};
export const recordSale = async () => {};
export const recordLink = async () => {};
export const recordLeadWithTimestamp = async () => {};
export const recordSaleWithTimestamp = async () => {};
export const getClickEvent = async () => ({ data: [] });
export const getLeadEvent = async () => ({ data: [] });