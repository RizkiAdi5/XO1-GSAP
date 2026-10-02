/**
 * Looping 3D motion shown beside a page title (Work / About / Contact).
 * The assets are animated WebP with a plain background meant to equal --bg,
 * but the AI generator drifts a few shades darker. Two fixes, both per image:
 * - `brightness` lifts the whole frame so its background lands on #F4F3EF
 *   (calibration knob: re-tune if the asset is regenerated);
 * - a radial mask fades the frame edges out, so no rectangle shows.
 * Reduced motion gets the static first frame (`<name>-poster.webp`).
 */
export default function HeaderMotion({
  name,
  brightness = 1,
  className = "",
}: {
  name: string;
  brightness?: number;
  className?: string;
}) {
  return (
    <picture className={`pointer-events-none block ${className}`}>
      <source srcSet={`/images/${name}-poster.webp`} media="(prefers-reduced-motion: reduce)" />
      <img
        src={`/images/${name}.webp`}
        alt=""
        width={1280}
        height={720}
        fetchPriority="low"
        style={{
          filter: brightness === 1 ? undefined : `brightness(${brightness})`,
          // The ~10KB poster paints instantly behind the img while the animated.
          // file (1–2MB) downloads, so the slot is never empty on page change.
          background: `url(/images/${name}-poster.webp) center / cover no-repeat`,
        }}
        className="h-auto w-full [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_70%)]"
      />
    </picture>
  );
}
