import { Gtk } from "ags/gtk4";

interface IconProps {
  icon: string;
  size?: number;
  class?: string;
  halign?: Gtk.Align;
}

export default function Icon({
  icon,
  size,
  class: className,
  halign,
}: IconProps) {
  return (
    <image
      iconName={icon}
      pixelSize={size}
      cssClasses={className ? [className] : []}
      halign={halign}
    />
  );
}
