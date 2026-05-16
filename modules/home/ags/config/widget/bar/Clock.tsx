import { createPoll } from "ags/time"
import GLib from "gi://GLib?version=2.0"
import { Gtk } from "ags/gtk3"
import { togglePanel } from "../utils/panelManager"

export default function Clock() {
  const time = createPoll("", 1000, () =>
    GLib.DateTime.new_now_local().format("%d/%m/%y %H:%M")!
  )

  return (
    <button
      class="module clock"
      onClicked={(self: any) => togglePanel("CalendarPanel", self)}
    >
      <box spacing={6} valign={Gtk.Align.CENTER}>
        <icon icon="preferences-system-time-symbolic" pixelSize={18} valign={Gtk.Align.CENTER} />
        <label label={time} valign={Gtk.Align.CENTER} />
      </box>
    </button>
  )
}
