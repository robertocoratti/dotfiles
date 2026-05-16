import { createBinding } from "ags"
import { For } from "ags"
import Hyprland from "gi://AstalHyprland"

export default function Workspaces() {
  const hyprland = Hyprland.get_default()
  const workspaces = createBinding(hyprland, "workspaces").as((wss) =>
    (wss ?? []).filter((ws) => ws.id > 0).sort((a, b) => a.id - b.id)
  )
  const focused = createBinding(hyprland, "focusedWorkspace")

  return (
    <box class="workspaces">
      <For each={workspaces} id={(ws) => ws.id}>
        {(ws) => (
          <button
            class={focused.as((fw) => (fw?.id === ws.id ? "active" : ""))}
            onClicked={() => hyprland.dispatch("workspace", String(ws.id))}
          >
            {String(ws.id)}
          </button>
        )}
      </For>
    </box>
  )
}
