import { Astal, Gtk } from "ags/gtk3"
import { createBinding } from "ags"
import Wp from "gi://AstalWp"
import GLib from "gi://GLib?version=2.0"

export function MicrophoneOsdWindow() {
  const audio = Wp.get_default()?.audio

  if (!audio) {
    return (
      <window name="MicrophoneOsd" namespace="panel" visible={false}>
        <box />
      </window>
    )
  }

  const mic = audio.defaultMicrophone
  if (!mic) {
    return (
      <window name="MicrophoneOsd" namespace="panel" visible={false}>
        <box />
      </window>
    )
  }

  const volBinding = createBinding(mic, "volume")
  const vol = volBinding.as((v: number) => `${Math.round(v * 100)}`)

  let firstStart = true
  let count = 0

  function showOsd(win: any) {
    win.anchor = Astal.WindowAnchor.RIGHT
    win.marginRight = 6
    win.visible = true
    count++

    GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1500, () => {
      count--
      if (count === 0) {
        win.visible = false
      }
      return GLib.SOURCE_REMOVE
    })
  }

  const win = (
    <window
      name="MicrophoneOsd"
      namespace="panel"
      anchor={Astal.WindowAnchor.RIGHT}
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.IGNORE}
      visible={false}
      marginRight={6}
    >
      <box class="osd-box" vertical>
        <icon icon="audio-input-microphone-symbolic" pixelSize={20} />
        <slider
          class="osd-slider"
          orientation={Gtk.Orientation.VERTICAL}
          min={0}
          max={1.0}
          step={0.02}
          value={volBinding}
          onDragged={(self: any) => {
            const m = audio.defaultMicrophone
            if (m) m.volume = self.value
          }}
        />
        <label label={vol} class="osd-value" />
      </box>
    </window>
  ) as any

  GLib.timeout_add(GLib.PRIORITY_DEFAULT, 500, () => {
    firstStart = false
    return GLib.SOURCE_REMOVE
  })

  mic.connect("notify::volume", () => {
    if (firstStart) return
    showOsd(win)
  })

  mic.connect("notify::mute", () => {
    if (firstStart) return
    showOsd(win)
  })

  return win
}
