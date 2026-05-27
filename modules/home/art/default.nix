{
  pkgs,
  lib,
  config,
  ...
}: let
  cfg = config.modules.art;
in {
  options.modules.art = {
    enable = lib.mkEnableOption "artistic tools (Aseprite, GIMP, Blender)";
  };

  config = lib.mkIf cfg.enable {
    home.packages = with pkgs; [
      aseprite
      gimp
      blender
      inkscape
    ];
  };
}
