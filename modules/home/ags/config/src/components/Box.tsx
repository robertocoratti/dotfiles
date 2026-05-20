import { Gtk } from "ags/gtk4";

interface BoxProps {
  vertical?: boolean;
  hexpand?: boolean;
  vexpand?: boolean;
  halign?: Gtk.Align;
  valign?: Gtk.Align;
  gap?: number;
  class?: string;
  visible?: boolean;
  children?: Gtk.Widget | Gtk.Widget[];
}

export default function Box({
  vertical,
  hexpand,
  vexpand,
  halign,
  valign,
  gap,
  class: className,
  visible,
  children,
}: BoxProps) {
  return (
    <box
      orientation={vertical ? 1 : 0}
      hexpand={hexpand}
      vexpand={vexpand}
      halign={halign}
      valign={valign}
      spacing={gap}
      cssClasses={className ? [className] : []}
      visible={visible}
    >
      {children}
    </box>
  );
}
