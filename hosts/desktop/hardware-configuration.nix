{
  config,
  lib,
  pkgs,
  modulesPath,
  hostInfo,
  ...
}: let
  uid = config.users.users.${hostInfo.user}.uid;
in {
  imports = [
    (modulesPath + "/installer/scan/not-detected.nix")
  ];

  boot.kernelPackages = pkgs.linuxPackages_latest;

  boot.initrd.availableKernelModules = [
    "nvme"
    "xhci_pci"
    "ahci"
    "usbhid"
    "usb_storage"
    "sd_mod"
  ];
  boot.initrd.kernelModules = [];
  boot.kernelModules = [];
  boot.extraModulePackages = [];
  boot.kernelParams = [
    "pcie_port_pm=off"
    "pcie_aspm=1"
    "pcie_aspm.policy=performance"
    "amdgpu_aspm=1"
    "quiet"
    "loglevel=3"
    "video=HDMI-A-1:2560x1440@240"
  ];

  fileSystems."/boot" = {
    device = "/dev/disk/by-uuid/66AE-788C";
    fsType = "vfat";
    options = ["fmask=0077" "dmask=0077"];
  };

  fileSystems."/persist" = {
    device = "/dev/disk/by-uuid/9cd23d77-ea1f-4891-af0c-49bc2b0dff52";
    fsType = "ext4";
    neededForBoot = true;
  };

  fileSystems."/media/${hostInfo.user}/ssd" = {
    device = "/dev/disk/by-uuid/3CE4C1E5E4C1A20E";
    fsType = "ntfs3";
    options = ["rw" "uid=${toString uid}"];
  };

  networking.useDHCP = lib.mkDefault true;

  nixpkgs.hostPlatform = lib.mkDefault hostInfo.system;
  hardware.cpu.amd.updateMicrocode = lib.mkDefault config.hardware.enableRedistributableFirmware;
}
