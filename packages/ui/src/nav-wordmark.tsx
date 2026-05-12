"use client";

import { cn } from "@dub/utils";
import * as Popover from "@radix-ui/react-popover";
import { BoxSelect, Home, LayoutGrid, Type } from "lucide-react";
import { useParams } from "next/navigation";
import { MouseEvent, useCallback, useContext, useState } from "react";
import { toast } from "sonner";
import { Button, ButtonProps } from "./button";
import { useCopyToClipboard } from "./hooks";
import { Logo } from "./logo";
import { NavContext } from "./nav";
import { Wordmark } from "./wordmark";

const logoSvg = `<svg width="228" height="316" viewBox="0 0 228 316" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="inspiria-gradient" x1="67.5" y1="265" x2="67.5" y2="9" gradientUnits="userSpaceOnUse"><stop stop-color="#00FF99"/><stop offset="1" stop-color="#0a192f"/></linearGradient></defs><path d="M2.5,61l130,129v120L2.5,180V61Z" fill="url(#inspiria-gradient)" fill-opacity="0.9"/><path d="M132.5,190l83,82.5c-26.6-26.28-39.9-39.42-51.4-39.96-8.94-.42-17.6,3.18-23.62,9.81-7.73,8.52-7.81,27.22-7.97,64.61v3.03s-.01-120-.01-120Z" fill="url(#inspiria-gradient)"/><path d="M95.5,6l130,129v130L95.5,135V6Z" fill="url(#inspiria-gradient)" fill-opacity="0.9"/><path d="M95.5,135L12.5,52.5c26.6,26.28,39.9,39.42,51.4,39.96,8.94.42,17.61-3.18,23.62-9.81,7.73-8.52,7.81-27.22,7.97-64.61v-3.03s.01,120,.01,120Z" fill="url(#inspiria-gradient)"/></svg>`;

const wordmarkSvg = `<svg width="110" height="24" viewBox="0 0 110 24" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="18" font-family="'Geist Sans', 'Helvetica Neue', sans-serif" font-size="18" font-weight="600" letter-spacing="-0.5" fill="currentColor">Video</text><text x="62" y="18" font-family="'Geist Sans', 'Helvetica Neue', sans-serif" font-size="18" font-weight="300" letter-spacing="-0.5" fill="currentColor" opacity="0.5">Track</text></svg>`;

export function NavWordmark({
  variant = "full",
  isInApp,
  className,
}: {
  variant?: "full" | "symbol";
  isInApp?: boolean;
  className?: string;
}) {
  const { slug } = useParams() as { slug?: string };

  const { theme } = useContext(NavContext);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleContextMenu = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsPopoverOpen(true);
  }, []);

  const [, copyToClipboard] = useCopyToClipboard();

  function copy(text: string) {
    toast.promise(copyToClipboard(text), {
      success: "Copied to clipboard",
      error: "Failed to copy",
    });
  }

  return (
    <Popover.Root open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <Popover.Anchor asChild>
        <div onContextMenu={handleContextMenu} className="max-w-fit">
          {variant === "full" ? (
            <div className="flex items-center gap-2">
              <Logo className="h-7 w-7" />
              <Wordmark className={className} />
            </div>
          ) : (
            <Logo
              className={cn(
                "h-8 w-8 transition-all duration-75 active:scale-95",
                className,
              )}
            />
          )}
        </div>
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content
          sideOffset={14}
          align="start"
          className={cn(
            "z-50 -mt-1.5",
            !isInApp && "-translate-x-8",
            theme === "dark" && "dark",
          )}
          onClick={(e) => {
            e.stopPropagation();
            setIsPopoverOpen(false);
          }}
        >
          <div className="grid gap-1 rounded-lg border border-white/10 bg-black/95 p-2 backdrop-blur-sm sm:min-w-[240px]">
            <ContextMenuButton
              text="Copy Logo as SVG"
              variant="outline"
              onClick={() => copy(logoSvg)}
              icon={<Logo className="h-4 w-4" />}
            />
            <ContextMenuButton
              text="Copy Wordmark as SVG"
              variant="outline"
              onClick={() => copy(wordmarkSvg)}
              icon={<Type strokeWidth={2} className="h-4 w-4" />}
            />
            <ContextMenuButton
              text="Brand Guidelines"
              variant="outline"
              onClick={() =>
                window.open("https://inspiria-studios.com", "_blank")
              }
              icon={<BoxSelect strokeWidth={2} className="h-4 w-4" />}
            />
            {isInApp || slug ? (
              <ContextMenuButton
                text="Home Page"
                variant="outline"
                onClick={() =>
                  window.open(
                    `${window.location.origin}`,
                    "_blank",
                  )
                }
                icon={<Home strokeWidth={2} className="h-4 w-4" />}
              />
            ) : (
              <ContextMenuButton
                text="Dashboard"
                variant="outline"
                onClick={() =>
                  window.open(`${window.location.origin}/${slug || ""}`, "_blank")
                }
                icon={<LayoutGrid strokeWidth={2} className="h-4 w-4" />}
              />
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function ContextMenuButton({ className, ...rest }: ButtonProps) {
  return (
    <Button
      className={cn(
        "h-9 justify-start px-3 font-medium text-white/70 hover:bg-white/10 hover:text-white",
        className,
      )}
      {...rest}
    />
  );
}
