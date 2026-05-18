import { createPoll } from "ags/time"
import GLib from "gi://GLib?version=2.0"
import { togglePanel } from "../utils/panelManager"

export default function Clock() {
  const time = createPoll("", 1000, () =>
    GLib.DateTime.new_now_local().format("%d/%m/%y  %H:%M")!
  )

  return (
    <button
      class="bar-item"
      onClicked={(self: any) => togglePanel("CalendarPanel", self)}
    >
      <box spacing={6}>
        <icon icon="preferences-system-time-symbolic" pixelSize={18} />
        <label label={time} class="bar-clock" />
      </box>
    </button>
  )
}
