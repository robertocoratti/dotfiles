import { Astal, Gtk } from "ags/gtk3"
import { createBinding } from "ags"
import Wp from "gi://AstalWp"

export function MicrophonePanelWindow() {
  const audio = Wp.get_default()?.audio
  const mic = audio?.defaultMicrophone

  if (!mic) {
    return (
      <window name="MicrophonePanel" namespace="panel" visible={false}>
        <box />
      </window>
    )
  }

  const vol = createBinding(mic, "volume")
  const muted = createBinding(mic, "mute")
  const desc = createBinding(mic, "description").as((d: string | null) => d ?? "")

  return (
    <window
      name="MicrophonePanel"
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
          <label label="󰍬  Microfono" hexpand halign={Gtk.Align.START} />
          <label
            label={vol.as((v: number) => `${Math.round(v * 100)}%`)}
            class="panel-value"
          />
        </box>
        <slider
          class="panel-slider"
          hexpand
          min={0}
          max={1.0}
          step={0.02}
          value={vol}
          onDragged={(self: any) => {
            mic.volume = self.value
          }}
        />
        <button
          class={muted.as((m: boolean) => (m ? "panel-mute-btn active" : "panel-mute-btn"))}
          onClicked={() => {
            mic.mute = !mic.mute
          }}
        >
          <label label={muted.as((m: boolean) => (m ? "󰍭  Muto" : "󰍬  Attivo"))} />
        </button>
        <label label={desc} class="panel-device-name" />
      </box>
    </window>
  )
}
