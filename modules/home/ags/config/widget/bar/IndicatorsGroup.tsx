import { createBinding } from "ags"
import { createPoll } from "ags/time"
import { exec } from "ags/process"
import Wp from "gi://AstalWp"
import Network from "gi://AstalNetwork"
import Bluetooth from "gi://AstalBluetooth"
import { togglePanel } from "../utils/panelManager"

function volumeIcon(muted: boolean, volume: number): string {
  if (muted) return "audio-volume-muted-symbolic"
  if (volume > 0.66) return "audio-volume-high-symbolic"
  if (volume > 0.33) return "audio-volume-medium-symbolic"
  return "audio-volume-low-symbolic"
}

function wifiIcon(strength: number): string {
  if (strength > 75) return "network-wireless-signal-excellent-symbolic"
  if (strength > 50) return "network-wireless-signal-good-symbolic"
  if (strength > 25) return "network-wireless-signal-ok-symbolic"
  return "network-wireless-signal-weak-symbolic"
}

let prevIdle = 0
let prevTotal = 0

export default function IndicatorsGroup() {
  const audio = Wp.get_default()?.audio
  const speaker = audio?.defaultSpeaker
  const mic = audio?.defaultMicrophone
  const network = Network.get_default()
  const bt = Bluetooth.get_default()

  const speakerIcon = speaker
    ? createBinding(speaker, "mute").as((m: boolean) => volumeIcon(m, speaker.volume))
    : null
  const micIcon = mic
    ? createBinding(mic, "mute").as((m: boolean) =>
        m ? "microphone-sensitivity-muted-symbolic" : "microphone-sensitivity-high-symbolic"
      )
    : null
  const netIcon = createBinding(network, "primary").as((p: any) => {
    if (p === Network.Primary.WIFI) return wifiIcon(network.wifi?.strength ?? 0)
    if (p === Network.Primary.WIRED) return "network-wired-symbolic"
    return "network-offline-symbolic"
  })
  const btIcon = createBinding(bt, "isPowered").as((on: boolean) =>
    on ? "bluetooth-active-symbolic" : "bluetooth-disabled-symbolic"
  )

  const cpu = createPoll(0, 2000, () => {
    try {
      const line = exec("head -1 /proc/stat")
      const parts = line.split(/\s+/).filter(Boolean).slice(1).map(Number)
      const idle = parts[3]
      const total = parts.reduce((a: number, b: number) => a + b, 0)
      const usage = prevTotal > 0
        ? Math.round(((total - prevTotal - (idle - prevIdle)) / (total - prevTotal)) * 100)
        : 0
      prevIdle = idle
      prevTotal = total
      return Math.max(0, Math.min(100, usage))
    } catch {
      return 0
    }
  })

  const ram = createPoll(0, 4000, () => {
    try {
      const lines = exec("cat /proc/meminfo").split("\n")
      const total = parseInt(lines[0].split(/\s+/)[1])
      const avail = parseInt(lines[2].split(/\s+/)[1])
      return Math.round(((total - avail) / total) * 100)
    } catch {
      return 0
    }
  })

  return (
    <button
      class="bar-item bar-item-icon indicators-group"
      tooltipText="Pannello di controllo"
      onClicked={(self: any) => togglePanel("QuickSettings", self)}
    >
      <box spacing={2}>
        {speakerIcon && <icon icon={speakerIcon} pixelSize={20} />}
        {micIcon && <icon icon={micIcon} pixelSize={20} />}
        <icon icon={netIcon} pixelSize={20} />
        <icon icon={btIcon} pixelSize={20} />
        <label label={cpu.as((v: number) => `${v}`)} class="bar-res-cpu" />
        <label label={ram.as((v: number) => `${v}`)} class="bar-res-ram" />
      </box>
    </button>
  )
}
