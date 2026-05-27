{
  pkgs,
  lib,
  config,
  ...
}: let
  cfg = config.modules.neovim;
in {
  options.modules.neovim = {
    enable = lib.mkEnableOption "neovim with lazy.nvim";
  };

  config = lib.mkIf cfg.enable {
    programs.neovim = {
      enable = true;
      defaultEditor = true;
      viAlias = true;
      vimAlias = true;
      withRuby = false;
      withPython3 = false;
      extraPackages = with pkgs; [
        ripgrep
        fd
        gcc
        tree-sitter
      ];
    };

    xdg.configFile."nvim" = {
      source = ./config;
      recursive = true;
    };
  };
}
