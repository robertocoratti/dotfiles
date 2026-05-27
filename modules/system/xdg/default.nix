{
  lib,
  config,
  pkgs,
  ...
}: let
  cfg = config.modules.xdgPortal;
in {
  options.modules.xdgPortal = {
    enable = lib.mkEnableOption "enable XDG desktop portal";
    extraPortals = lib.mkOption {
      type = lib.types.listOf lib.types.package;
      default = [pkgs.xdg-desktop-portal-hyprland];
      description = "Extra portal implementations (e.g. WM-specific portals)";
    };
  };

  config = lib.mkIf cfg.enable {
    xdg.portal = {
      enable = true;
      extraPortals = [pkgs.xdg-desktop-portal-gtk] ++ cfg.extraPortals;
      config.common.default = "*";
    };
  };
}
