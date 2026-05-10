{
  lib,
  config,
  ...
}: let
  cfg = config.modules.hyprpanel;
in {
  options.modules.hyprpanel = {
    enable = lib.mkEnableOption "Enable hyprpanel";
    # options
  };

  config = lib.mkIf cfg.enable {
    programs.hyprpanel = {
      enable = true;
      systemd.enable = true;

      settings = {
        bar = {
          launcher.icon = "";

          layouts = {
            "*" = {
              "left" = [
                "dashboard"
                "workspaces"
                "windowtitle"
              ];
              "middle" = [
                "clock"
                "weather"
              ];
              "right" = [
                "microphone"
                "volume"
                "cpu"
                "cputemp"
                "ram"
                "network"
                "bluetooth"
                "systray"
                "notifications"
                "power"
              ];
            };
          };

          clock = {
            format = "%d/%m/%y %H:%M";
          };
        };

        menus = {
          clock = {
            time = {
              military = true;
              hideSeconds = true;
            };

            weather = {
              unit = "metric";
              location = "41.863978, 12.669580";
              key = "/var/lib/sopsjson/secrets.json";
              refreshInterval = 600;
            };
          };
        };

        theme = {
          font = {
            name = "MonaspiceNe Nerd Font Mono";
            size = "14px";
            weight = 600;
          };

          bar = {
            floating = true;
            enableShadow = false;
            border_radius = "16px";
            outer_spacing = "4px";
            buttons.y_margins = "4px";
            buttons.spacing = "4px";
            buttons.padding_x = "0.75rem";
            buttons.padding_y = "0.15rem";
            buttons.radius = "8px";
            margin_top = "8px";
            dropdownGap = "3rem";
            margin_bottom = "0";
            margin_sides = "8px";
            menus.opacity = 100;
            transparent = true;
          };
        };
      };
    };
  };
}
