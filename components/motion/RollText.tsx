type RollTextProps = {
  children: string;
  className?: string;
};

export default function RollText({ children, className = "" }: RollTextProps) {
  return (
    <span
      className={`group relative inline-block overflow-hidden align-top ${className}`}
    >
      <span
        className="block transition-transform motion-safe:duration-[var(--duration-fast)] motion-safe:ease-[var(--ease-in-out)] motion-safe:group-hover:-translate-y-full motion-safe:group-focus-visible:-translate-y-full motion-reduce:transition-colors motion-reduce:duration-[var(--duration-fast)] motion-reduce:group-hover:text-accent motion-reduce:group-focus-visible:text-accent"
      >
        {children}
      </span>
      {/* Duplicate for the roll effect: hidden from screen readers AND from
          selection, or copying the label gives it twice ("Let's talk Let's talk"). */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 block translate-y-full select-none transition-transform motion-safe:duration-[var(--duration-fast)] motion-safe:ease-[var(--ease-in-out)] motion-safe:group-hover:translate-y-0 motion-safe:group-focus-visible:translate-y-0 motion-reduce:hidden"
      >
        {children}
      </span>
    </span>
  );
}
