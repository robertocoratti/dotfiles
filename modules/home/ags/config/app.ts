import app from "ags/gtk4/app";
import GLib from "gi://GLib?version=2.0";
import ForMonitors from "./src/lib/ForMonitors";
import Wallpaper from "./src/ui/Wallpaper";
import TopBar from "./src/ui/TopBar/index";
import NotificationPopups from "./src/ui/Popups/NotificationPopups";
import OSD from "./src/ui/Popups/OSD";

app.start({
  css: `${GLib.get_user_config_dir()}/ags/style.css`,
  main() {
    ForMonitors((monitor, index) => {
      Wallpaper({ monitor });
      TopBar({ monitor, index });
      NotificationPopups({ monitor });
      OSD({ monitor });
    });
  },
});
