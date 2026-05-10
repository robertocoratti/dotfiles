{
  pkgs,
  lib,
  config,
  ...
}: let
  cfg = config.modules.packages;
in {
  options.modules.packages = {
    enable = lib.mkEnableOption "enable packages";
  };

  config = lib.mkIf cfg.enable {
    home.packages = with pkgs; [
      # apps
      brave
      chromium
      vesktop
      obsidian
      spotify
      onlyoffice-desktopeditors
      nautilus

      # media
      mpv
      yt-dlp
      ani-cli

      # study
      anki

      # pdf
      zathura

      # system
      eza
      fastfetch
      ripgrep
      fd
      jq
      tree
      wl-clipboard
      cliphist
    ];

    programs = {
      btop.enable = true;
    };
  };
}
