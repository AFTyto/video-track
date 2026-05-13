"use client";

import { useSession } from "next-auth/react";
// Plausible analytics disabled
export const usePlausible = () => {};
import { useEffect } from "react";

export default function TrackSignup() {
  const plausible = usePlausible();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      plausible("Signed Up");
    }
  }, [session?.user]);

  return null;
}
