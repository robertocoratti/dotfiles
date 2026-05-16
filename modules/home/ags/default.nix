{
  inputs,
  pkgs,
  lib,
  config,
  ...
}: let
  cfg = config.modules.ags;
  c = config.lib.stylix.colors;

  colorsCSS = pkgs.writeTextFile {
    name = "colors.css";
    text = ''
      @define-color base00 #${c.base00};
      @define-color base01 #${c.base01};
      @define-color base02 #${c.base02};
      @define-color base03 #${c.base03};
      @define-color base04 #${c.base04};
      @define-color base05 #${c.base05};
      @define-color base06 #${c.base06};
      @define-color base07 #${c.base07};
      @define-color base08 #${c.base08};
      @define-color base09 #${c.base09};
      @define-color base0A #${c.base0A};
      @define-color base0B #${c.base0B};
      @define-color base0C #${c.base0C};
      @define-color base0D #${c.base0D};
      @define-color base0E #${c.base0E};
      @define-color base0F #${c.base0F};
    '';
  };

  configTS = pkgs.writeTextFile {
    name = "config.ts";
    text = ''
      export const showBattery: boolean = ${lib.boolToString cfg.battery};
    '';
  };

  # Merge static TS config dir with Nix-generated colors.css and config.ts
  configDir = pkgs.runCommand "ags-config" {} ''
    mkdir -p $out
    cp -r ${./config}/. $out/
    cp ${colorsCSS} $out/colors.css
    cp ${configTS} $out/config.ts
  '';
in {
  imports = [inputs.ags.homeManagerModules.default];

  options.modules.ags = {
    enable = lib.mkEnableOption "enable AGS shell";
    battery = lib.mkOption {
      type = lib.types.bool;
      default = false;
      description = "Show battery indicator in bar (enable on laptops)";
    };
  };

  config = lib.mkIf cfg.enable {
    gtk.iconTheme = {
      package = pkgs.papirus-icon-theme;
      name = "Papirus-Dark";
    };

    programs.ags = {
      enable = true;
      configDir = configDir;
      extraPackages = with pkgs.astal; [
        astal3
        io
        hyprland
        wireplumber
        network
        bluetooth
        tray
        notifd
        mpris
        battery
        pkgs.networkmanager
      ];
    };

    wayland.windowManager.hyprland.settings.exec-once =
      lib.mkAfter ["ags run"];
  };
}
