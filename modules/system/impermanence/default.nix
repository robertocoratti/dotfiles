{
  hostInfo,
  pkgs,
  lib,
  config,
  ...
}: let
  cfg = config.modules.impermanence;
  persistPath = "/persist";
in {
  options.modules.impermanence = {
    enable = lib.mkEnableOption "impermanence (tmpfs root)";
  };

  config = lib.mkIf cfg.enable {
    boot.initrd.systemd.enable = true;

    fileSystems."/" = {
      device = "tmpfs";
      fsType = "tmpfs";
      options = ["defaults" "size=2G" "mode=755"];
    };

    fileSystems."/persist".neededForBoot = true;

    fileSystems."/nix" = {
      device = "${persistPath}/nix";
      fsType = "none";
      options = ["bind" "nosuid" "nodev"];
      neededForBoot = true;
    };

    fileSystems."/home" = {
      device = "${persistPath}/home";
      fsType = "none";
      options = ["bind"];
      neededForBoot = true;
    };

    environment.persistence.${persistPath} = {
      hideMounts = true;
      directories = [
        "/etc/NetworkManager/system-connections"
        "/etc/ssh"
        "/var/lib/bluetooth"
        "/var/lib/systemd"
        {
          directory = "/var/lib/podman";
          user = hostInfo.user;
          group = "podman";
        }
        "/var/lib/nixos"
        "/var/log"
      ];
      files = [
        "/etc/machine-id"
      ];
      # /home è interamente bind-mounted da /persist/home — nessuna voce per utente necessaria
    };

    swapDevices = [
      {
        device = "${persistPath}/swap/swapfile";
        size = 32768;
      }
    ];
  };
}
