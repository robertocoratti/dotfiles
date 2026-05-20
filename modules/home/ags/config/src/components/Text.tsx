import { Gtk } from "ags/gtk4";

interface TextProps {
  children: string;
  halign?: Gtk.Align;
  xalign?: number;
  truncate?: number;
  wrap?: boolean;
  class?: string;
  visible?: boolean;
}

export default function Text({
  children,
  halign,
  xalign,
  truncate,
  wrap,
  class: className,
  visible,
}: TextProps) {
  return (
    <label
      label={children}
      halign={halign}
      xalign={xalign}
      maxWidthChars={truncate}
      wrap={wrap}
      cssClasses={className ? [className] : []}
      visible={visible}
    />
  );
}
