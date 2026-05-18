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
  // All widgets created upfront, updated by applyWeather()
  const bigIcon = new Gtk.Image()
  bigIcon.set_pixel_size(72)
  bigIcon.set_from_icon_name(empty.icon, Gtk.IconSize.DIALOG)
  bigIcon.show()

  const tempLabel = new Gtk.Label({ label: "0°C" })
  tempLabel.get_style_context().add_class("weather-temp-big")
  tempLabel.set_halign(Gtk.Align.START)
  tempLabel.show()

  const feelsLabel = new Gtk.Label({ label: "Percepita 0°C" })
  feelsLabel.get_style_context().add_class("weather-feels")
  feelsLabel.set_halign(Gtk.Align.START)
  feelsLabel.show()

  const humidityLabel = new Gtk.Label({ label: "0%" })
  humidityLabel.get_style_context().add_class("weather-detail-val")
  humidityLabel.show()

  const windLabel = new Gtk.Label({ label: "0 km/h" })
  windLabel.get_style_context().add_class("weather-detail-val")
  windLabel.show()

  // Daily forecast rows (6 rows with placeholder content)
  const dailyRows: any[] = []
  const dailyBox = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 2 })

  for (let i = 0; i < 6; i++) {
    const row = new Gtk.Box({ spacing: 8 })
    row.get_style_context().add_class("weather-day")

    const nameLabel = new Gtk.Label({ label: "---" })
    nameLabel.get_style_context().add_class("weather-day-name")
    nameLabel.set_halign(Gtk.Align.START)
    nameLabel.set_hexpand(true)

    const icon = new Gtk.Image()
    icon.set_from_icon_name("weather-clear-symbolic", Gtk.IconSize.DIALOG)
    icon.set_pixel_size(18)
    icon.set_valign(Gtk.Align.CENTER)

    const temps = new Gtk.Label({ label: "--° / --°" })
    temps.get_style_context().add_class("weather-day-temps")
    temps.set_halign(Gtk.Align.END)

    const precip = new Gtk.Label({ label: "--%" })
    precip.get_style_context().add_class("weather-day-precip")

    row.add(nameLabel)
    row.add(icon)
    row.add(temps)
    row.add(precip)
    row.show_all()
    dailyBox.add(row)
    dailyRows.push({ nameLabel, icon, temps, precip })
  }
  dailyBox.show()

  // Updates all widgets with fetched weather data
  function applyWeather(w: WeatherFull) {
    bigIcon.set_from_icon_name(w.icon, Gtk.IconSize.DIALOG)
    tempLabel.set_label(`${w.temp}°C`)
    feelsLabel.set_label(`Percepita ${w.feelsLike}°C`)
    humidityLabel.set_label(`${w.humidity}%`)
    windLabel.set_label(`${w.wind} km/h`)

    for (let i = 0; i < 6; i++) {
      const day = w.daily[i]
      const widgets = dailyRows[i]
      if (day) {
        widgets.nameLabel.set_label(day.name)
        widgets.icon.set_from_icon_name(day.icon, Gtk.IconSize.DIALOG)
        widgets.temps.set_label(`${day.max}° / ${day.min}°`)
        widgets.precip.set_label(`${day.precip}%`)
      } else {
        widgets.nameLabel.set_label("---")
        widgets.temps.set_label("--° / --°")
        widgets.precip.set_label("--%")
      }
    }
  }

  // Fetch weather now, then every 10 minutes
  async function tick() {
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
      applyWeather({
        icon: weatherIconName(c.weather_code),
        temp: Math.round(c.temperature_2m),
        feelsLike: Math.round(c.apparent_temperature),
        humidity: Math.round(c.relative_humidity_2m),
        wind: Math.round(c.wind_speed_10m),
        daily,
      })
    } catch {
      // keep previous data on error
    }
  }

  tick() // fetch immediately

  // Poll trigger every 10 minutes (createPoll callback fires at interval, we fetch inside)
  createPoll(0, 600_000, () => { tick(); return 0 })

  // Build layout
  const detailsBox = new Gtk.Box({ spacing: 24 })
  detailsBox.get_style_context().add_class("weather-details")

  const humBox = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 1 })
  humBox.set_halign(Gtk.Align.CENTER)
  const humKey = new Gtk.Label({ label: "Umidità" })
  humKey.get_style_context().add_class("weather-detail-key")
  humBox.add(humKey)
  humBox.add(humidityLabel)
  humBox.show_all()

  const windBox = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 1 })
  windBox.set_halign(Gtk.Align.CENTER)
  const windKey = new Gtk.Label({ label: "Vento" })
  windKey.get_style_context().add_class("weather-detail-key")
  windBox.add(windKey)
  windBox.add(windLabel)
  windBox.show_all()

  detailsBox.add(humBox)
  detailsBox.add(windBox)
  detailsBox.show()

  const sep = new Gtk.Box({})
  sep.get_style_context().add_class("panel-separator")
  sep.show()

  const outerBox = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 4 })
  outerBox.get_style_context().add_class("panel-box")
  outerBox.get_style_context().add_class("weather-panel")

  const topRow = new Gtk.Box({ spacing: 16 })
  topRow.set_valign(Gtk.Align.CENTER)
  topRow.add(bigIcon)
  const tempsBox = new Gtk.Box({ orientation: Gtk.Orientation.VERTICAL, spacing: 4 })
  tempsBox.set_valign(Gtk.Align.CENTER)
  tempsBox.add(tempLabel)
  tempsBox.add(feelsLabel)
  topRow.add(tempsBox)
  topRow.show_all()

  outerBox.add(topRow)
  outerBox.add(detailsBox)
  outerBox.add(sep)
  outerBox.add(dailyBox)
  outerBox.show()

  const wrapper = new Gtk.Box({})
  wrapper.add(outerBox)
  wrapper.show()

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
      {wrapper}
    </window>
  )
}
