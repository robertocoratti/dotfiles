import { Astal, Gdk, App } from "ags/gtk4";
import GLib from "gi://GLib?version=2.0";

interface WallpaperProps {
  monitor: Gdk.Monitor;
}

export default function Wallpaper({ monitor }: WallpaperProps) {
  const path = `${GLib.get_user_config_dir()}/ags/wallpaper.jpg`;

  return (
    <window
      gdkmonitor={monitor}
      name="wallpaper"
      layer={Astal.Layer.BOTTOM}
      anchor={
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.RIGHT |
        Astal.WindowAnchor.BOTTOM |
        Astal.WindowAnchor.LEFT
      }
      exclusivity={Astal.Exclusivity.IGNORE}
      visible={true}
    >
      <image file={path} cssClasses={["wallpaper-img"]} />
    </window>
  );
}
