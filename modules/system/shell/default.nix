{
  pkgs,
  lib,
  config,
  ...
}: let
  cfg = config.modules.shell;
in {
  options.modules.shell = {
    enable = lib.mkEnableOption "enable shell";
    fish.enable = lib.mkEnableOption "enable fish as default shell";
  };

  config = lib.mkIf cfg.enable {
    programs.fish.enable = lib.mkIf cfg.fish.enable true;

    users.defaultUserShell =
      if cfg.fish.enable
      then pkgs.fish
      else null;
  };
}
