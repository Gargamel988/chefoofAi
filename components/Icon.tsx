import dynamic from "next/dynamic";

const iconComponents = {
  X: dynamic(() =>
    import("lucide-react").then((mod) => ({ default: mod.X }))
  ),
  Star: dynamic(() =>
    import("lucide-react").then((mod) => ({ default: mod.Star }))
  ),
  Trash2: dynamic(() =>
    import("lucide-react").then((mod) => ({ default: mod.Trash2 }))
  ),
  ChefHat: dynamic(() =>
    import("lucide-react").then((mod) => ({ default: mod.ChefHat }))
  ),
  Clock: dynamic(() =>
    import("lucide-react").then((mod) => ({ default: mod.Clock }))
  ),
  Users: dynamic(() =>
    import("lucide-react").then((mod) => ({ default: mod.Users }))
  ),
  Utensils: dynamic(() =>
    import("lucide-react").then((mod) => ({ default: mod.Utensils }))
  ),
  Heart: dynamic(() =>
    import("lucide-react").then((mod) => ({ default: mod.Heart }))
  ),
  Sparkles: dynamic(() =>
    import("lucide-react").then((mod) => ({ default: mod.Sparkles }))
  ),
};

export default function Icon({
  name,
  className,
}: {
  name: keyof typeof iconComponents;
  className: string;
}) {
  const IconComponent = iconComponents[name];
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
}
