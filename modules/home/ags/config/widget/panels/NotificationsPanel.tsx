import { Astal, Gtk } from "ags/gtk3"
import { createBinding } from "ags"
import { For } from "ags"
import Notifd from "gi://AstalNotifd"

export function NotificationsPanelWindow() {
  const notifd = Notifd.get_default()
  const notifications = createBinding(notifd, "notifications")

  return (
    <window
      name="NotificationsPanel"
      namespace="panel"
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.IGNORE}
      visible={false}
      marginTop={44}
      marginRight={6}
    >
      <box class="panel-box notif-panel" vertical>
        <box class="panel-header">
          <label label="󰂚  Notifiche" hexpand halign={Gtk.Align.START} />
          <button
            class="panel-action-btn-small"
            onClicked={() => {
              notifd.notifications.forEach((n: any) => n.dismiss())
            }}
            visible={notifications.as((n: any[]) => n.length > 0)}
          >
            <label label="Cancella" />
          </button>
        </box>
        <box class="panel-separator" />
        <scrollable
          hscroll={Gtk.PolicyType.NEVER}
          vscroll={Gtk.PolicyType.AUTOMATIC}
          class="notif-scroll"
          heightRequest={400}
        >
          <box vertical>
            <For each={notifications} id={(n: any) => n.id}>
              {(notif: any) => (
                <box class="notif-item" vertical>
                  <box>
                    <label
                      label={notif.appName ?? "App"}
                      class="notif-app"
                      hexpand
                      halign={Gtk.Align.START}
                    />
                    <button
                      class="notif-dismiss"
                      onClicked={() => notif.dismiss()}
                    >
                      <label label="✕" />
                    </button>
                  </box>
                  <label
                    label={notif.summary ?? ""}
                    class="notif-summary"
                    halign={Gtk.Align.START}
                    wrap
                  />
                  <label
                    label={notif.body ?? ""}
                    class="notif-body"
                    halign={Gtk.Align.START}
                    wrap
                    visible={!!(notif.body)}
                  />
                </box>
              )}
            </For>
            <label
              label="Nessuna notifica"
              class="panel-empty"
              visible={notifications.as((n: any[]) => n.length === 0)}
            />
          </box>
        </scrollable>
      </box>
    </window>
  )
}
