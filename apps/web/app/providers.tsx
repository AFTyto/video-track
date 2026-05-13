"use client";

import { KeyboardShortcutProvider, TooltipProvider } from "@dub/ui";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export default function RootProviders({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <KeyboardShortcutProvider>
        <Toaster className="pointer-events-auto" closeButton />
        {children}
      </KeyboardShortcutProvider>
    </TooltipProvider>
  );
}
