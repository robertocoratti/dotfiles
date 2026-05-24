{
  inputs,
  pkgs,
  lib,
  config,
  ...
}: let
  cfg = config.modules.kitty;
in {
  options.modules.kitty = {
    enable = lib.mkEnableOption "enable kitty terminal";
  };

  config = lib.mkIf cfg.enable {
    programs.kitty = {
      enable = true;
      settings = {
        confirm_os_window_close = 0;
        enable_audio_bell = false;

        window_margin_width = "0";
        window_padding_width = "4 4";
        window_border_width = "0";

        tab_bar_edge = "bottom";
        tab_bar_margin_width = "0.0";
        tab_bar_margin_height = "0.0 0.0";
        tab_bar_style = "powerline";
        tab_powerline_style = "slanted";
        tab_bar_min_tabs = 1;
        tab_title_template = "{title}{' :{}'.format(num_windows) if num_windows > 1 else ''}";
      };
    };
  };
}
