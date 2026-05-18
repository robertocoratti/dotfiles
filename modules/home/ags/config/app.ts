import app from "ags/gtk3/app"
import GLib from "gi://GLib?version=2.0"
import Bar from "./widget/bar/Bar"
import { PowerMenuWindow } from "./widget/bar/PowerMenu"
import { QuickSettingsWindow } from "./widget/panels/QuickSettings"
import { NotificationsPanelWindow } from "./widget/panels/NotificationsPanel"
import { CalendarPanelWindow } from "./widget/panels/CalendarPanel"
import { WeatherPanelWindow } from "./widget/panels/WeatherPanel"
import { ClickCatcherWindow } from "./widget/panels/ClickCatcher"
import { NotificationPopupsWindow } from "./widget/panels/NotificationPopups"
import { VolumeOsdWindow } from "./widget/panels/VolumeOsd"
import { MicrophoneOsdWindow } from "./widget/panels/MicrophoneOsd"
import { registerEscapeHandler } from "./widget/utils/panelManager"

function registerWindow(fn: () => any) {
  const win = fn()
  if (win) (app as any).add_window(win)
}

app.start({
  css: `${GLib.get_user_config_dir()}/ags/style.css`,
  main() {
    let i = 0
    app.get_monitors().forEach((monitor: any) => {
      registerWindow(() => Bar(monitor))
      registerWindow(() => ClickCatcherWindow(monitor, i))
      registerWindow(() => NotificationPopupsWindow(monitor))
      i++
    })
    registerWindow(PowerMenuWindow)
    registerWindow(QuickSettingsWindow)
    registerWindow(NotificationsPanelWindow)
    registerWindow(CalendarPanelWindow)
    registerWindow(WeatherPanelWindow)
    registerWindow(VolumeOsdWindow)
    registerWindow(MicrophoneOsdWindow)
    registerEscapeHandler()
  },
})
