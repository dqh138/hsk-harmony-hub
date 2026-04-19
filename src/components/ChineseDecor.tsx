import bamboo from "@/assets/decor-bamboo.png";
import mountains from "@/assets/decor-mountains.png";
import house from "@/assets/decor-house.png";
import { cn } from "@/lib/utils";

/**
 * Fixed, page-wide subtle illustration backdrop.
 * Mounted once in App so it appears consistently across every route.
 */
export const ChineseDecorBackdrop = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Bamboo - left edge */}
      <img
        src={bamboo}
        alt=""
        loading="lazy"
        width={512}
        height={1024}
        className="absolute -left-10 top-10 h-[70vh] w-auto opacity-[0.06] dark:opacity-[0.08] select-none"
      />
      {/* Bamboo - right edge mirrored */}
      <img
        src={bamboo}
        alt=""
        loading="lazy"
        width={512}
        height={1024}
        className="absolute -right-12 bottom-0 h-[60vh] w-auto -scale-x-100 opacity-[0.05] dark:opacity-[0.07] select-none"
      />
      {/* Mountains - bottom band */}
      <img
        src={mountains}
        alt=""
        loading="lazy"
        width={1024}
        height={512}
        className="absolute bottom-0 left-1/2 w-[120vw] max-w-none -translate-x-1/2 opacity-[0.05] dark:opacity-[0.07] select-none"
      />
    </div>
  );
};

/**
 * Inline decorative illustrations for the landing page sections.
 */
export const ChineseDecorInline = ({
  variant,
  className,
}: {
  variant: "bamboo" | "mountains" | "house";
  className?: string;
}) => {
  const map = {
    bamboo: { src: bamboo, w: 512, h: 1024 },
    mountains: { src: mountains, w: 1024, h: 512 },
    house: { src: house, w: 768, h: 512 },
  } as const;
  const item = map[variant];
  return (
    <img
      src={item.src}
      alt=""
      aria-hidden="true"
      loading="lazy"
      width={item.w}
      height={item.h}
      className={cn("pointer-events-none select-none", className)}
    />
  );
};
