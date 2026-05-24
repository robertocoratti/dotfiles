{
  inputs,
  pkgs,
  hostInfo,
  lib,
  config,
  ...
}: let
  cfg = config.modules.nh;
in {
  options.modules.nh = {
    enable = lib.mkEnableOption "Enable nh";
  };

  config = lib.mkIf cfg.enable {
    programs.nh = {
      enable = true;

      flake = "/home/${hostInfo.user}/.dotfiles";

      clean = {
        enable = true;
        extraArgs = "--keep-since 7d --keep 10";
      };
    };
  };
}
