import { createBinding } from "ags";
import { Astal, Gdk } from "ags/gtk4";
import Notifd from "gi://AstalNotifd";
import GLib from "gi://GLib?version=2.0";
import Box from "../../components/Box";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import Text from "../../components/Text";

const notifd = Notifd.get_default();

interface NotificationPopupsProps {
  monitor: Gdk.Monitor;
}

export default function NotificationPopups({
  monitor,
}: NotificationPopupsProps) {
  return (
    <window
      gdkmonitor={monitor}
      name={`notifpopups-${monitor.connector}`}
      layer={Astal.Layer.OVERLAY}
      anchor={
        Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT
      }
      exclusivity={Astal.Exclusivity.IGNORE}
      keymode={Astal.Keymode.NONE}
      visible={true}
    >
      <Box vertical gap={4}>
        {createBinding(notifd, "notifications").as((notifications: any[]) =>
          notifications
            .filter((n) => !n.dismissed)
            .slice(0, 3)
            .map((n) => {
              const classes = ["notification-popup"];
              if (n.urgency === 3) classes.push("critical");

              // Auto-dismiss after 6 seconds
              GLib.timeout_add(GLib.PRIORITY_DEFAULT, 6000, () => {
                n.dismiss();
                return GLib.SOURCE_REMOVE;
              });

              return (
                <Box class={classes.join(" ")} vertical gap={4}>
                  <Box gap={8}>
                    <image
                      gicon={n.appIcon}
                      pixelSize={24}
                      cssClasses={["notification-app-icon"]}
                    />
                    <Box vertical hexpand>
                      <Text class="notification-summary" children={n.summary} />
                      <Text class="notification-body" children={n.body} truncate={80} />
                    </Box>
                    <Button
                      class="notification-close"
                      onClicked={() => n.dismiss()}
                    >
                      <Icon icon="window-close-symbolic" size={12} />
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
              );
            }),
        )}
      </Box>
    </window>
  );
}
