import { createBinding } from "ags"
import Notifd from "gi://AstalNotifd"
import { togglePanel } from "../utils/panelManager"

export default function Notifications() {
  const notifd = Notifd.get_default()
  const count = createBinding(notifd, "notifications").as((n: any[]) => n.length)

  return (
    <button
      class="bar-item bar-item-icon"
      tooltipText="Notifiche"
      onClicked={(self: any) => togglePanel("NotificationsPanel", self)}
    >
      <box>
        <icon icon="notification-symbolic" pixelSize={22} />
        <label
          label={count.as((n: number) => `${n}`)}
          class="bar-notif-badge"
          visible={count.as((n: number) => n > 0)}
        />
      </box>
    </button>
  )
}
