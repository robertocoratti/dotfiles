import { Astal, Gtk, Gdk } from "ags/gtk3"
import GLib from "gi://GLib?version=2.0"
import Notifd from "gi://AstalNotifd"

const popupBoxes: any[] = []

function addToBox(container: any, notif: any) {
  const win = container.get_toplevel()

  const row = (
    <box class="popup-item" vertical>
      <box>
        <label
          label={notif.appName ?? "Notifica"}
          class="notif-app"
          hexpand
          halign={Gtk.Align.START}
        />
        <button class="notif-dismiss" onClicked={() => notif.dismiss()}>
          <label label="✕" />
        </button>
      </box>
      <label
        label={notif.summary ?? ""}
        class="notif-summary"
        halign={Gtk.Align.START}
        wrap
        maxWidthChars={36}
      />
      {notif.body
        ? <label label={notif.body} class="notif-body" halign={Gtk.Align.START} wrap maxWidthChars={36} />
        : <box />}
    </box>
  )

  container.add(row)
  ;(row as any).show_all()
  win.visible = true

  GLib.timeout_add(GLib.PRIORITY_DEFAULT, 6000, () => {
    if ((row as any).get_parent()) {
      container.remove(row)
      if (container.get_children().length === 0) win.visible = false
    }
    return GLib.SOURCE_REMOVE
  })
}

function addPopup(notif: any) {
  for (const box of popupBoxes) addToBox(box, notif)
}

let listenerRegistered = false

export function NotificationPopupsWindow(monitor: Gdk.Monitor) {
  const notifd = Notifd.get_default()

  const container = <box vertical class="popup-container" />
  popupBoxes.push(container)

  if (!listenerRegistered) {
    listenerRegistered = true
    notifd.connect("notified", (_: any, id: number) => {
      const notif = notifd.notifications.find((n: any) => n.id === id)
      if (notif) addPopup(notif)
    })
  }

  return (
    <window
      name={`NotificationPopups-${popupBoxes.length}`}
      namespace="notifications"
      gdkmonitor={monitor}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.IGNORE}
      visible={false}
      marginTop={44}
      marginRight={6}
    >
      {container}
    </window>
  )
}
