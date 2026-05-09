type RouteCopy = {
  eyebrow: string;
  title: string;
  description: string;
};

export function StepHeader({ route }: { route: RouteCopy }) {
  return (
    <div className="no-print mb-9 animate-fade-in">
      <p className="eyebrow-accent">{route.eyebrow}</p>
      <h2 className="display-2 mt-3 max-w-3xl">{route.title}</h2>
      <p className="lede mt-4 max-w-2xl">{route.description}</p>
    </div>
  );
}
