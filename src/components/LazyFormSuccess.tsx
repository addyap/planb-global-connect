import { lazy, Suspense, type ComponentProps } from "react";

// FormSuccess is the only user of framer-motion, so loading it on demand keeps ~40 KB (gzip)
// of animation code out of the homepage bundle. Forms call preloadFormSuccess() as they
// submit, so the chunk is normally ready by the time the server replies.
const load = () => import("./FormSuccess");
const FormSuccessChunk = lazy(() => load().then((m) => ({ default: m.FormSuccess })));

export const preloadFormSuccess = () => {
  void load().catch(() => undefined);
};

export const LazyFormSuccess = (props: ComponentProps<typeof FormSuccessChunk>) => (
  <Suspense fallback={<div role="status" className={`min-h-[24rem] rounded-2xl border border-border bg-card ${props.className ?? ""}`} />}>
    <FormSuccessChunk {...props} />
  </Suspense>
);
