import { createBinding } from "ags";
import Wp from "gi://AstalWireplumber";
import Network from "gi://AstalNetwork";
import Bluetooth from "gi://AstalBluetooth";
import Box from "../../components/Box";
import Icon from "../../components/Icon";
import Text from "../../components/Text";
import Separator from "../../components/Separator";
import { icons } from "../../lib/icons";

const wp = Wp.get_default();
const network = Network.get_default();
const bluetooth = Bluetooth.get_default();

export default function QuickSettings() {
  const speaker = wp?.audio?.defaultSpeaker;
  const mic = wp?.audio?.defaultMicrophone;

  return (
    <Box class="panel-box" vertical>
      <Text class="panel-header" children="Quick Settings" />

      {/* Volume */}
      <Box gap={8}>
        <Icon
          icon={createBinding(speaker, "volumeIcon") || icons.volume.high}
          size={20}
        />
        <Box vertical gap={4} hexpand>
          <Text
            children={createBinding(speaker, "volume").as(
              (v: number) => `Volume — ${Math.round(v * 100)}%`,
            )}
          />
          <slider
            cssClasses={["panel-slider"]}
            hexpand
            value={createBinding(speaker, "volume")}
            onValueChanged={({ value }) => {
              speaker?.set_volume(value);
            }}
          />
        </Box>
      </Box>

      <Separator />

      {/* Microphone */}
      <Box gap={8}>
        <Icon
          icon={createBinding(mic, "volumeIcon") || icons.microphone.high}
          size={20}
        />
        <Box vertical gap={4} hexpand>
          <Text
            children={createBinding(mic, "volume").as(
              (v: number) => `Microphone — ${Math.round(v * 100)}%`,
            )}
          />
          <slider
            cssClasses={["panel-slider"]}
            hexpand
            value={createBinding(mic, "volume")}
            onValueChanged={({ value }) => {
              mic?.set_volume(value);
            }}
          />
        </Box>
      </Box>

      <Separator />

      {/* Network */}
      <Box gap={8}>
        <Icon icon={icons.network.wifi} size={20} />
        <Box vertical gap={2} hexpand>
          <Text
            children={createBinding(network, "primary") || "Disconnected"}
          />
          <Text
            class="bar-indicator-text"
            children={createBinding(network.wifi, "ssid").as(
              (s: string) => s || "",
            )}
          />
        </Box>
      </Box>

      <Separator />

      {/* Bluetooth */}
      <Box gap={8}>
        <Icon
          icon={
            bluetooth.isPowered
              ? icons.bluetooth.enabled
              : icons.bluetooth.disabled
          }
          size={20}
        />
        <Box vertical gap={2} hexpand>
          <Text
            children={
              bluetooth.isPowered ? "Bluetooth On" : "Bluetooth Off"
            }
          />
          {bluetooth.bind("devices").as((devices) =>
            devices
              .filter((d) => d.connected)
              .map((d) => (
                <Text children={d.name} />
              )),
          )}
        </Box>
      </Box>
    </Box>
  );
}
