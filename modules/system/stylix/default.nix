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
        url = "https://upload.wikimedia.org/wikipedia/commons/2/22/New_York_City_at_night_HDR.jpg";
        hash = "sha256-J2Y007Y1zD4is6CWaD9MMeyy2YLrTNnawcP6yC8lk+U=";
      };

      base16Scheme = "${pkgs.base16-schemes}/share/themes/nord.yaml";

      opacity = {
        applications = 1.0;
        terminal = 0.75;
        desktop = 0.75;
        popups = 0.5;
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
      };
    };

    nixpkgs.config.allowUnfreePredicate = pkg:
      builtins.elem (lib.getName pkg) [
        "joypixels"
      ];
    nixpkgs.config.joypixels.acceptLicense = true;
  };
}
