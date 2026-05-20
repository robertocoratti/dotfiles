import { Gtk } from "ags/gtk4";

interface ButtonProps {
  onClicked?: (self: Gtk.Button) => void;
  hexpand?: boolean;
  vexpand?: boolean;
  halign?: Gtk.Align;
  class?: string;
  visible?: boolean;
  tooltipText?: string;
  children?: Gtk.Widget | Gtk.Widget[];
}

export default function Button({
  onClicked,
  hexpand,
  vexpand,
  halign,
  class: className,
  visible,
  tooltipText,
  children,
}: ButtonProps) {
  return (
    <button
      onClicked={onClicked}
      hexpand={hexpand}
      vexpand={vexpand}
      halign={halign}
      cssClasses={className ? [className] : []}
      visible={visible}
      tooltipText={tooltipText}
    >
      {children}
    </button>
  );
}
