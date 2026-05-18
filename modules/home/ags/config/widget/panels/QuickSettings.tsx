import { Astal, Gtk } from "ags/gtk3"
import { createBinding, For } from "ags"
import { createPoll } from "ags/time"
import { execAsync } from "ags/process"
import Wp from "gi://AstalWp"
import Network from "gi://AstalNetwork"
import Bluetooth from "gi://AstalBluetooth"
import { closeActivePanel } from "../utils/panelManager"

// ─── Section header helper ───

function SectionHeader({ icon, label }: { icon: string; label: string }) {
  return (
    <box class="panel-header">
      <label label={`${icon}  ${label}`} hexpand halign={Gtk.Align.START} />
    </box>
  )
}

// ─── Volume section ───

function VolumeSection() {
  const audio = Wp.get_default()?.audio
  if (!audio) return null
  const spk = audio.defaultSpeaker
  if (!spk) return null

  const volBinding = createBinding(spk, "volume")
  const vol = volBinding.as((v: number) => `${Math.round(v * 100)}%`)
  const muted = createBinding(spk, "mute").as((m: boolean) => m)

  return (
    <box vertical>
      <box class="panel-header">
        <label label="Uscita audio" hexpand halign={Gtk.Align.START} />
        <label label={vol} class="panel-value" />
      </box>
      <slider
        class="panel-slider"
        hexpand
        min={0}
        max={1.5}
        step={0.02}
        value={volBinding}
        onDragged={(self: any) => {
          const s = audio.defaultSpeaker
          if (s) s.volume = self.value
        }}
      />
      <button
        class={muted.as((m: boolean) => (m ? "panel-mute-btn active" : "panel-mute-btn"))}
        onClicked={() => {
          const s = audio.defaultSpeaker
          if (s) s.mute = !s.mute
        }}
      >
        <label label={muted.as((m: boolean) => (m ? "Muto" : "Attivo"))} />
      </button>
      <box vertical spacing={2}>
        <For each={createBinding(audio, "speakers")}>
          {(dev: any) => (
            <button
              class={volBinding.as((_: any) => (spk === dev ? "panel-device-btn active" : "panel-device-btn"))}
              hexpand
              onClicked={() => dev.set_is_default(true)}
            >
              <box>
                <label label={dev.description ?? "Dispositivo"} hexpand halign={Gtk.Align.START} />
              </box>
            </button>
          )}
        </For>
      </box>
    </box>
  )
}

// ─── Microphone section ───

function MicrophoneSection() {
  const audio = Wp.get_default()?.audio
  if (!audio) return null
  const mic = audio.defaultMicrophone
  if (!mic) return null

  const volBinding = createBinding(mic, "volume")
  const vol = volBinding.as((v: number) => `${Math.round(v * 100)}%`)
  const muted = createBinding(mic, "mute").as((m: boolean) => m)

  return (
    <box vertical>
      <box class="panel-header">
        <label label="Ingresso audio" hexpand halign={Gtk.Align.START} />
        <label label={vol} class="panel-value" />
      </box>
      <slider
        class="panel-slider"
        hexpand
        min={0}
        max={1.0}
        step={0.02}
        value={volBinding}
        onDragged={(self: any) => {
          const m = audio.defaultMicrophone
          if (m) m.volume = self.value
        }}
      />
      <button
        class={muted.as((m: boolean) => (m ? "panel-mute-btn active" : "panel-mute-btn"))}
        onClicked={() => {
          const m = audio.defaultMicrophone
          if (m) m.mute = !m.mute
        }}
      >
        <label label={muted.as((m: boolean) => (m ? "Muto" : "Attivo"))} />
      </button>
      <box vertical spacing={2}>
        <For each={createBinding(audio, "microphones")}>
          {(dev: any) => (
            <button
              class={volBinding.as((_: any) => (mic === dev ? "panel-device-btn active" : "panel-device-btn"))}
              hexpand
              onClicked={() => dev.set_is_default(true)}
            >
              <box>
                <label label={dev.description ?? "Dispositivo"} hexpand halign={Gtk.Align.START} />
              </box>
            </button>
          )}
        </For>
      </box>
    </box>
  )
}

// ─── Network section ───

function NetworkSection() {
  const network = Network.get_default()
  const primary = createBinding(network, "primary")

  const ssid = primary.as((p: any) =>
    p === Network.Primary.WIFI ? (network.wifi?.ssid ?? "WiFi") : "—"
  )
  const strength = primary.as((p: any) =>
    p === Network.Primary.WIFI ? `${network.wifi?.strength ?? 0}%` : ""
  )
  const connType = primary.as((p: any) => {
    if (p === Network.Primary.WIFI) return "WiFi"
    if (p === Network.Primary.WIRED) return "Cablata"
    return "Assente"
  })

  const ip = createPoll("—", 5000, async () => {
    try {
      const out = await execAsync(["ip", "-4", "addr", "show", "scope", "global"])
      const match = out.match(/inet (\d+\.\d+\.\d+\.\d+)/)
      return match ? match[1] : "—"
    } catch {
      return "—"
    }
  })

  return (
    <box vertical>
      <label label={connType} class="panel-header" halign={Gtk.Align.START} />
      <box class="panel-row">
        <label label="SSID" class="panel-label" />
        <label label={ssid} class="panel-value" hexpand halign={Gtk.Align.END} />
      </box>
      <box class="panel-row" visible={primary.as((p: any) => p === Network.Primary.WIFI)}>
        <label label="Segnale" class="panel-label" />
        <label label={strength} class="panel-value" hexpand halign={Gtk.Align.END} />
      </box>
      <box class="panel-row">
        <label label="IP" class="panel-label" />
        <label label={ip} class="panel-value" hexpand halign={Gtk.Align.END} />
      </box>
      <button
        class="panel-action-btn"
        onClicked={() => { execAsync(["kitty", "-e", "nmtui"]).catch(() => {}); closeActivePanel() }}
      >
        <label label="Impostazioni rete" />
      </button>
    </box>
  )
}

// ─── Bluetooth section ───

function BluetoothSection() {
  const bt = Bluetooth.get_default()
  const powered = createBinding(bt, "isPowered")

  const pairedDevices = createBinding(bt, "devices").as((devs: any[]) =>
    (devs ?? []).filter((d: any) => d.paired).sort((a: any, b: any) => {
      if (a.connected && !b.connected) return -1
      if (!a.connected && b.connected) return 1
      return (a.name ?? "").localeCompare(b.name ?? "")
    })
  )

  return (
    <box vertical>
      <box class="panel-header">
        <label
          label={powered.as((on: boolean) => (on ? "Bluetooth" : "Bluetooth"))}
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
      <box vertical>
        <For each={pairedDevices} id={(d: any) => d.address}>
          {(device: any) => {
            const connected = createBinding(device, "connected")
            const name = createBinding(device, "name")
            return (
              <box class={connected.as((c: boolean) => (c ? "bt-device connected" : "bt-device"))}>
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
  )
}

// ─── Window ───

export function QuickSettingsWindow() {
  return (
    <window
      name="QuickSettings"
      namespace="panel"
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.IGNORE}
      visible={false}
      marginTop={44}
      marginRight={6}
    >
      <box class="panel-box" vertical spacing={6}>
        <VolumeSection />
        <box class="panel-separator" />
        <MicrophoneSection />
        <box class="panel-separator" />
        <NetworkSection />
        <box class="panel-separator" />
        <BluetoothSection />
      </box>
    </window>
  )
}
