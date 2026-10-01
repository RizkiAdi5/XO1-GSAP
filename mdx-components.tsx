import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h2: (props) => <h2 className="mt-12 text-3xl text-ink" {...props} />,
  h3: (props) => <h3 className="mt-8 text-2xl text-ink" {...props} />,
  p: (props) => <p className="mt-4 leading-relaxed text-ink" {...props} />,
  ul: (props) => (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-ink" {...props} />
  ),
  ol: (props) => (
    <ol className="mt-4 list-decimal space-y-2 pl-5 text-ink" {...props} />
  ),
  a: (props) => (
    <a className="text-accent underline underline-offset-2" {...props} />
  ),
  strong: (props) => <strong className="font-semibold" {...props} />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
