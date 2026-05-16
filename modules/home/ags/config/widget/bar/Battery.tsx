import { createBinding } from "ags"
import Battery from "gi://AstalBattery"
import { Gtk } from "ags/gtk3"

function batteryIcon(pct: number, charging: boolean): string {
  const level =
    pct > 0.9 ? "full" :
    pct > 0.6 ? "good" :
    pct > 0.3 ? "low" :
    pct > 0.1 ? "caution" : "empty"
  return charging
    ? `battery-${level}-charging-symbolic`
    : `battery-${level}-symbolic`
}

export default function BatteryWidget() {
  const battery = Battery.get_default()
  if (!battery || !battery.isPresent) return <box />

  const pct = createBinding(battery, "percentage")
  const charging = createBinding(battery, "charging")
  const iconName = pct.as((p: number) => batteryIcon(p, charging.peek()))

  return (
    <button class="module battery" tooltipText="Batteria">
      <box spacing={6} valign={Gtk.Align.CENTER}>
        <icon icon={iconName} pixelSize={20} valign={Gtk.Align.CENTER} />
        <label
          label={pct.as((p: number) => `${Math.round(p * 100)}%`)}
          valign={Gtk.Align.CENTER}
        />
      </box>
    </button>
  )
}
