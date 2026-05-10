{
  pkgs,
  lib,
  config,
  ...
}: let
  cfg = config.modules.screenshot;
in {
  options.modules.screenshot = {
    enable = lib.mkEnableOption "enable screenshot tools";
  };

  config = lib.mkIf cfg.enable {
    home.packages = with pkgs; [
      grim
      slurp
      grimblast
    ];
  };
}
