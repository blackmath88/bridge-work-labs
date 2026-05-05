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
