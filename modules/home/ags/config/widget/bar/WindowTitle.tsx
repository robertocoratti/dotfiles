import { createPoll } from "ags/time"
import Hyprland from "gi://AstalHyprland"

export default function WindowTitle() {
  const hyprland = Hyprland.get_default()

  const title = createPoll("", 250, () => {
    const t = hyprland.focusedClient?.title ?? ""
    return t.length > 50 ? t.slice(0, 50) + "…" : t
  })

  return (
    <label
      class="bar-window-title"
      label={title}
      visible={title.as((t) => t.length > 0)}
    />
  )
}
