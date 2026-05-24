{
  hostInfo,
  config,
  lib,
  ...
}: let
  cfg = config.modules.sops;
in {
  options.modules.sops = {
    enable = lib.mkEnableOption "Enable SOPS secrets management";
  };

  config = lib.mkIf cfg.enable {
    sops = {
      defaultSopsFile = ../../../secrets/secrets.yaml;
      defaultSopsFormat = "yaml";

      age.keyFile = "/home/${hostInfo.user}/.config/sops/age/keys.txt";

      secrets = {
        user-password = {
          neededForUsers = true;
        };
      };
    };
  };
}
