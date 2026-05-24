{
  pkgs,
  lib,
  config,
  ...
}: let
  cfg = config.modules.power;
in {
  options.modules.power.enable = lib.mkEnableOption "Enable power management (upower + power-profiles-daemon)";
  config = lib.mkIf cfg.enable {
    services.upower.enable = true;
    services.power-profiles-daemon.enable = true;
  };
}
