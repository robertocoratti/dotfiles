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

    scheme = lib.mkOption {
      type = lib.types.nullOr lib.types.str;
      default = "nord";
      description = "Base16 scheme name from pkgs.base16-schemes (lowercase, without .yaml). Mutually exclusive with 'colors'.";
    };

    colors = lib.mkOption {
      type = lib.types.nullOr (lib.types.submodule {
        options = lib.genAttrs
          ["base00" "base01" "base02" "base03" "base04" "base05" "base06" "base07"
           "base08" "base09" "base0A" "base0B" "base0C" "base0D" "base0E" "base0F"]
          (_key: lib.mkOption { type = lib.types.str; });
      });
      default = null;
      description = "All 16 base16 colors as 6-digit hex strings (without #). Mutually exclusive with 'scheme'.";
    };
  };

  config = lib.mkIf cfg.enable {
    assertions =
      [{
        assertion = (cfg.scheme != null) != (cfg.colors != null);
        message = "modules.stylix: set exactly one of 'scheme' or 'colors' (they are mutually exclusive)";
      }]
      ++ lib.optionals (cfg.scheme != null) (
        let
          availableSchemes = lib.pipe
            (builtins.readDir "${pkgs.base16-schemes}/share/themes")
            [lib.attrNames (map (lib.removeSuffix ".yaml"))];
        in [{
          assertion = builtins.elem cfg.scheme availableSchemes;
          message = "modules.stylix.scheme: '${cfg.scheme}' not found in pkgs.base16-schemes. Available: ${lib.concatStringsSep ", " (lib.sort lib.lessThan availableSchemes)}";
        }]
      );

    stylix = {
      enable = true;

      polarity = "dark";

      image = pkgs.fetchurl {
        url = "https://w.wallhaven.cc/full/og/wallhaven-oglrv9.jpg";
        hash = "sha256-GXyBfPHxJWn/e3kVKkgRHXigRd4m3yCBV06COv61l9Q=";
      };

      base16Scheme =
        if cfg.colors != null
        then (cfg.colors // {scheme = "custom"; author = "custom";})
        else "${pkgs.base16-schemes}/share/themes/${cfg.scheme}.yaml";

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
