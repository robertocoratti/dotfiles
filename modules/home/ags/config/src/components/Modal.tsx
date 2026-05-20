import { Astal, Gtk, Gdk } from "ags/gtk4";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  monitor: Gdk.Monitor;
  name: string;
  halign?: Gtk.Align;
  valign?: Gtk.Align;
  class?: string;
  widthRequest?: number;
  children?: Gtk.Widget | Gtk.Widget[];
}

export default function Modal({
  open,
  onClose,
  monitor,
  name,
  halign = Gtk.Align.CENTER,
  valign = Gtk.Align.CENTER,
  class: className,
  widthRequest,
  children,
}: ModalProps) {
  return (
    <window
      gdkmonitor={monitor}
      name={name}
      layer={Astal.Layer.OVERLAY}
      anchor={
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.RIGHT |
        Astal.WindowAnchor.BOTTOM |
        Astal.WindowAnchor.LEFT
      }
      exclusivity={Astal.Exclusivity.IGNORE}
      keymode={open ? Astal.Keymode.EXCLUSIVE : Astal.Keymode.NONE}
      visible={open}
      cssClasses={className ? [className] : []}
      halign={halign}
      valign={valign}
      widthRequest={widthRequest}
    >
      {children}
    </window>
  );
}
