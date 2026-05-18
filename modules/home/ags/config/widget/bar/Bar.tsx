import { Astal, Gdk } from "ags/gtk3"
import { showBattery } from "../../config"
import Workspaces from "./Workspaces"
import WindowTitle from "./WindowTitle"
import Clock from "./Clock"
import Weather from "./Weather"
import IndicatorsGroup from "./IndicatorsGroup"
import SysTray from "./SysTray"
import Notifications from "./Notifications"
import PowerButton from "./PowerMenu"
import BatteryWidget from "./Battery"

export default function Bar(monitor: Gdk.Monitor) {
  return (
    <window
      name="Bar"
      namespace="bar"
      gdkmonitor={monitor}
      anchor={
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.LEFT |
        Astal.WindowAnchor.RIGHT
      }
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      layer={Astal.Layer.TOP}
      marginTop={6}
      marginLeft={6}
      marginRight={6}
    >
      <centerbox
        class="bar-inner"
        startWidget={
          <box spacing={8}>
            <Workspaces />
            <WindowTitle />
          </box>
        }
        centerWidget={
          <box spacing={8}>
            <Clock />
            <Weather />
          </box>
        }
        endWidget={
          <box spacing={2}>
            <IndicatorsGroup />
            <SysTray />
            {showBattery && <BatteryWidget />}
            <Notifications />
            <PowerButton />
          </box>
        }
      />
    </window>
  )
}
