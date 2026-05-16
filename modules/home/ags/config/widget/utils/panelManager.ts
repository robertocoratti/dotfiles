import app from "ags/gtk3/app"
import { Astal } from "ags/gtk3"

let activePanelName: string | null = null

function findWindow(name: string): any {
  return (app as any).windows.find((w: any) => w.name === name)
}

function setCatchers(visible: boolean) {
  ;(app as any).windows
    .filter((w: any) => typeof w.name === "string" && w.name.startsWith("ClickCatcher"))
    .forEach((w: any) => { w.visible = visible })
}

function positionUnderButton(panel: any, button: any) {
  if (!button) return
  const barWin = button.get_toplevel()
  const barWidth: number = barWin.get_allocated_width()
  const coords: [boolean, number, number] = button.translate_coordinates(barWin, 0, 0)
  const bx = coords[1]
  const bAlloc = button.get_allocation()
  // Align panel's right edge with button's right edge
  // barMarginLeft=6, screenWidth = barWidth + 12
  // buttonRight = 6 + bx + bAlloc.width
  // marginRight = screenWidth - buttonRight = barWidth + 6 - bx - bAlloc.width
  const marginRight = Math.max(6, barWidth + 6 - bx - bAlloc.width)
  panel.anchor = Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT
  panel.marginRight = marginRight
  panel.marginTop = 44
}

export function togglePanel(name: string, button?: any) {
  const isCurrentlyOpen = activePanelName === name

  // Close any open panel and all catchers
  if (activePanelName) {
    const prev = findWindow(activePanelName)
    if (prev) prev.visible = false
    activePanelName = null
    setCatchers(false)
  }

  if (isCurrentlyOpen) return

  const panel = findWindow(name)
  if (!panel) return

  if (name !== "CalendarPanel") {
    positionUnderButton(panel, button)
  }

  setCatchers(true)
  panel.visible = true
  activePanelName = name
}

export function closeActivePanel() {
  if (activePanelName) {
    const prev = findWindow(activePanelName)
    if (prev) prev.visible = false
    activePanelName = null
  }
  setCatchers(false)
}
