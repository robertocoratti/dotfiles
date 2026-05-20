import { createBinding } from "ags";
import Notifd from "gi://AstalNotifd";
import Box from "../../components/Box";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import Text from "../../components/Text";
import { icons } from "../../lib/icons";
const notifd = Notifd.get_default();

export default function NotificationsPanel() {
  return (
    <Box class="panel-box" vertical>
      <Box gap={8}>
        <Text class="panel-header" children="Notifications" />
        <Button
          class="panel-button"
          onClicked={() => {
            notifd.get_notifications().forEach((n) => n.dismiss());
          }}
        >
          <Text children="Clear All" />
        </Button>
      </Box>

      <separator cssClasses={["panel-separator"]} />

      <scrollable vexpand cssClasses={["notifications-scroll"]}>
        <Box vertical gap={4}>
          {createBinding(notifd, "notifications").as((notifications) => {
            const active = notifications.filter((n) => !n.dismissed);
            if (active.length === 0) {
              return (
                <Text
                  children="No notifications"
                />
              );
            }

            return active.map((n) => (
              <Box class="notification-panel-item" vertical gap={4}>
                <Box gap={8}>
                  <image
                    gicon={createBinding(n, "appIcon")}
                    pixelSize={24}
                    cssClasses={["notification-app-icon"]}
                  />
                  <Box vertical hexpand>
                    <Text class="notification-summary" children={n.summary} />
                    <Text class="notification-body" children={n.body} truncate={60} />
                  </Box>
                  <Button
                    class="notification-close"
                    onClicked={() => n.dismiss()}
                  >
                    <Icon icon={icons.empty} size={14} />
                  </Button>
                </Box>
                <Text
                  class="notification-time"
                  children={new Date(n.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                />
              </Box>
            ));
          })}
        </Box>
      </scrollable>
    </Box>
  );
}
