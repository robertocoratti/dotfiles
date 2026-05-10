{
  inputs,
  user,
  pkgs,
  lib,
  config,
  ...
}: let
  cfg = config.modules.greetd;

  startHyprland = pkgs.writeShellScriptBin "start-hyprland" ''
    export LIBVA_DRIVER_NAME=radeonsi
    export VDPAU_DRIVER=radeonsi
    exec Hyprland "$@"
  '';
in {
  options.modules.greetd = {
    enable = lib.mkEnableOption "Enable greetd";
  };

  config = lib.mkIf cfg.enable {
    environment.systemPackages = [startHyprland];

    services.greetd = {
      enable = true;
      settings = {
        default_session = {
          command = "${pkgs.tuigreet}/bin/tuigreet --time --cmd ${startHyprland}/bin/start-hyprland";
          user = "${user}";
        };
      };
    };
  };
}
