import { createBinding } from "ags";
import Battery from "gi://AstalBattery";
import Box from "../../components/Box";
import Icon from "../../components/Icon";
import Text from "../../components/Text";
import { icons } from "../../lib/icons";

const battery = Battery.get_default();

function getBatteryIcon(percent: number, charging: boolean): string {
  if (charging) return icons.battery.charging;
  if (percent >= 90) return icons.battery.full;
  if (percent >= 70) return icons.battery.high;
  if (percent >= 40) return icons.battery.medium;
  if (percent >= 20) return icons.battery.low;
  return icons.battery.critical;
}

export default function BatteryWidget() {
  const percent = createBinding(battery, "percentage");
  const charging = createBinding(battery, "charging");

  return (
    <Box class="bar-item" gap={4}>
      <Icon
        icon={percent.as((p) => getBatteryIcon(p * 100, charging.get()))}
        size={16}
      />
      <Text children={percent.as((p) => `${Math.round(p * 100)}%`)} />
    </Box>
  );
}
