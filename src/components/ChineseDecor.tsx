import mountainPavilion from "@/assets/decor-mountain-pavilion.png";
import clouds from "@/assets/decor-clouds.png";
import bamboo from "@/assets/decor-bamboo.png";
import mountains from "@/assets/decor-mountains.png";
import house from "@/assets/decor-house.png";
import { cn } from "@/lib/utils";

/**
 * Fixed, page-wide subtle illustration backdrop.
 * Inspired by the Chinese Color Atlas sample: airy cream canvas with
 * auspicious cloud swirls (祥云) framing the top corners and a delicate
 * ink-wash mountain + pavilion nestled in the bottom-left.
 */
export const ChineseDecorBackdrop = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Top-left auspicious clouds */}
      <img
        src={clouds}
        alt=""
        loading="lazy"
        width={1024}
        height={512}
        className="absolute -left-24 -top-16 w-[60vw] max-w-[720px] opacity-[0.35] dark:opacity-[0.18] select-none"
      />
      {/* Top-right mirrored clouds, smaller and fainter */}
      <img
        src={clouds}
        alt=""
        loading="lazy"
        width={1024}
        height={512}
        className="absolute -right-32 -top-24 w-[45vw] max-w-[560px] -scale-x-100 opacity-[0.22] dark:opacity-[0.12] select-none"
      />

      {/* Bottom-left ink-wash mountain with pavilion */}
      <img
        src={mountainPavilion}
        alt=""
        loading="lazy"
        width={1280}
        height={1024}
        className="absolute -bottom-8 -left-8 w-[55vw] max-w-[820px] opacity-[0.38] dark:opacity-[0.22] select-none"
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
  variant: "bamboo" | "mountains" | "house" | "clouds" | "pavilion";
  className?: string;
}) => {
  const map = {
    bamboo: { src: bamboo, w: 512, h: 1024 },
    mountains: { src: mountains, w: 1024, h: 512 },
    house: { src: house, w: 768, h: 512 },
    clouds: { src: clouds, w: 1024, h: 512 },
    pavilion: { src: mountainPavilion, w: 1280, h: 1024 },
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
