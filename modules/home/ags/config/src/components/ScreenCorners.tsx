import { Astal, Gtk, Gdk } from "ags/gtk4";

interface ScreenCornersProps {
  monitor: Gdk.Monitor;
}

export default function ScreenCorners({ monitor }: ScreenCornersProps) {
  return (
    <window
      gdkmonitor={monitor}
      name="screen-corners"
      layer={Astal.Layer.OVERLAY}
      anchor={
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.RIGHT |
        Astal.WindowAnchor.BOTTOM |
        Astal.WindowAnchor.LEFT
      }
      exclusivity={Astal.Exclusivity.IGNORE}
      clickThrough={true}
      visible={true}
      cssClasses={["screen-corners"]}
    >
      <box />
    </window>
  );
}
