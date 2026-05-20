import { Gtk } from "ags/gtk4";

interface CenterBoxProps {
  startWidget?: Gtk.Widget;
  centerWidget?: Gtk.Widget;
  endWidget?: Gtk.Widget;
  class?: string;
  hexpand?: boolean;
}

export default function CenterBox({
  startWidget,
  centerWidget,
  endWidget,
  class: className,
  hexpand,
}: CenterBoxProps) {
  return (
    <centerbox
      startWidget={startWidget}
      centerWidget={centerWidget}
      endWidget={endWidget}
      cssClasses={className ? [className] : []}
      hexpand={hexpand}
    />
  );
}
