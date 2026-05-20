import { execAsync } from "ags/process";
import Box from "../../components/Box";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import Text from "../../components/Text";
import { icons } from "../../lib/icons";
import { closeActivePanel } from "../../lib/state";

function powerAction(cmd: string) {
  closeActivePanel();
  execAsync(cmd).catch(() => {});
}

export default function PowerMenu() {
  return (
    <Box class="powermenu-box" vertical>
      <Text class="powermenu-header" children="Power Menu" />

      <Box gap={16} halign={3}>
        <Button
          class="powermenu-button shutdown"
          onClicked={() => powerAction("systemctl poweroff")}
        >
          <Box vertical gap={6} halign={3}>
            <Icon icon={icons.shutdown} size={32} />
            <Text class="powermenu-label" children="Shutdown" />
          </Box>
        </Button>

        <Button
          class="powermenu-button reboot"
          onClicked={() => powerAction("systemctl reboot")}
        >
          <Box vertical gap={6} halign={3}>
            <Icon icon={icons.reboot} size={32} />
            <Text class="powermenu-label" children="Reboot" />
          </Box>
        </Button>

        <Button
          class="powermenu-button logout"
          onClicked={() => powerAction("hyprctl dispatch exit")}
        >
          <Box vertical gap={6} halign={3}>
            <Icon icon={icons.logout} size={32} />
            <Text class="powermenu-label" children="Logout" />
          </Box>
        </Button>

        <Button
          class="powermenu-button hibernate"
          onClicked={() => powerAction("systemctl hibernate")}
        >
          <Box vertical gap={6} halign={3}>
            <Icon icon={icons.hibernate} size={32} />
            <Text class="powermenu-label" children="Hibernate" />
          </Box>
        </Button>
      </Box>
    </Box>
  );
}
