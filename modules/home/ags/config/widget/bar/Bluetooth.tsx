import { createBinding } from "ags"
import Bluetooth from "gi://AstalBluetooth"
import { togglePanel } from "../utils/panelManager"

export default function BluetoothWidget() {
  const bt = Bluetooth.get_default()
  const iconName = createBinding(bt, "isPowered").as((on: boolean) =>
    on ? "bluetooth-active-symbolic" : "bluetooth-disabled-symbolic"
  )

  return (
    <button
      class="module bluetooth"
      tooltipText="Bluetooth"
      onClicked={(self: any) => togglePanel("BluetoothPanel", self)}
    >
      <icon icon={iconName} pixelSize={20} />
    </button>
  )
}
