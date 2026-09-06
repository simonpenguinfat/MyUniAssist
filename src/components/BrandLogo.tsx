import Image from "next/image";
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
    mark: "h-9 w-auto",
    text: "text-[1.05rem] leading-none",
  },
  md: {
    wrap: "gap-2.5",
    mark: "h-11 w-auto",
    text: "text-xl leading-none",
  },
  lg: {
    wrap: "gap-3.5",
    mark: "h-[4.25rem] w-auto sm:h-[5rem]",
    text: "text-[1.85rem] leading-none sm:text-[2.15rem]",
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

  const mark = (
    <Image
      src="/uniassist-mark.png"
      alt=""
      width={362}
      height={244}
      priority={priority}
      sizes="80px"
      className={`${s.mark} shrink-0`}
      style={{ width: "auto" }}
      aria-hidden={variant === "full"}
    />
  );

  const content =
    variant === "mark" ? (
      <span className={`inline-flex shrink-0 items-center ${className}`}>{mark}</span>
    ) : (
      <span className={`inline-flex shrink-0 items-center ${s.wrap} ${className}`}>
        {mark}
        <span className={`font-serif font-semibold tracking-tight text-[#0a1c3e] ${s.text}`}>
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
