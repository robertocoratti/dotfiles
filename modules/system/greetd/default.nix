{
  hostInfo,
  pkgs,
  lib,
  config,
  ...
}: let
  cfg = config.modules.greetd;
in {
  options.modules.greetd = {
    enable = lib.mkEnableOption "Enable greetd";
    session = {
      user = lib.mkOption {
        type = lib.types.str;
        default = hostInfo.user;
      };
      command = lib.mkOption {
        type = lib.types.str;
        default = "${pkgs.tuigreet}/bin/tuigreet --time --cmd ${pkgs.hyprland}/bin/start-hyprland";
      };
    };
  };

  config = lib.mkIf cfg.enable {
    services.greetd = {
      enable = true;
      settings = {
        default_session = {
          command = cfg.session.command;
          user = cfg.session.user;
        };
      };
    };
  };
}
