import { createBinding } from "ags";
import { Gtk, Gdk } from "ags/gtk4";
import Hyprland from "gi://AstalHyprland";
import Box from "../../components/Box";
import Button from "../../components/Button";
import Icon from "../../components/Icon";

const hyprland = Hyprland.get_default();

const KNOWN_ICONS: Record<string, string> = {
  "firefox": "firefox",
  "firefox-nightly": "firefox-nightly",
  "chromium": "chromium",
  "google-chrome": "google-chrome",
  "brave": "brave-browser",
  "code": "code-oss",
  "code-oss": "code-oss",
  "com.visualstudio.code": "code",
  "org.wezfurlong.wezterm": "org.wezfurlong.wezterm",
  "wezterm": "org.wezfurlong.wezterm",
  "kitty": "kitty",
  "alacritty": "Alacritty",
  "ghostty": "com.mitchellh.ghostty",
  "org.gnome.Terminal": "org.gnome.Terminal",
  "spotify": "spotify",
  "steam": "steam",
  "discord": "discord",
  "obsidian": "obsidian",
  "bitwarden": "bitwarden",
  "thunderbird": "thunderbird",
  "nautilus": "org.gnome.Nautilus",
  "org.gnome.Nautilus": "org.gnome.Nautilus",
  "thunar": "org.xfce.thunar",
  "dolphin": "dolphin",
  "gedit": "org.gnome.gedit",
  "geary": "org.gnome.Geary",
  "evince": "org.gnome.Evince",
  "gimp": "gimp",
  "inkscape": "inkscape",
  "blender": "blender",
  "vlc": "vlc",
  "mpv": "mpv",
  "signal": "signal-desktop",
  "telegram": "telegram-desktop",
  "slack": "slack",
  "element": "element-desktop",
};

function getAppIcon(client: Hyprland.Client): string {
  const wmClass = client.class?.trim() || "";
  const lowerClass = wmClass.toLowerCase();

  if (KNOWN_ICONS[lowerClass]) {
    return KNOWN_ICONS[lowerClass];
  }

  if (KNOWN_ICONS[wmClass]) {
    return KNOWN_ICONS[wmClass];
  }

  const display = Gdk.Display.get_default();
  if (display) {
    const theme = Gtk.IconTheme.get_for_display(display);
    if (lowerClass && theme.has_icon(lowerClass)) {
      return lowerClass;
    }
    if (wmClass && theme.has_icon(wmClass)) {
      return wmClass;
    }
  }

  return "application-x-executable";
}

interface WorkspacesProps {
  monitor: Gdk.Monitor;
}

export default function Workspaces({ monitor }: WorkspacesProps) {
  return (
    <Box class="bar-ws" gap={4}>
      {createBinding(hyprland, "workspaces").as((workspaces: any[]) =>
        workspaces
          .filter((ws) => ws.monitor?.name === monitor.connector)
          .sort((a, b) => a.id - b.id)
          .map((ws) => {
            const isActive = ws.id === hyprland.focusedWorkspace.id;
            const clients = hyprland
              .get_clients()
              .filter(
                (c) => c.workspace?.id === ws.id && c.class !== "",
              );

            return (
              <Button
                onClicked={() => hyprland.dispatch("workspace", `${ws.id}`)}
                tooltipText={`Workspace ${ws.id}`}
              >
                <Box class={isActive ? "bar-ws active" : "bar-ws"} gap={4}>
                  <box cssClasses={["bar-ws-dot"]} />
                  {clients.slice(0, 4).map((client) => (
                    <Icon
                      icon={getAppIcon(client)}
                      size={12}
                      class="bar-ws-app-icon"
                    />
                  ))}
                </Box>
              </Button>
            );
          }),
      )}
    </Box>
  );
}
