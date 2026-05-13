import { Dub } from "dub";

let _dub: Dub | null = null;

function getDub(): Dub {
  if (!_dub) {
    _dub = new Dub();
  }
  return _dub;
}

// Proxy to lazily initialize Dub SDK - all property access delegates to the lazy instance
export const dub = new Proxy({} as Dub, {
  get(_, prop) {
    return Reflect.get(getDub(), prop);
  },
});

// fetch Dub customer using their external ID (ID in our database)
export const getDubCustomer = async (userId: string) => {
  const customer = await dub.customers.list({
    externalId: userId,
    includeExpandedFields: true,
  });

  return customer.length > 0 ? customer[0] : null;
};
