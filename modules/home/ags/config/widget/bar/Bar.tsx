import { Astal, Gtk, Gdk } from "ags/gtk3"
import { showBattery } from "../../config"
import Workspaces from "./Workspaces"
import WindowTitle from "./WindowTitle"
import Clock from "./Clock"
import Weather from "./Weather"
import Volume from "./Volume"
import Microphone from "./Microphone"
import Resources from "./Resources"
import Network from "./Network"
import BluetoothWidget from "./Bluetooth"
import SysTray from "./SysTray"
import Notifications from "./Notifications"
import PowerButton from "./PowerMenu"
import BatteryWidget from "./Battery"

export default function Bar(monitor: Gdk.Monitor) {
  const leftBox = (
    <box halign={Gtk.Align.START}>
      <Workspaces />
      <WindowTitle />
    </box>
  )

  const centerBox = (
    <box>
      <Clock />
      <Weather />
    </box>
  )

  const rightBox = (
    <box halign={Gtk.Align.END}>
      <Microphone />
      <Volume />
      <Resources />
      <Network />
      <BluetoothWidget />
      <SysTray />
      {showBattery && <BatteryWidget />}
      <Notifications />
      <PowerButton />
    </box>
  )

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
        startWidget={leftBox}
        centerWidget={centerBox}
        endWidget={rightBox}
      />
    </window>
  )
}
