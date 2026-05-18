import app from "ags/gtk3/app"
import { Astal } from "ags/gtk3"
import Hyprland from "gi://AstalHyprland"
import GLib from "gi://GLib?version=2.0"
import Gdk from "gi://Gdk?version=3.0"
import Gtk from "gi://Gtk?version=3.0"

let activePanelName: string | null = null
let focusHandlerId: number | null = null
let focusTimeoutId: number | null = null

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
  const marginRight = Math.max(6, barWidth + 6 - bx - bAlloc.width)
  panel.anchor = Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT
  panel.marginRight = marginRight
  panel.marginTop = 44
}

function setupFocusListener() {
  if (focusHandlerId !== null) return
  const hyprland = Hyprland.get_default()
  if (!hyprland) return
  focusHandlerId = hyprland.connect("notify::focused-client", () => {
    if (!activePanelName) return
    if (focusTimeoutId !== null) GLib.source_remove(focusTimeoutId)
    focusTimeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 300, () => {
      if (activePanelName) closeActivePanel()
      focusTimeoutId = null
      return GLib.SOURCE_REMOVE
    })
  })
}

// Register Escape key handler globally on the bar window
let escapeHandlerRegistered = false
export function registerEscapeHandler() {
  if (escapeHandlerRegistered) return
  escapeHandlerRegistered = true

  // Listen on the bar window — Escape closes the active panel
  GLib.idle_add(GLib.PRIORITY_DEFAULT, () => {
    const barWin = findWindow("Bar")
    if (barWin) {
      const controller = new Gtk.EventControllerKey({ widget: barWin })
      controller.connect("key-pressed", (_ctrl: any, keyval: number) => {
        if (keyval === Gdk.KEY_Escape && activePanelName) {
          closeActivePanel()
          return true
        }
        return false
      })
      ;(barWin as any).__escapeController = controller
    }
    return GLib.SOURCE_REMOVE
  })
}

export function togglePanel(name: string, button?: any) {
  const isCurrentlyOpen = activePanelName === name

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

  setupFocusListener()
  setCatchers(true)
  panel.visible = true
  activePanelName = name
}

export function closeActivePanel() {
  if (focusTimeoutId !== null) {
    GLib.source_remove(focusTimeoutId)
    focusTimeoutId = null
  }
  if (activePanelName) {
    const prev = findWindow(activePanelName)
    if (prev) prev.visible = false
    activePanelName = null
  }
  setCatchers(false)
}
