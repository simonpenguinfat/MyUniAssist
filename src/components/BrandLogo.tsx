import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  /** Horizontal lockup (cap left + wordmark right) or cap mark only. */
  variant?: "full" | "mark";
  className?: string;
  priority?: boolean;
  /** Set to null to render without a link. Defaults to homepage. */
  href?: string | null;
};

const sizes = {
  full: { width: 1198, height: 176, src: "/uniassist-logo.png" },
  mark: { width: 362, height: 244, src: "/uniassist-mark.png" },
} as const;

export function BrandLogo({
  variant = "full",
  className,
  priority = false,
  href = "/",
}: BrandLogoProps) {
  const asset = sizes[variant];
  const image = (
    <Image
      src={asset.src}
      alt="UniAssist"
      width={asset.width}
      height={asset.height}
      priority={priority}
      sizes="(max-width: 640px) 240px, 320px"
      className={
        className ??
        (variant === "mark" ? "h-9 w-auto!" : "h-9 w-auto!")
      }
      style={{ width: "auto" }}
    />
  );

  if (href == null) {
    return <span className="inline-flex shrink-0 items-center">{image}</span>;
  }

  return (
    <Link href={href} className="inline-flex shrink-0 items-center" aria-label="UniAssist home">
      {image}
    </Link>
  );
}
