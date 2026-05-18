import { createBinding } from "ags"
import { For } from "ags"
import Hyprland from "gi://AstalHyprland"
import Gtk3 from "gi://Gtk?version=3.0"

const KNOWN_ICONS: Record<string, string> = {
  "code-oss": "code-oss",
  "code": "code-oss",
  "com.visualstudio.code": "com.visualstudio.code",
  "google-chrome": "google-chrome",
  "chromium": "chromium",
  "firefox": "firefox",
  "org.wezfurlong.wezterm": "org.wezfurlong.wezterm",
  "wezterm": "org.wezfurlong.wezterm",
  "thunar": "org.xfce.thunar",
  "nautilus": "org.gnome.Nautilus",
  "kitty": "kitty",
  "obsidian": "obsidian",
  "spotify": "spotify",
  "discord": "discord",
  "steam": "steam",
  "signal": "signal-desktop",
  "telegram": "telegram-desktop",
  "slack": "slack",
  "gedit": "org.gnome.gedit",
  "evince": "org.gnome.Evince",
  "eog": "org.gnome.eog",
  "gnome-calculator": "org.gnome.Calculator",
  "pavucontrol": "pavucontrol",
  "blueman": "blueman",
  "gimp": "gimp",
  "inkscape": "inkscape",
  "libreoffice": "libreoffice-startcenter",
  "vlc": "vlc",
  "mpv": "mpv",
  "zen": "zen",
}

function getAppIcon(wmClass: string): string {
  const cls = (wmClass ?? "").toLowerCase()

  for (const [key, icon] of Object.entries(KNOWN_ICONS)) {
    if (cls.includes(key)) return icon
  }

  const iconTheme = Gtk3.IconTheme.get_default()
  if (iconTheme && iconTheme.lookup_icon(cls, 16, Gtk3.IconLookupFlags.FORCE_SIZE))
    return cls

  return "application-x-executable-symbolic"
}

export default function Workspaces() {
  const hyprland = Hyprland.get_default()
  const workspaces = createBinding(hyprland, "workspaces").as((wss) =>
    (wss ?? []).filter((ws) => ws.id > 0).sort((a, b) => a.id - b.id)
  )
  const focused = createBinding(hyprland, "focusedWorkspace")
  const clients = createBinding(hyprland, "clients")

  return (
    <box>
      <For each={workspaces} id={(ws) => ws.id}>
        {(ws) => (
          <button
            class={focused.as((fw) => (fw?.id === ws.id ? "bar-ws active" : "bar-ws"))}
            onClicked={() => hyprland.dispatch("workspace", String(ws.id))}
          >
            <box spacing={3}>
              <label label={String(ws.id)} class="bar-ws-label" />
              <box class="bar-ws-icons" spacing={1}>
                <For each={clients.as((cl: any[]) =>
                  (cl ?? []).filter((c) => c.workspace?.id === ws.id)
                )}>
                  {(client: any) => (
                    <icon
                      icon={getAppIcon(client.class ?? "")}
                      pixelSize={16}
                      class="bar-ws-app-icon"
                    />
                  )}
                </For>
              </box>
            </box>
          </button>
        )}
      </For>
    </box>
  )
}
