{
  pkgs,
  lib,
  config,
  ...
}: let
  cfg = config.modules.shell;
in {
  options.modules.shell = {
    enable = lib.mkEnableOption "enable shell configuration";
  };

  config = lib.mkIf cfg.enable {
    programs.fish = {
      enable = true;

      interactiveShellInit = ''
        set fish_greeting ""
      '';

      shellAliases = {
        ls = "eza --icons=always --color=always --group-directories-first --git-ignore";
        la = "eza -a --icons=always --color=always --group-directories-first --git-ignore";
        ll = "eza -l --git --icons=always --color=always --group-directories-first --git-ignore";
        lla = "eza -la --git --icons=always --color=always --group-directories-first --git-ignore";
        cat = "bat";
      };
    };

    programs.starship = {
      enable = true;
      enableFishIntegration = true;
      settings = {
        format = lib.concatStrings [
          "$directory"
          "$git_branch"
          "$git_status"
          "$python"
          "$rust"
          "$golang"
          "$nodejs"
          "$line_break"
          "$character"
        ];
        directory.truncation_length = 3;
        character = {
          success_symbol = "[❯](bold green)";
          error_symbol = "[❯](bold red)";
        };
      };
    };

    programs.zellij.enable = true;

    programs.direnv = {
      enable = true;
      enableFishIntegration = true;
      nix-direnv.enable = true;
    };

    programs.zoxide = {
      enable = true;
      enableFishIntegration = true;
    };

    programs.fzf = {
      enable = true;
      enableFishIntegration = true;
    };

    programs.bat.enable = true;
  };
}
