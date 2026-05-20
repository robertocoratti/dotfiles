import Gdk from "gi://Gdk?version=4.0";

export default function ForMonitors(
  fn: (monitor: Gdk.Monitor, index: number) => void,
) {
  const display = Gdk.Display.get_default();
  if (!display) return;

  const monitors = display.get_monitors();
  let i = 0;
  for (const monitor of monitors) {
    fn(monitor as Gdk.Monitor, i);
    i++;
  }
}
