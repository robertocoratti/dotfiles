import { createBinding } from "ags";
import Notifd from "gi://AstalNotifd";
import Box from "../../components/Box";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import Text from "../../components/Text";
import { icons } from "../../lib/icons";
import { togglePanel } from "../../lib/state";

const notifd = Notifd.get_default();

export default function Notifications() {
  const count = createBinding(notifd, "notifications").as(
    (n) => n.filter((notif) => !notif.dismissed).length,
  );

  return (
    <Box class="bar-notif">
      <Button
        onClicked={() => togglePanel("notifications")}
        tooltipText="Notifications"
      >
        <Icon icon={icons.notifications.bell} size={16} />
        {count.as((c) =>
          c > 0 ? (
            <box cssClasses={["bar-notif-badge"]}>
              <label label={`${c}`} halign={1} valign={1} />
            </box>
          ) : null,
        )}
      </Button>
    </Box>
  );
}
