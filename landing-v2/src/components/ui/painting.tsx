import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Public domain landscape paintings used as backdrops (sourced from Wikimedia Commons).
 * Credits are listed in public/images/paintings/CREDITS.md.
 */
export const paintings = {
  lucerne: {
    src: "/images/paintings/lucerne.jpg",
    credit: "Albert Bierstadt, Lake Lucerne (1858)",
  },
  aurora: {
    src: "/images/paintings/aurora.jpg",
    credit: "Frederic Edwin Church, Aurora Borealis (1865)",
  },
  wilderness: {
    src: "/images/paintings/wilderness.jpg",
    credit: "Sanford Robinson Gifford, Wilderness (1860)",
  },
  sunrise: {
    src: "/images/paintings/sunrise-yosemite.jpg",
    credit: "Albert Bierstadt, Sunrise, Yosemite Valley (c. 1870)",
  },
  golden: {
    src: "/images/paintings/golden-hour.jpg",
    credit: "Thomas Moran, The Golden Hour (1875)",
  },
  whiteface: {
    src: "/images/paintings/whiteface.jpg",
    credit: "Sanford Robinson Gifford, Whiteface Mountain from Lake Placid (1866)",
  },
  cotopaxi: {
    src: "/images/paintings/cotopaxi.jpg",
    credit: "Frederic Edwin Church, Cotopaxi (1855)",
  },
} as const;

export type PaintingName = keyof typeof paintings;

/** A painting that fills its positioned parent. Decorative, so the alt text is empty. */
export function Painting({
  name,
  position = "center",
  priority,
  className,
}: {
  name: PaintingName;
  position?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={paintings[name].src}
      alt=""
      fill
      priority={priority}
      sizes="100vw"
      quality={80}
      className={cn("-z-10 object-cover select-none", className)}
      style={{ objectPosition: position }}
    />
  );
}
