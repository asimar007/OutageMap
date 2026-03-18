import React from "react";

export function ServiceIcon({
  iconName,
}: {
  iconName: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  const Icon = iconName;
  return (
    <div className="relative flex size-11 items-center justify-center text-primary/70 transition-all duration-300 group-hover:text-primary">
      <Icon className="size-10" strokeWidth={1.5} />
    </div>
  );
}
