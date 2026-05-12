import { cn } from "@dub/utils";

export function Logo({
  className,
  variant = "color",
}: {
  className?: string;
  variant?: "color" | "white";
}) {
  const color = variant === "white" ? "#ffffff" : "url(#inspiria-gradient)";
  const fill = variant === "white" ? "#ffffff" : "url(#inspiria-gradient)";
  const fillOpacity = "0.9";

  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 228 316"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-9 w-9", className)}
    >
      <defs>
        <linearGradient
          id="inspiria-gradient"
          x1="67.5"
          y1="265"
          x2="67.5"
          y2="9"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00FF99" />
          <stop offset="1" stopColor="#0a192f" />
        </linearGradient>
      </defs>
      <path
        d="M2.5,61l130,129v120L2.5,180V61Z"
        fill={fill}
        fillOpacity={fillOpacity}
      />
      <path
        d="M132.5,190l83,82.5c-26.6-26.28-39.9-39.42-51.4-39.96-8.94-.42-17.6,3.18-23.62,9.81-7.73,8.52-7.81,27.22-7.97,64.61v3.03s-.01-120-.01-120Z"
        fill={color}
        fillOpacity="1"
      />
      <path
        d="M95.5,6l130,129v130L95.5,135V6Z"
        fill={fill}
        fillOpacity={fillOpacity}
      />
      <path
        d="M95.5,135L12.5,52.5c26.6,26.28,39.9,39.42,51.4,39.96,8.94.42,17.61-3.18,23.62-9.81,7.73-8.52,7.81-27.22,7.97-64.61v-3.03s.01,120,.01,120Z"
        fill={color}
        fillOpacity="1"
      />
    </svg>
  );
}
