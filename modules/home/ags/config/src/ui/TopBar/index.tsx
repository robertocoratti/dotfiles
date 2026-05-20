import { Astal, Gtk, Gdk } from "ags/gtk4";
import { activePanel, closeActivePanel } from "../../lib/state";
import { showBattery } from "../../../config";
import CenterBox from "../../components/CenterBox";
import Box from "../../components/Box";
import Modal from "../../components/Modal";
import Workspaces from "./Workspaces";
import Clock from "./Clock";
import Weather from "./Weather";
import Indicators from "./Indicators";
import SysTray from "./SysTray";
import Notifications from "./Notifications";
import BatteryWidget from "./Battery";
import PowerButton from "./PowerButton";
import QuickSettings from "../Panels/QuickSettings";
import CalendarPanel from "../Panels/Calendar";
import WeatherPanel from "../Panels/Weather";
import NotificationsPanel from "../Panels/Notifications";
import PowerMenu from "../Panels/PowerMenu";

interface TopBarProps {
  monitor: Gdk.Monitor;
  index: number;
}

export default function TopBar({ monitor, index }: TopBarProps) {
  const panel = activePanel();

  return (
    <box>
      {/* Bar */}
      <window
        gdkmonitor={monitor}
        name={`bar-${index}`}
        layer={Astal.Layer.TOP}
        anchor={
          Astal.WindowAnchor.TOP |
          Astal.WindowAnchor.LEFT |
          Astal.WindowAnchor.RIGHT
        }
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        visible={true}
        heightRequest={42}
        cssClasses={["bar-bg"]}
        onKeyPressed={(self: Gtk.Widget, keyval: number) => {
          if (keyval === Gdk.KEY_Escape) {
            closeActivePanel();
          }
        }}
      >
        <CenterBox
          class="bar-inner"
          startWidget={
            <Box class="bar-item">
              <Workspaces monitor={monitor} />
            </Box>
          }
          centerWidget={
            <Box class="bar-item" gap={8}>
              <Clock />
              <Weather />
            </Box>
          }
          endWidget={
            <Box class="bar-item" gap={4}>
              <Indicators />
              <SysTray />
              {showBattery ? <BatteryWidget /> : null}
              <Notifications />
              <PowerButton />
            </Box>
          }
        />
      </window>

      {/* Click Catcher */}
      <window
        gdkmonitor={monitor}
        name={`clickcatcher-${index}`}
        layer={Astal.Layer.BOTTOM}
        anchor={
          Astal.WindowAnchor.TOP |
          Astal.WindowAnchor.RIGHT |
          Astal.WindowAnchor.BOTTOM |
          Astal.WindowAnchor.LEFT
        }
        exclusivity={Astal.Exclusivity.IGNORE}
        keymode={panel ? Astal.Keymode.EXCLUSIVE : Astal.Keymode.NONE}
        visible={panel !== null}
        cssClasses={["click-catcher"]}
        onKeyPressed={(self: Gtk.Widget, keyval: number) => {
          if (keyval === Gdk.KEY_Escape) {
            closeActivePanel();
          }
        }}
      >
        <box
          onClicked={() => closeActivePanel()}
          cssClasses={["click-catcher"]}
          expand
        >
          <box />
        </box>
      </window>

      {/* Panels */}
      <Modal
        open={panel === "quicksettings"}
        onClose={closeActivePanel}
        monitor={monitor}
        name={`quicksettings-${index}`}
        halign={Gtk.Align.END}
        valign={Gtk.Align.START}
      >
        <QuickSettings />
      </Modal>

      <Modal
        open={panel === "calendar"}
        onClose={closeActivePanel}
        monitor={monitor}
        name={`calendar-${index}`}
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
      >
        <CalendarPanel />
      </Modal>

      <Modal
        open={panel === "weather"}
        onClose={closeActivePanel}
        monitor={monitor}
        name={`weather-${index}`}
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
      >
        <WeatherPanel />
      </Modal>

      <Modal
        open={panel === "notifications"}
        onClose={closeActivePanel}
        monitor={monitor}
        name={`notifications-${index}`}
        halign={Gtk.Align.END}
        valign={Gtk.Align.START}
      >
        <NotificationsPanel />
      </Modal>

      <Modal
        open={panel === "power"}
        onClose={closeActivePanel}
        monitor={monitor}
        name={`power-${index}`}
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
      >
        <PowerMenu />
      </Modal>
    </box>
  );
}
