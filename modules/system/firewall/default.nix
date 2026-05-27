{
  pkgs,
  lib,
  config,
  ...
}: let
  cfg = config.modules.firewall;
in {
  options.modules.firewall = {
    enable = lib.mkEnableOption "nftables firewall";
  };

  config = lib.mkIf cfg.enable {
    networking.firewall.enable = true;
  };
}
