import { createBinding } from "ags";
import Tray from "gi://AstalTray";
import Box from "../../components/Box";
import Button from "../../components/Button";

const tray = Tray.get_default();

export default function SysTray() {
  return (
    <Box class="bar-tray">
      {createBinding(tray, "items").as((items: any[]) =>
        items.map((item) => (
          <Button
            tooltipText={createBinding(item, "tooltipMarkup")}
            onClicked={(self) => {
              item.actionGroup?.activate_action(
                "toggle",
                undefined,
              );
            }}
          >
            <image gicon={createBinding(item, "gicon")} pixelSize={16} />
          </Button>
        )),
      )}
    </Box>
  );
}
