import { createPoll } from "ags/time"
import { execAsync } from "ags/process"
import { togglePanel } from "../utils/panelManager"

const URL =
  "https://api.open-meteo.com/v1/forecast" +
  "?latitude=41.863978&longitude=12.669580" +
  "&current=temperature_2m,weather_code" +
  "&timezone=Europe%2FRome"

export function weatherIconName(code: number): string {
  if (code === 0) return "weather-clear-symbolic"
  if (code <= 2) return "weather-few-clouds-symbolic"
  if (code === 3) return "weather-overcast-symbolic"
  if (code <= 48) return "weather-fog-symbolic"
  if (code <= 57) return "weather-showers-scattered-symbolic"
  if (code <= 67) return "weather-showers-symbolic"
  if (code <= 77) return "weather-snow-symbolic"
  if (code <= 82) return "weather-showers-symbolic"
  if (code <= 86) return "weather-snow-symbolic"
  return "weather-storm-symbolic"
}

interface WeatherData { icon: string; temp: string }

export default function Weather() {
  const weather = createPoll<WeatherData>(
    { icon: "weather-clear-symbolic", temp: "--°C" },
    600_000,
    async () => {
      try {
        const out = await execAsync(["curl", "-sf", "--max-time", "5", URL])
        const d = JSON.parse(out)
        return {
          icon: weatherIconName(d.current.weather_code),
          temp: `${Math.round(d.current.temperature_2m)}°C`,
        }
      } catch {
        return { icon: "weather-clear-symbolic", temp: "--°C" }
      }
    }
  )

  return (
    <button
      class="bar-item"
      tooltipText="Meteo: Colle Mattia"
      onClicked={(self: any) => togglePanel("WeatherPanel", self)}
    >
      <box spacing={4}>
        <icon
          icon={weather.as((w: WeatherData) => w.icon)}
          pixelSize={20}
        />
        <label
          label={weather.as((w: WeatherData) => w.temp)}
        />
      </box>
    </button>
  )
}
