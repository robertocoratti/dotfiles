{
  lib,
  config,
  ...
}: let
  cfg = config.modules.containers;
in {
  options.modules.containers = {
    enable = lib.mkEnableOption "enable container runtime";
  };

  config = lib.mkIf cfg.enable {
    virtualisation.podman = {
      enable = true;
      dockerCompat = true;
    };
  };
}
