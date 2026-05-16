import { Astal, Gtk } from "ags/gtk3"
import { createBinding } from "ags"
import { For } from "ags"
import { execAsync } from "ags/process"
import Bluetooth from "gi://AstalBluetooth"

export function BluetoothPanelWindow() {
  const bt = Bluetooth.get_default()
  const powered = createBinding(bt, "isPowered")

  const pairedDevices = createBinding(bt, "devices").as((devs: any[]) =>
    (devs ?? []).filter((d) => d.paired).sort((a: any, b: any) => {
      if (a.connected && !b.connected) return -1
      if (!a.connected && b.connected) return 1
      return (a.name ?? "").localeCompare(b.name ?? "")
    })
  )

  return (
    <window
      name="BluetoothPanel"
      namespace="panel"
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.IGNORE}
      visible={false}
      marginTop={44}
      marginRight={6}
    >
      <box class="panel-box" vertical>
        <box class="panel-header">
          <label
            label={powered.as((on: boolean) => (on ? "󰂯  Bluetooth" : "󰂲  Bluetooth"))}
            hexpand
            halign={Gtk.Align.START}
          />
          <button
            class={powered.as((on: boolean) => (on ? "panel-toggle active" : "panel-toggle"))}
            onClicked={() => bt.toggle()}
          >
            <label label={powered.as((on: boolean) => (on ? "Attivo" : "Spento"))} />
          </button>
        </box>
        <box class="panel-separator" />
        <box vertical>
          <For each={pairedDevices} id={(d: any) => d.address}>
            {(device: any) => {
              const connected = createBinding(device, "connected")
              const name = createBinding(device, "name")
              return (
                <box
                  class={connected.as((c: boolean) => (c ? "bt-device connected" : "bt-device"))}
                >
                  <label
                    label={name.as((n: string) => n ?? device.address)}
                    hexpand
                    halign={Gtk.Align.START}
                  />
                  <button
                    class="bt-connect-btn"
                    onClicked={() => {
                      if (device.connected) {
                        execAsync(["bluetoothctl", "disconnect", device.address]).catch(() => {})
                      } else {
                        execAsync(["bluetoothctl", "connect", device.address]).catch(() => {})
                      }
                    }}
                  >
                    <label
                      label={connected.as((c: boolean) => (c ? "Disconnetti" : "Connetti"))}
                    />
                  </button>
                </box>
              )
            }}
          </For>
          <label
            label="Nessun dispositivo associato"
            class="panel-empty"
            visible={pairedDevices.as((d: any[]) => d.length === 0)}
          />
        </box>
      </box>
    </window>
  )
}
