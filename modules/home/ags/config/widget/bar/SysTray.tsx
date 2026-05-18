import { createBinding } from "ags"
import { For } from "ags"
import Tray from "gi://AstalTray"

export default function SysTray() {
  const tray = Tray.get_default()

  return (
    <box>
      <For each={createBinding(tray, "items")}>
        {(item: any) => (
          <menubutton
            class="bar-tray-item"
            tooltipMarkup={createBinding(item, "tooltipMarkup")}
            usePopover={false}
            menuModel={createBinding(item, "menuModel")}
          >
            <icon
              icon={createBinding(item, "iconName").as(
                (n: string | null) => n || "image-missing"
              )}
              pixelSize={18}
            />
          </menubutton>
        )}
      </For>
    </box>
  )
}
