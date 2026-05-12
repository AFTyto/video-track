import { cn } from "@dub/utils";

export function Wordmark({ className }: { className?: string }) {
  return (
    <svg
      width="110"
      height="24"
      viewBox="0 0 110 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-6 w-auto", className)}
    >
      <text
        x="0"
        y="18"
        fontFamily="'Geist Sans', 'Helvetica Neue', sans-serif"
        fontSize="18"
        fontWeight="600"
        letterSpacing="-0.5"
        fill="currentColor"
      >
        Video
      </text>
      <text
        x="62"
        y="18"
        fontFamily="'Geist Sans', 'Helvetica Neue', sans-serif"
        fontSize="18"
        fontWeight="300"
        letterSpacing="-0.5"
        fill="currentColor"
        opacity="0.5"
      >
        Track
      </text>
    </svg>
  );
}
