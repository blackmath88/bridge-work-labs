export type StepId = "vision" | "build" | "reflect" | "output";

export type StepRoute = {
  id: StepId;
};

export const stepRoutes: StepRoute[] = [
  { id: "vision" },
  { id: "build" },
  { id: "reflect" },
  { id: "output" },
];

const stepIds = stepRoutes.map((route) => route.id);

export function isStepId(value: string): value is StepId {
  return (stepIds as string[]).includes(value);
}

export function readStepFromHash(): StepId | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = window.location.hash.replace(/^#\/?/, "");
  return isStepId(raw) ? raw : null;
}

export function writeStepToHash(step: StepId) {
  if (typeof window === "undefined") {
    return;
  }
  const target = `#/${step}`;
  if (window.location.hash !== target) {
    window.history.replaceState(null, "", target);
  }
}
