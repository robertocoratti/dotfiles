{
  pkgs,
  lib,
  config,
  ...
}: let
  cfg = config.modules.neovim;
  c = config.lib.stylix.colors;
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
      ];
      extraLuaConfig = ''
        vim.api.nvim_create_autocmd("VimEnter", {
          once = true,
          callback = function()
            require("mini.base16").setup({
              palette = {
                base00 = "#${c.base00}",
                base01 = "#${c.base01}",
                base02 = "#${c.base02}",
                base03 = "#${c.base03}",
                base04 = "#${c.base04}",
                base05 = "#${c.base05}",
                base06 = "#${c.base06}",
                base07 = "#${c.base07}",
                base08 = "#${c.base08}",
                base09 = "#${c.base09}",
                base0A = "#${c.base0A}",
                base0B = "#${c.base0B}",
                base0C = "#${c.base0C}",
                base0D = "#${c.base0D}",
                base0E = "#${c.base0E}",
                base0F = "#${c.base0F}",
              },
              use_cterm = false,
            })
          end,
        })
      '';
    };

    xdg.configFile."nvim" = {
      source = ./config;
      recursive = true;
    };
  };
}
