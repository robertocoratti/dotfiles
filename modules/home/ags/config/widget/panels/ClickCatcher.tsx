import { Astal, Gdk } from "ags/gtk3"
import { closeActivePanel } from "../utils/panelManager"

export function ClickCatcherWindow(monitor: Gdk.Monitor, index: number) {
  return (
    <window
      name={`ClickCatcher-${index}`}
      namespace="click-catcher"
      gdkmonitor={monitor}
      anchor={
        Astal.WindowAnchor.TOP |
        Astal.WindowAnchor.BOTTOM |
        Astal.WindowAnchor.LEFT |
        Astal.WindowAnchor.RIGHT
      }
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.IGNORE}
      marginTop={44}
      visible={false}
    >
      <button
        hexpand
        vexpand
        class="click-catcher"
        onClicked={() => closeActivePanel()}
      />
    </window>
  )
}
