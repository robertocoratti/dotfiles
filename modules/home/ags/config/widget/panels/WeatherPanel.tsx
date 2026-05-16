import { Astal, Gtk } from "ags/gtk3"
import { createPoll } from "ags/time"
import { execAsync } from "ags/process"
import { weatherIconName } from "../bar/Weather"

const URL =
  "https://api.open-meteo.com/v1/forecast" +
  "?latitude=41.863978&longitude=12.669580" +
  "&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code" +
  "&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max" +
  "&timezone=Europe%2FRome" +
  "&forecast_days=6"

interface DayForecast {
  date: string
  name: string
  icon: string
  max: number
  min: number
  precip: number
}

interface WeatherFull {
  icon: string
  temp: number
  feelsLike: number
  humidity: number
  wind: number
  daily: DayForecast[]
}

function dayName(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00")
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.round((date.getTime() - today.getTime()) / 86400000)
  if (diff === 0) return "Oggi"
  if (diff === 1) return "Domani"
  return ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"][date.getDay()]
}

const empty: WeatherFull = {
  icon: "weather-clear-symbolic",
  temp: 0,
  feelsLike: 0,
  humidity: 0,
  wind: 0,
  daily: [],
}

export function WeatherPanelWindow() {
  const weather = createPoll<WeatherFull>(empty, 600_000, async () => {
    try {
      const out = await execAsync(["curl", "-sf", "--max-time", "5", URL])
      const d = JSON.parse(out)
      const c = d.current
      const times: string[] = d.daily.time
      const daily: DayForecast[] = times.map((date: string, i: number) => ({
        date,
        name: dayName(date),
        icon: weatherIconName(d.daily.weather_code[i]),
        max: Math.round(d.daily.temperature_2m_max[i]),
        min: Math.round(d.daily.temperature_2m_min[i]),
        precip: d.daily.precipitation_probability_max[i] ?? 0,
      }))
      return {
        icon: weatherIconName(c.weather_code),
        temp: Math.round(c.temperature_2m),
        feelsLike: Math.round(c.apparent_temperature),
        humidity: Math.round(c.relative_humidity_2m),
        wind: Math.round(c.wind_speed_10m),
        daily,
      }
    } catch {
      return empty
    }
  })

  const bigIcon = new Gtk.Image()
  bigIcon.set_pixel_size(72)
  bigIcon.set_from_icon_name(empty.icon, Gtk.IconSize.DIALOG)
  bigIcon.show()
  weather.subscribe((w: WeatherFull) => {
    bigIcon.set_from_icon_name(w.icon, Gtk.IconSize.DIALOG)
  })

  const dailyBox = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 2 })
  dailyBox.show()
  let dailyRows: any[] = []
  weather.subscribe((w: WeatherFull) => {
    dailyRows.forEach((r) => dailyBox.remove(r))
    dailyRows = []
    for (const day of w.daily) {
      const row = new Gtk.Box({ spacing: 8 })
      row.get_style_context().add_class("weather-day")

      const nameLabel = new Gtk.Label({ label: day.name })
      nameLabel.get_style_context().add_class("weather-day-name")
      nameLabel.set_halign(Gtk.Align.START)
      nameLabel.set_hexpand(true)

      const icon = new Gtk.Image()
      icon.set_from_icon_name(day.icon, Gtk.IconSize.DIALOG)
      icon.set_pixel_size(18)
      icon.set_valign(Gtk.Align.CENTER)

      const temps = new Gtk.Label({ label: `${day.max}° / ${day.min}°` })
      temps.get_style_context().add_class("weather-day-temps")
      temps.set_halign(Gtk.Align.END)

      row.add(nameLabel)
      row.add(icon)
      row.add(temps)

      if (day.precip > 0) {
        const precip = new Gtk.Label({ label: `${day.precip}%` })
        precip.get_style_context().add_class("weather-day-precip")
        row.add(precip)
      }

      row.show_all()
      dailyBox.add(row)
      dailyRows.push(row)
    }
    dailyBox.queue_resize()
  })

  return (
    <window
      name="WeatherPanel"
      namespace="panel"
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.IGNORE}
      visible={false}
      marginTop={44}
      marginRight={6}
    >
      <box class="panel-box weather-panel" vertical spacing={4}>
        {/* Current conditions */}
        <box spacing={16} valign={Gtk.Align.CENTER}>
          {bigIcon}
          <box vertical valign={Gtk.Align.CENTER} spacing={4}>
            <label
              label={weather.as((w: WeatherFull) => `${w.temp}°C`)}
              class="weather-temp-big"
              halign={Gtk.Align.START}
            />
            <label
              label={weather.as((w: WeatherFull) => `Percepita ${w.feelsLike}°C`)}
              class="weather-feels"
              halign={Gtk.Align.START}
            />
          </box>
        </box>

        {/* Details row */}
        <box class="weather-details" spacing={24}>
          <box vertical spacing={1} halign={Gtk.Align.CENTER}>
            <label label="Umidità" class="weather-detail-key" />
            <label
              label={weather.as((w: WeatherFull) => `${w.humidity}%`)}
              class="weather-detail-val"
            />
          </box>
          <box vertical spacing={1} halign={Gtk.Align.CENTER}>
            <label label="Vento" class="weather-detail-key" />
            <label
              label={weather.as((w: WeatherFull) => `${w.wind} km/h`)}
              class="weather-detail-val"
            />
          </box>
        </box>

        <box class="panel-separator" />

        {/* Daily forecast */}
        {dailyBox}
      </box>
    </window>
  )
}
