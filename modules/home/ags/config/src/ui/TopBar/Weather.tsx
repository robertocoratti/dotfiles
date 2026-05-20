import { createPoll } from "ags/time";
import Box from "../../components/Box";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import Text from "../../components/Text";
import { icons } from "../../lib/icons";
import { togglePanel } from "../../lib/state";

const weatherData = createPoll(600, () => {
  // Stub until weather API key is available
  return { temp: 0, icon: icons.weather.sunny, desc: "N/A" };
});

export default function Weather() {
  return (
    <Button
      class="bar-weather"
      onClicked={() => togglePanel("weather")}
      tooltipText={weatherData.as((d) => d?.desc || "")}
    >
      <Box gap={4}>
        <Icon
          icon={weatherData.as((d) => d?.icon || icons.weather.cloudy)}
          size={16}
        />
        <Text
          class="bar-weather-temp"
          children={weatherData.as((d) => d ? `${d.temp}°` : "--°")}
        />
      </Box>
    </Button>
  );
}
