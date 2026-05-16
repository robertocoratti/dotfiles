import { Astal, Gtk } from "ags/gtk3"
import { createBinding } from "ags"
import { createPoll } from "ags/time"
import { execAsync } from "ags/process"
import Network from "gi://AstalNetwork"
import { closeActivePanel } from "../utils/panelManager"

export function NetworkPanelWindow() {
  const network = Network.get_default()
  const primary = createBinding(network, "primary")

  const ssid = primary.as((p: any) =>
    p === Network.Primary.WIFI ? (network.wifi?.ssid ?? "WiFi") : "—"
  )

  const strength = primary.as((p: any) =>
    p === Network.Primary.WIFI ? `${network.wifi?.strength ?? 0}%` : ""
  )

  const connType = primary.as((p: any) => {
    if (p === Network.Primary.WIFI) return "󰤨  WiFi"
    if (p === Network.Primary.WIRED) return "󰈀  Cablata"
    return "󰤭  Assente"
  })

  const ip = createPoll("—", 5000, async () => {
    try {
      const out = await execAsync(["ip", "-4", "addr", "show", "scope", "global"])
      const match = out.match(/inet (\d+\.\d+\.\d+\.\d+)/)
      return match ? match[1] : "—"
    } catch {
      return "—"
    }
  })

  return (
    <window
      name="NetworkPanel"
      namespace="panel"
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.IGNORE}
      visible={false}
      marginTop={44}
      marginRight={6}
    >
      <box class="panel-box" vertical>
        <label label={connType} class="panel-header" halign={Gtk.Align.START} />
        <box class="panel-row">
          <label label="SSID" class="panel-label" />
          <label label={ssid} class="panel-value" hexpand halign={Gtk.Align.END} />
        </box>
        <box
          class="panel-row"
          visible={primary.as((p: any) => p === Network.Primary.WIFI)}
        >
          <label label="Segnale" class="panel-label" />
          <label label={strength} class="panel-value" hexpand halign={Gtk.Align.END} />
        </box>
        <box class="panel-row">
          <label label="IP" class="panel-label" />
          <label label={ip} class="panel-value" hexpand halign={Gtk.Align.END} />
        </box>
        <button
          class="panel-action-btn"
          onClicked={() => { execAsync(["kitty", "-e", "nmtui"]).catch(() => {}); closeActivePanel() }}
        >
          <label label="Impostazioni rete" />
        </button>
      </box>
    </window>
  )
}
