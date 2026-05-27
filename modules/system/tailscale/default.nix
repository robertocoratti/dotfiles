{
  pkgs,
  lib,
  config,
  ...
}: let
  cfg = config.modules.tailscale;
in {
  options.modules.tailscale = {
    enable = lib.mkEnableOption "Tailscale VPN";
  };

  config = lib.mkIf cfg.enable {
    services.tailscale.enable = true;

    networking.firewall = {
      trustedInterfaces = ["tailscale0"];
      allowedUDPPorts = [config.services.tailscale.port];
    };
  };
}
