import { Astal, Gtk } from "ags/gtk3"
import { createBinding } from "ags"
import Wp from "gi://AstalWp"
import GLib from "gi://GLib?version=2.0"

export function VolumeOsdWindow() {
  const audio = Wp.get_default()?.audio

  if (!audio) {
    return (
      <window name="VolumeOsd" namespace="panel" visible={false}>
        <box />
      </window>
    )
  }

  const spk = audio.defaultSpeaker
  if (!spk) {
    return (
      <window name="VolumeOsd" namespace="panel" visible={false}>
        <box />
      </window>
    )
  }

  const volBinding = createBinding(spk, "volume")
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
      name="VolumeOsd"
      namespace="panel"
      anchor={Astal.WindowAnchor.RIGHT}
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.IGNORE}
      visible={false}
      marginRight={6}
    >
      <box class="osd-box" vertical>
        <icon icon="audio-volume-high-symbolic" pixelSize={20} />
        <slider
          class="osd-slider"
          orientation={Gtk.Orientation.VERTICAL}
          min={0}
          max={1.5}
          step={0.02}
          value={volBinding}
          onDragged={(self: any) => {
            const s = audio.defaultSpeaker
            if (s) s.volume = self.value
          }}
        />
        <label label={vol} class="osd-value" />
      </box>
    </window>
  ) as any

  // Counter-based OSD: skip initial value, show on subsequent changes
  GLib.timeout_add(GLib.PRIORITY_DEFAULT, 500, () => {
    firstStart = false
    return GLib.SOURCE_REMOVE
  })

  spk.connect("notify::volume", () => {
    if (firstStart) return
    showOsd(win)
  })

  spk.connect("notify::mute", () => {
    if (firstStart) return
    showOsd(win)
  })

  return win
}
