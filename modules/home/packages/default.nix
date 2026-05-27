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
      bitwarden-desktop
      vesktop
      obsidian
      spotify
      libreoffice-fresh
      nautilus

      # media
      ani-cli

      # system
      eza
      fastfetch
      ripgrep
      fd
      jq
      tree
      wl-clipboard
      cliphist
      comma

      # media
      imv
    ];

    xdg.desktopEntries.whatsapp = {
      name = "WhatsApp";
      genericName = "Messaggistica";
      exec = "brave --app=https://web.whatsapp.com";
      icon = builtins.fetchurl {
        url = "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg";
        sha256 = "1ji8zfld02an3mxxnjafhxpjx8ah5ygkd1xhiam13jllqfr4ssnx";
      };
      categories = ["Network" "InstantMessaging"];
      terminal = false;
      startupNotify = false;
    };

    programs = {
      btop.enable = true;

      mpv = {
        enable = true;
        config = {
          # Moderno backend GPU (migliore per HDR e qualità video)
          vo = "gpu-next";
          gpu-api = "vulkan";
          # Hardware decoding (AMD RX 6950 XT via VAAPI)
          hwdec = "vaapi";
          hwdec-codecs = "all";
          # HDR: passa i metadati al compositor Wayland
          target-colorspace-hint-mode = "source";
          # Qualità streaming: il migliore disponibile
          ytdl-format = "bestvideo+bestaudio/best";
          # Sottotitoli: preferisce italiano, fallback inglese
          sub-auto = "fuzzy";
          slang = "it,en";
          # Cache per lo streaming (riduce buffering)
          cache = true;
          cache-secs = 60;
          # Velocità di riproduzione default
          speed = "1.8";
          # Ridimensionamento alta qualità
          scale = "ewa_lanczos";
          cscale = "ewa_lanczos";
        };
      };

      yt-dlp = {
        enable = true;
        settings = {
          # Legge i cookie di sessione da Brave (per Crunchyroll premium)
          cookies-from-browser = "brave";
          # Formato video: migliore qualità con fallback
          format = "bestvideo+bestaudio/best";
          # Sottotitoli: incorpora e preferisce italiano
          embed-subs = true;
          sub-langs = "it.*,en.*";
          write-subs = true;
          write-auto-subs = false;
        };
      };
    };
  };
}
