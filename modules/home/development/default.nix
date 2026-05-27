{
  pkgs,
  lib,
  config,
  ...
}: let
  cfg = config.modules.development;
in {
  options.modules.development = {
    enable = lib.mkEnableOption "development tools";
    gameDev = {
      enable = lib.mkEnableOption "game development tools (Godot, etc.)";
    };
  };

  config = lib.mkIf cfg.enable {
    home.packages = with pkgs;
      [
        lazygit
        pnpm
        httpie
        just
      ]
      ++ (lib.optionals cfg.gameDev.enable (with pkgs; [
        godot_4
      ]));

    programs.gh = {
      enable = true;
      settings.git_protocol = "ssh";
    };
  };
}
