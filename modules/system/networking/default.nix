{
  inputs,
  pkgs,
  lib,
  config,
  ...
}: let
  cfg = config.modules.networking;
in {
  options.modules.networking = {
    enable = lib.mkEnableOption "enable networking";

    wireless.enable = lib.mkEnableOption "enable networking wireless";

    nameservers = lib.mkOption {
      type = lib.types.listOf lib.types.str;
      default = [];
      example = ["1.1.1.1" "1.0.0.1"];
      description = ''
        List of nameservers
      '';
    };
  };

  config = lib.mkIf cfg.enable {
    networking = {
      hostName = config.modules.host.name;
      useDHCP = lib.mkDefault true;
      networkmanager.enable = true;

      nameservers = cfg.nameservers;
    };
  };
}
