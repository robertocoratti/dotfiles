import { createPoll } from "ags/time";
import Box from "../../components/Box";
import Icon from "../../components/Icon";
import Text from "../../components/Text";
import Separator from "../../components/Separator";
import { icons } from "../../lib/icons";

const weatherPoll = createPoll(600, () => {
  // Stub until weather API key is available
  return [
    { date: "Today", high: 22, low: 14, icon: icons.weather.sunny, desc: "Clear" },
    { date: "Tomorrow", high: 20, low: 12, icon: icons.weather.cloudy, desc: "Cloudy" },
    { date: "Day 3", high: 18, low: 10, icon: icons.weather.rain, desc: "Rain" },
    { date: "Day 4", high: 19, low: 11, icon: icons.weather.cloudy, desc: "Cloudy" },
    { date: "Day 5", high: 23, low: 15, icon: icons.weather.sunny, desc: "Sunny" },
    { date: "Day 6", high: 24, low: 16, icon: icons.weather.sunny, desc: "Sunny" },
  ];
});

export default function WeatherPanel() {
  const binding = weatherPoll(() => weatherPoll.get());

  return (
    <Box class="weather-box" vertical>
      <Text class="panel-header" children="Weather Forecast" />

      {binding.as((forecast: any[]) =>
        forecast.map((day) => (
          <Box>
            <Box class="weather-forecast-day" gap={8}>
              <Icon icon={day.icon} size={24} class="weather-forecast-icon" />
              <Box vertical hexpand>
                <Text children={day.date} />
                <Text children={day.desc} />
              </Box>
              <Box gap={4}>
                <Text class="weather-forecast-temp" children={`${day.high}°`} />
                <Text
                  class="weather-forecast-low"
                  children={`${day.low}°`}
                />
              </Box>
            </Box>
            <Separator />
          </Box>
        )),
      )}
    </Box>
  );
}
