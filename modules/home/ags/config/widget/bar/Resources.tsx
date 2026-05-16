import { createPoll } from "ags/time"
import { exec } from "ags/process"
import { Gtk } from "ags/gtk3"

let prevIdle = 0
let prevTotal = 0

export default function Resources() {
  const cpu = createPoll(0, 2000, () => {
    try {
      const line = exec("head -1 /proc/stat")
      const parts = line.split(/\s+/).filter(Boolean).slice(1).map(Number)
      const idle = parts[3]
      const total = parts.reduce((a: number, b: number) => a + b, 0)
      const usage =
        prevTotal > 0
          ? Math.round(
              ((total - prevTotal - (idle - prevIdle)) / (total - prevTotal)) * 100
            )
          : 0
      prevIdle = idle
      prevTotal = total
      return Math.max(0, Math.min(100, usage))
    } catch {
      return 0
    }
  })

  const ram = createPoll(0, 4000, () => {
    try {
      const lines = exec("cat /proc/meminfo").split("\n")
      const total = parseInt(lines[0].split(/\s+/)[1])
      const avail = parseInt(lines[2].split(/\s+/)[1])
      return Math.round(((total - avail) / total) * 100)
    } catch {
      return 0
    }
  })

  return (
    <box class="module resources" spacing={4} valign={Gtk.Align.CENTER}>
      <label label="CPU" class="resources-key" valign={Gtk.Align.CENTER} />
      <label label={cpu.as((v: number) => `${v}%`)} valign={Gtk.Align.CENTER} />
      <label label="·" class="resources-sep" valign={Gtk.Align.CENTER} />
      <label label="RAM" class="resources-key" valign={Gtk.Align.CENTER} />
      <label label={ram.as((v: number) => `${v}%`)} valign={Gtk.Align.CENTER} />
    </box>
  )
}
