import Box from "../../components/Box";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import { icons } from "../../lib/icons";
import { togglePanel } from "../../lib/state";

export default function PowerButton() {
  return (
    <Box class="bar-power">
      <Button
        onClicked={() => togglePanel("power")}
        tooltipText="Power Menu"
      >
        <Icon icon={icons.power} size={16} />
      </Button>
    </Box>
  );
}
