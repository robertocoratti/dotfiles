import { createPoll } from "ags/time";
import { execAsync } from "ags/process";
import Box from "../../components/Box";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import Text from "../../components/Text";
import { icons } from "../../lib/icons";
import { togglePanel } from "../../lib/state";

const weatherData = createPoll(600, async () => {
  try {
    const keyFile = "/var/lib/sopsjson/secrets.json";
    const raw = await execAsync(["cat", keyFile]);
    const secrets = JSON.parse(raw);
    const key = secrets.weather_api_key;

    const lat = 45.4642;
    const lon = 9.19;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`;

    const res = await execAsync(["curl", "-s", url]);
    const data = JSON.parse(res);

    return {
      temp: Math.round(data.main.temp),
      icon: getWeatherIcon(data.weather[0].id),
      desc: data.weather[0].description,
    };
  } catch {
    return { temp: 0, icon: icons.weather.cloudy, desc: "N/A" };
  }
});

function getWeatherIcon(code: number): string {
  if (code >= 200 && code < 300) return icons.weather.storm;
  if (code >= 300 && code < 600) return icons.weather.rain;
  if (code >= 600 && code < 700) return icons.weather.snow;
  if (code >= 700 && code < 800) return icons.weather.cloudy;
  if (code === 800) return icons.weather.sunny;
  return icons.weather.cloudy;
}

export default function Weather() {
  const binding = weatherData(() => weatherData.get());

  return (
    <Button
      class="bar-weather"
      onClicked={() => togglePanel("weather")}
      tooltipText={weatherData.get().desc}
    >
      <Box gap={4}>
        <Icon icon={binding.icon} size={16} />
        <Text class="bar-weather-temp" children={`${binding.temp}°`} />
      </Box>
    </Button>
  );
}
