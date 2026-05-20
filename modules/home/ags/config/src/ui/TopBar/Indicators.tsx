import { createBinding } from "ags";
import Wp from "gi://AstalWp";
import Network from "gi://AstalNetwork";
import Bluetooth from "gi://AstalBluetooth";
import { createPoll } from "ags/time";
import { exec } from "ags/process";
import Box from "../../components/Box";
import Icon from "../../components/Icon";
import Text from "../../components/Text";
import { icons } from "../../lib/icons";

const wp = Wp.get_default();
const network = Network.get_default();
const bluetooth = Bluetooth.get_default();

const cpuPoll = createPoll(2000, () => {
  const idle = Number(exec("cat /proc/stat | head -1 | awk '{print $5}'"));
  return idle;
});

let prevIdle = 0;
let prevTotal = 0;

const cpuPercent = cpuPoll(() => {
  const idle = cpuPoll.get();
  const line = exec("cat /proc/stat | head -1");
  const values = line
    .split(" ")
    .slice(2)
    .map(Number)
    .filter((n) => !isNaN(n));
  const total = values.reduce((a, b) => a + b, 0);

  if (prevIdle === 0 || prevTotal === 0) {
    prevIdle = idle;
    prevTotal = total;
    return 0;
  }

  const totalDiff = total - prevTotal;
  const idleDiff = idle - prevIdle;
  const usage = Math.round(((totalDiff - idleDiff) / totalDiff) * 100);

  prevIdle = idle;
  prevTotal = total;
  return usage;
});

const ramPercent = createPoll(2000, () => {
  const mem = exec("free -b | grep Mem");
  const parts = mem.split(/\s+/);
  const total = Number(parts[1]);
  const used = Number(parts[2]);
  return Math.round((used / total) * 100);
});

export default function Indicators() {
  const speaker = wp?.audio?.defaultSpeaker;
  const mic = wp?.audio?.defaultMicrophone;

  return (
    <Box class="bar-indicator" gap={8}>
      {/* Volume */}
      <Icon
        icon={createBinding(speaker, "volumeIcon") || icons.volume.high}
        size={16}
      />
      <Text children={createBinding(speaker, "volume").as((v: number) => `${Math.round(v * 100)}%`)} />

      {/* Network */}
      <Icon icon={icons.network.wifi} size={16} />

      {/* Bluetooth */}
      {bluetooth.isPowered ? (
        <Icon icon={icons.bluetooth.enabled} size={16} />
      ) : null}

      {/* CPU */}
      <Text children={cpuPercent(() => `CPU ${cpuPercent.get()}%`)} />

      {/* RAM */}
      <Text children={ramPercent(() => `RAM ${ramPercent.get()}%`)} />
    </Box>
  );
}
