import { createBinding } from "ags"
import Wp from "gi://AstalWp"
import { togglePanel } from "../utils/panelManager"

export default function Microphone() {
  const audio = Wp.get_default()?.audio
  if (!audio) return <box />
  const mic = audio.defaultMicrophone
  if (!mic) return <box />

  const iconName = createBinding(mic, "mute").as((m: boolean) =>
    m ? "microphone-sensitivity-muted-symbolic" : "microphone-sensitivity-high-symbolic"
  )

  return (
    <button
      class="module microphone"
      tooltipText="Microfono"
      onClicked={(self: any) => togglePanel("MicrophonePanel", self)}
    >
      <icon icon={iconName} pixelSize={20} />
    </button>
  )
}
