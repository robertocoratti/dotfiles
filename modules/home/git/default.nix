{
  hostInfo,
  pkgs,
  lib,
  config,
  ...
}: let
  cfg = config.modules.git;
in {
  options.modules.git = {
    enable = lib.mkEnableOption "Enable git";
  };

  config = lib.mkIf cfg.enable {
    programs.git = {
      enable = true;
      settings = {
        user = {
          name = hostInfo.fullName;
          email = hostInfo.email;
        };
        gpg.format = "ssh";
        "gpg \"ssh\"".allowedSignersFile = "~/.config/git/allowed_signers";
        init.defaultBranch = "main";
        push.autoSetupRemote = true;
        pull.rebase = true;
      };
      signing = {
        key = "~/.ssh/id_ed25519.pub";
        signByDefault = true;
        format = "ssh";
      };
    };
  };
}
