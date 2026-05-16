import { createBinding } from "ags"
import Notifd from "gi://AstalNotifd"
import { Gtk } from "ags/gtk3"
import { togglePanel } from "../utils/panelManager"

export default function Notifications() {
  const notifd = Notifd.get_default()
  const count = createBinding(notifd, "notifications").as((n: any[]) => n.length)

  return (
    <button
      class="module notifications"
      tooltipText="Notifiche"
      onClicked={(self: any) => togglePanel("NotificationsPanel", self)}
    >
      <box spacing={6} valign={Gtk.Align.CENTER}>
        <icon icon="preferences-system-notifications-symbolic" pixelSize={20} valign={Gtk.Align.CENTER} />
        <label
          label={count.as((n: number) => `${n}`)}
          valign={Gtk.Align.CENTER}
        />
      </box>
    </button>
  )
}
