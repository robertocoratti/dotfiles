import { createBinding } from "ags"
import Battery from "gi://AstalBattery"

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
    <button
      class="bar-item bar-item-icon"
      tooltipText={pct.as((p: number) => `Batteria: ${Math.round(p * 100)}%`)}
    >
      <icon icon={iconName} pixelSize={22} />
    </button>
  )
}
