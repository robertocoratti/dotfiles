{
  pkgs,
  lib,
  config,
  ...
}: let
  cfg = config.modules.lock;
in {
  options.modules.lock = {
    enable = lib.mkEnableOption "enable screen lock (hyprlock + hypridle)";
    idleTimeout = lib.mkOption {
      type = lib.types.int;
      default = 600;
      description = "seconds of inactivity before locking";
    };
  };

  config = lib.mkIf cfg.enable {
    programs.hyprlock = {
      enable = true;
      settings = {
        general = {
          disable_loading_bar = false;
          hide_cursor = true;
          grace = 0;
        };
      };
    };

    services.hypridle = {
      enable = true;
      settings = {
        general = {
          lock_cmd = "pidof hyprlock || hyprlock";
          before_sleep_cmd = "loginctl lock-session";
          after_sleep_cmd = "hyprctl dispatch dpms on";
          ignore_dbus_inhibit = false;
        };

        listener = [
          {
            timeout = cfg.idleTimeout;
            on-timeout = "loginctl lock-session";
          }
          {
            timeout = cfg.idleTimeout + 300;
            on-timeout = "hyprctl dispatch dpms off";
            on-resume = "hyprctl dispatch dpms on";
          }
        ];
      };
    };
  };
}
