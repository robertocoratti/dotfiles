{
  pkgs,
  lib,
  config,
  ...
}: let
  cfg = config.modules.ssh;
in {
  options.modules.ssh = {
    enable = lib.mkEnableOption "SSH client configuration";
  };

  config = lib.mkIf cfg.enable {
    programs.ssh = {
      enable = true;
      enableDefaultConfig = false;
      matchBlocks = {
        "*" = {
          addKeysToAgent = "yes";
          serverAliveInterval = 60;
          serverAliveCountMax = 3;
        };
        "github.com" = {
          user = "git";
          identityFile = "~/.ssh/id_ed25519";
        };
        "gitlab.com" = {
          user = "git";
          identityFile = "~/.ssh/id_ed25519";
        };
      };
    };
  };
}
