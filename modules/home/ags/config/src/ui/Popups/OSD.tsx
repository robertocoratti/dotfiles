import { createBinding } from "ags";
import { Astal, Gdk } from "ags/gtk4";
import Wp from "gi://AstalWp";
import Box from "../../components/Box";
import Icon from "../../components/Icon";
import Text from "../../components/Text";
import { icons } from "../../lib/icons";

const wp = Wp.get_default();

interface OSDProps {
  monitor: Gdk.Monitor;
}

export default function OSD({ monitor }: OSDProps) {
  const speaker = wp?.audio?.defaultSpeaker;
  const mic = wp?.audio?.defaultMicrophone;

  const speakerIcon = createBinding(speaker, "volumeIcon").as(
    (icon: string) => icon || icons.volume.high,
  );
  const speakerVolume = createBinding(speaker, "volume").as(
    (v: number) => `${Math.round(v * 100)}%`,
  );
  const speakerVisible = createBinding(speaker, "volume").as(
    (_v: number) => true,
  );

  const micIcon = createBinding(mic, "volumeIcon").as(
    (icon: string) => icon || icons.microphone.high,
  );
  const micVolume = createBinding(mic, "volume").as(
    (v: number) => `${Math.round(v * 100)}%`,
  );
  const micVisible = createBinding(mic, "volume").as(
    (_v: number) => true,
  );

  return (
    <box>
      {/* Speaker OSD */}
      <window
        gdkmonitor={monitor}
        name={`osd-speaker-${monitor.connector}`}
        layer={Astal.Layer.OVERLAY}
        anchor={
          Astal.WindowAnchor.BOTTOM |
          Astal.WindowAnchor.LEFT |
          Astal.WindowAnchor.RIGHT
        }
        exclusivity={Astal.Exclusivity.IGNORE}
        clickThrough={true}
        keymode={Astal.Keymode.NONE}
        visible={speakerVisible}
      >
        <Box class="osd-box" halign={3} gap={12}>
          <Icon icon={speakerIcon} size={24} class="osd-icon" />
          <slider
            cssClasses={["osd-slider"]}
            value={createBinding(speaker, "volume")}
            onValueChanged={({ value }) => {
              speaker?.set_volume(value);
            }}
          />
          <Text class="osd-label" children={speakerVolume} />
        </Box>
      </window>

      {/* Microphone OSD */}
      <window
        gdkmonitor={monitor}
        name={`osd-mic-${monitor.connector}`}
        layer={Astal.Layer.OVERLAY}
        anchor={
          Astal.WindowAnchor.BOTTOM |
          Astal.WindowAnchor.LEFT |
          Astal.WindowAnchor.RIGHT
        }
        exclusivity={Astal.Exclusivity.IGNORE}
        clickThrough={true}
        keymode={Astal.Keymode.NONE}
        visible={micVisible}
      >
        <Box class="osd-box" halign={3} gap={12}>
          <Icon icon={micIcon} size={24} class="osd-icon" />
          <slider
            cssClasses={["osd-slider"]}
            value={createBinding(mic, "volume")}
            onValueChanged={({ value }) => {
              mic?.set_volume(value);
            }}
          />
          <Text class="osd-label" children={micVolume} />
        </Box>
      </window>
    </box>
  );
}
