import { createBinding } from "ags"
import Wp from "gi://AstalWp"
import Gdk from "gi://Gdk?version=3.0"
import { Gtk } from "ags/gtk3"
import { togglePanel } from "../utils/panelManager"

function volumeIcon(muted: boolean, volume: number): string {
  if (muted) return "audio-volume-muted-symbolic"
  if (volume > 0.66) return "audio-volume-high-symbolic"
  if (volume > 0.33) return "audio-volume-medium-symbolic"
  return "audio-volume-low-symbolic"
}

export default function Volume() {
  const audio = Wp.get_default()?.audio
  if (!audio) return <box />
  const speaker = audio.defaultSpeaker
  if (!speaker) return <box />

  const iconName = createBinding(speaker, "mute").as((m: boolean) =>
    volumeIcon(m, speaker.volume)
  )
  const vol = createBinding(speaker, "volume").as(
    (v: number) => `${Math.round(v * 100)}%`
  )

  return (
    <button
      class="module volume"
      tooltipText="Volume"
      onClicked={(self: any) => togglePanel("VolumePanel", self)}
      onScroll={(_: any, event: any) => {
        const dir = event.direction
        if (dir === Gdk.ScrollDirection.UP)
          speaker.volume = Math.min(1.5, speaker.volume + 0.05)
        else if (dir === Gdk.ScrollDirection.DOWN)
          speaker.volume = Math.max(0, speaker.volume - 0.05)
      }}
    >
      <box spacing={6} valign={Gtk.Align.CENTER}>
        <icon icon={iconName} pixelSize={20} valign={Gtk.Align.CENTER} />
        <label label={vol} valign={Gtk.Align.CENTER} />
      </box>
    </button>
  )
}
