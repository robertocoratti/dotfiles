import { createBinding } from "ags"
import Network from "gi://AstalNetwork"
import { Gtk } from "ags/gtk3"
import { togglePanel } from "../utils/panelManager"

function wifiIcon(strength: number): string {
  if (strength > 75) return "network-wireless-signal-excellent-symbolic"
  if (strength > 50) return "network-wireless-signal-good-symbolic"
  if (strength > 25) return "network-wireless-signal-ok-symbolic"
  return "network-wireless-signal-weak-symbolic"
}

export default function NetworkWidget() {
  const network = Network.get_default()
  const primary = createBinding(network, "primary")

  const iconName = primary.as((p: any) => {
    if (p === Network.Primary.WIFI)
      return wifiIcon(network.wifi?.strength ?? 0)
    if (p === Network.Primary.WIRED) return "network-wired-symbolic"
    return "network-offline-symbolic"
  })

  const label = primary.as((p: any) => {
    if (p === Network.Primary.WIRED) return "Cablata"
    if (p === Network.Primary.WIFI) return network.wifi?.ssid ?? "WiFi"
    return "Assente"
  })

  return (
    <button
      class="module network"
      tooltipText="Rete"
      onClicked={(self: any) => togglePanel("NetworkPanel", self)}
    >
      <box spacing={6} valign={Gtk.Align.CENTER}>
        <icon icon={iconName} pixelSize={20} valign={Gtk.Align.CENTER} />
        <label label={label} valign={Gtk.Align.CENTER} />
      </box>
    </button>
  )
}
