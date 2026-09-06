import Link from "next/link";

type BrandLogoProps = {
  /** Cap + wordmark, or cap only. */
  variant?: "full" | "mark";
  /** Compact for nav/sidebar, large for hero. */
  size?: "sm" | "md" | "lg";
  className?: string;
  priority?: boolean;
  /** Set to null to render without a link. Defaults to homepage. */
  href?: string | null;
};

const sizeStyles = {
  sm: {
    wrap: "gap-2",
    mark: "h-11 w-auto",
    text: "text-[1.3rem] leading-none",
  },
  md: {
    wrap: "gap-2.5",
    mark: "h-12 w-auto",
    text: "text-[1.5rem] leading-none",
  },
  lg: {
    wrap: "gap-3.5",
    mark: "h-[5.5rem] w-auto sm:h-[6.75rem]",
    text: "text-[2.35rem] leading-none sm:text-[2.75rem]",
  },
} as const;

export function BrandLogo({
  variant = "full",
  size = "sm",
  className = "",
  priority = false,
  href = "/",
}: BrandLogoProps) {
  const s = sizeStyles[size];

  // SVG stays sharp at every size (screenshot PNG softens when scaled).
  const mark = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/uniassist-mark.svg"
      alt=""
      width={200}
      height={150}
      className={`${s.mark} shrink-0 object-contain`}
      aria-hidden={variant === "full"}
      decoding="async"
      {...(priority ? { fetchPriority: "high" as const } : {})}
    />
  );

  const content =
    variant === "mark" ? (
      <span className={`inline-flex shrink-0 items-center ${className}`}>{mark}</span>
    ) : (
      <span className={`inline-flex shrink-0 items-center ${s.wrap} ${className}`}>
        {mark}
        <span
          className={`font-serif font-semibold tracking-tight text-[#0a1c3e] antialiased ${s.text}`}
        >
          UniAssist
        </span>
      </span>
    );

  if (href == null) {
    return (
      <span className="inline-flex items-center" aria-label="UniAssist">
        {content}
      </span>
    );
  }

  return (
    <Link href={href} className="inline-flex shrink-0 items-center" aria-label="UniAssist home">
      {content}
    </Link>
  );
}
