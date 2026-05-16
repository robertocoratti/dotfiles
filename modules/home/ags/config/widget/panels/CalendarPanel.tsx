import { Astal, Gtk } from "ags/gtk3"
import { createPoll } from "ags/time"
import GLib from "gi://GLib?version=2.0"

const DAY_NAMES = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"]

function buildCalendarGrid(): any[] {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const today = now.getDate()

  const firstDay = new Date(year, month, 1).getDay()
  const startOffset = firstDay === 0 ? 6 : firstDay - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevMonthDays = new Date(year, month, 0).getDate()

  const cells: { label: string; today: boolean; dim: boolean }[] = []

  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({ label: `${prevMonthDays - i}`, today: false, dim: true })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ label: `${d}`, today: d === today, dim: false })
  }
  const remaining = (7 - (cells.length % 7)) % 7
  for (let d = 1; d <= remaining; d++) {
    cells.push({ label: `${d}`, today: false, dim: true })
  }

  const rows: any[] = []
  for (let r = 0; r < cells.length / 7; r++) {
    const week = cells.slice(r * 7, (r + 1) * 7)
    rows.push(
      <box spacing={2}>
        {week.map((c) => (
          <button
            class={c.today ? "cal-day today" : c.dim ? "cal-day dim" : "cal-day"}
            hexpand
          >
            <label label={c.label} />
          </button>
        ))}
      </box>
    )
  }
  return rows
}

export function CalendarPanelWindow() {
  const time = createPoll("", 1000, () =>
    GLib.DateTime.new_now_local().format("%H:%M:%S")!
  )

  const date = createPoll("", 60000, () =>
    GLib.DateTime.new_now_local().format("%A, %d %B %Y")!
  )

  const monthLabel = GLib.DateTime.new_now_local().format("%B %Y")!

  return (
    <window
      name="CalendarPanel"
      namespace="panel"
      anchor={Astal.WindowAnchor.TOP}
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.IGNORE}
      visible={false}
      marginTop={44}
    >
      <box class="panel-box calendar-panel" vertical spacing={6}>
        <label label={time} class="panel-clock-large" />
        <label label={date} class="panel-date" />
        <box class="panel-separator" />
        <label label={monthLabel} class="cal-month-label" halign={Gtk.Align.CENTER} />
        <box spacing={2}>
          {DAY_NAMES.map(d => (
            <label label={d} class="cal-header" hexpand halign={Gtk.Align.CENTER} />
          ))}
        </box>
        <box vertical spacing={2}>
          {buildCalendarGrid()}
        </box>
      </box>
    </window>
  )
}
