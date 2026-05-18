import { Astal } from "ags/gtk3"
import { exec } from "ags/process"
import { togglePanel, closeActivePanel } from "../utils/panelManager"

export function PowerMenuWindow() {
  return (
    <window
      name="PowerMenu"
      namespace="panel"
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.IGNORE}
      visible={false}
      marginTop={44}
      marginRight={6}
    >
      <box class="panel-box powermenu-box" vertical>
        <button
          class="shutdown"
          onClicked={() => {
            closeActivePanel()
            exec("systemctl poweroff")
          }}
        >
          <box>
            <icon icon="system-shutdown-symbolic" pixelSize={18} />
            <label label="  Spegni" />
          </box>
        </button>
        <button
          class="reboot"
          onClicked={() => {
            closeActivePanel()
            exec("systemctl reboot")
          }}
        >
          <box>
            <icon icon="system-reboot-symbolic" pixelSize={18} />
            <label label="  Riavvia" />
          </box>
        </button>
        <button
          class="hibernate"
          onClicked={() => {
            closeActivePanel()
            exec("systemctl hibernate")
          }}
        >
          <box>
            <icon icon="weather-clear-night-symbolic" pixelSize={18} />
            <label label="  Iberna" />
          </box>
        </button>
        <button
          class="logout"
          onClicked={() => {
            closeActivePanel()
            exec("hyprctl dispatch exit 0")
          }}
        >
          <box>
            <icon icon="system-log-out-symbolic" pixelSize={18} />
            <label label="  Logout" />
          </box>
        </button>
      </box>
    </window>
  )
}

export default function PowerButton() {
  return (
    <button
      class="bar-item bar-item-icon bar-power"
      tooltipText="Menu di spegnimento"
      onClicked={(self: any) => togglePanel("PowerMenu", self)}
    >
      <icon icon="system-shutdown-symbolic" pixelSize={22} />
    </button>
  )
}
