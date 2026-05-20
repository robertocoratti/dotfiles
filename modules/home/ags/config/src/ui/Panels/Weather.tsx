import { createPoll } from "ags/time";
import { execAsync } from "ags/process";
import Box from "../../components/Box";
import Icon from "../../components/Icon";
import Text from "../../components/Text";
import Separator from "../../components/Separator";
import { icons } from "../../lib/icons";

const weatherPoll = createPoll(600, async () => {
  try {
    const keyFile = "/var/lib/sopsjson/secrets.json";
    const raw = await execAsync(["cat", keyFile]);
    const secrets = JSON.parse(raw);
    const key = secrets.weather_api_key;

    const lat = 45.4642;
    const lon = 9.19;
    const url =
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}&units=metric`;

    const res = await execAsync(["curl", "-s", url]);
    const data = JSON.parse(res);

    const daily: Record<
      string,
      { temps: number[]; icons: number[]; descs: string[] }
    > = {};

    for (const item of data.list) {
      const date = item.dt_txt.split(" ")[0];
      if (!daily[date]) {
        daily[date] = { temps: [], icons: [], descs: [] };
      }
      daily[date].temps.push(item.main.temp);
      daily[date].icons.push(item.weather[0].id);
      daily[date].descs.push(item.weather[0].description);
    }

    const forecast = Object.entries(daily)
      .slice(0, 6)
      .map(([date, d]) => ({
        date: new Date(date).toLocaleDateString([], {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        high: Math.round(Math.max(...d.temps)),
        low: Math.round(Math.min(...d.temps)),
        icon: getWeatherIcon(
          d.icons.sort(
            (a, b) =>
              d.icons.filter((x) => x === a).length -
              d.icons.filter((x) => x === b).length,
          )[0],
        ),
        desc: d.descs[0],
      }));

    return forecast;
  } catch {
    return [];
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

export default function WeatherPanel() {
  const binding = weatherPoll(() => weatherPoll.get());

  return (
    <Box class="weather-box" vertical>
      <Text class="panel-header" children="Weather Forecast" />

      {binding.as((forecast) =>
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
