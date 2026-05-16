import { Astal, Gtk } from "ags/gtk3"
import { createBinding } from "ags"
import Wp from "gi://AstalWp"

export function VolumePanelWindow() {
  const audio = Wp.get_default()?.audio
  const speaker = audio?.defaultSpeaker

  if (!speaker) {
    return (
      <window name="VolumePanel" namespace="panel" visible={false}>
        <box />
      </window>
    )
  }

  const vol = createBinding(speaker, "volume")
  const muted = createBinding(speaker, "mute")
  const desc = createBinding(speaker, "description").as((d: string | null) => d ?? "")

  return (
    <window
      name="VolumePanel"
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
          <label label="󰕾  Volume" hexpand halign={Gtk.Align.START} />
          <label
            label={vol.as((v: number) => `${Math.round(v * 100)}%`)}
            class="panel-value"
          />
        </box>
        <slider
          class="panel-slider"
          hexpand
          min={0}
          max={1.5}
          step={0.02}
          value={vol}
          onDragged={(self: any) => {
            speaker.volume = self.value
          }}
        />
        <button
          class={muted.as((m: boolean) => (m ? "panel-mute-btn active" : "panel-mute-btn"))}
          onClicked={() => {
            speaker.mute = !speaker.mute
          }}
        >
          <label label={muted.as((m: boolean) => (m ? "󰖁  Muto" : "󰕾  Attivo"))} />
        </button>
        <label label={desc} class="panel-device-name" />
      </box>
    </window>
  )
}
