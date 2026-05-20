import { createState } from "ags";

export const [activePanel, setActivePanel] = createState<string | null>(null);

export function togglePanel(name: string) {
  setActivePanel(activePanel() === name ? null : name);
}

export function closeActivePanel() {
  setActivePanel(null);
}
