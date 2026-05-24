{
  inputs,
  pkgs,
  lib,
  config,
  osConfig,
  ...
}: let
  cfg = config.modules.noctalia;
  isLaptop = cfg.battery;
  stylixWallpaper = osConfig.stylix.image or null;

  rightWidgets =
    [
      {type = "SystemMonitor";}
      {type = "Tray";}
      {type = "Volume";}
      {type = "Network";}
      {type = "Bluetooth";}
    ]
    ++ lib.optionals isLaptop [
      {type = "Brightness";}
      {type = "Battery";}
    ]
    ++ [
      {type = "NotificationHistory";}
      {type = "ControlCenter";}
    ];

  wallpaperSettings = lib.mkIf (stylixWallpaper != null) {
    defaultWallpaper = stylixWallpaper;
  };
in {
  imports = [inputs.noctalia.homeModules.default];

  options.modules.noctalia = {
    enable = lib.mkEnableOption "enable Noctalia Shell";
    battery = lib.mkOption {
      type = lib.types.bool;
      default = false;
      description = "Show battery and brightness widgets (enable on laptops)";
    };
  };

  config = lib.mkIf cfg.enable {
    programs.noctalia-shell = {
      enable = true;
      settings = {
        colorSchemes = {
          predefinedScheme = "Nord";
          darkMode = true;
        };

        bar = lib.mkForce {
          position = "top";
          backgroundOpacity = 0.75;
          frameRadius = 0;
          marginVertical = 0;
          marginHorizontal = 0;
          showCapsule = false;
          widgetSpacing = 8;

          widgets.left = [
            {type = "Launcher";}
            {type = "Clock";}
            {type = "ActiveWindow";}
          ];
          widgets.center = [
            {
              type = "Workspace";
              showIndexLabels = true;
              showOccupiedOnly = true;
              enableScroll = true;
            }
          ];
          widgets.right = rightWidgets;
        };

        dock = lib.mkForce {
          enabled = true;
          position = "bottom";
          displayMode = "auto_hide";
          backgroundOpacity = 0.75;
          size = 0.75;
          pinnedApps = ["firefox" "code" "kitty" "spotify" "obsidian"];
        };

        general = lib.mkForce {
          enableBlurBehind = true;
          enableShadows = true;
        };

        wallpaper =
          {
            enabled = true;
            directory = "/media/korazza/ssd/immagini/wallpapers/";
          }
          // wallpaperSettings;

        location = {
          weatherEnabled = true;
          autoLocate = true;
        };

        appLauncher = {
          position = "center";
        };

        notifications = {
          location = "top_right";
        };

        controlCenter = {
          cards = [
            {
              id = "audio-card";
              enabled = true;
            }
            {
              id = "network-card";
              enabled = true;
            }
            {
              id = "bluetooth-card";
              enabled = true;
            }
            {
              id = "weather-card";
              enabled = true;
            }
          ];
        };

        sessionMenu = {
          enableCountdown = false;
        };
      };
    };
  };
}
