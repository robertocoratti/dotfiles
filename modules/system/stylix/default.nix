{
  inputs,
  pkgs,
  lib,
  config,
  ...
}: let
  cfg = config.modules.stylix;
in {
  options.modules.stylix = {
    enable = lib.mkEnableOption "enable stylix";
  };

  config = lib.mkIf cfg.enable {
    stylix = {
      enable = true;

      polarity = "dark";

      image = pkgs.fetchurl {
        url = "https://w.wallhaven.cc/full/og/wallhaven-oglrv9.jpg";
        hash = "sha256-GXyBfPHxJWn/e3kVKkgRHXigRd4m3yCBV06COv61l9Q=";
      };

      base16Scheme = "${pkgs.base16-schemes}/share/themes/nord.yaml";

      override = {
        base02 = "5c6e82";
      };

      opacity = {
        applications = 1.0;
        terminal = 0.75;
        desktop = 0.75;
        popups = 0.35;
      };

      fonts = {
        serif = {
          package = pkgs.dejavu_fonts;
          name = "DejaVu Serif";
        };

        sansSerif = {
          package = pkgs.dejavu_fonts;
          name = "DejaVu Sans";
        };

        monospace = {
          package = pkgs.nerd-fonts.monaspace;
          name = "MonaspiceNe Nerd Font Mono";
        };

        emoji = {
          package = pkgs.joypixels;
          name = "JoyPixels";
        };
      };

      cursor = {
        package = pkgs.bibata-cursors;
        name = "Bibata-Modern-Classic";
        size = 24;
      };

      targets = {
        plymouth.enable = false;
        qt.enable = true;
      };
    };

    nixpkgs.config.allowUnfreePredicate = pkg:
      builtins.elem (lib.getName pkg) [
        "joypixels"
      ];
    nixpkgs.config.joypixels.acceptLicense = true;
  };
}
