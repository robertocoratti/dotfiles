{
  inputs,
  user,
  language,
  timeZone,
  pkgs,
  lib,
  config,
  ...
}: {
  imports = [
    ./ai
    ./bluetooth
    ./greetd
    ./i18n
    ./keyboard
    ./keyring
    ./networking
    ./nh
    ./notifications
    ./polkit
    ./power
    ./shell
    ./sops
    ./sound
    ./stylix
  ];

  modules = {
    ai.enable = lib.mkDefault true;

    bluetooth.enable = lib.mkDefault true;

    greetd.enable = lib.mkDefault true;

    i18n = {
      enable = lib.mkDefault true;
      language = language;
    };

    keyring.enable = lib.mkDefault true;

    networking = {
      enable = lib.mkDefault true;
      wireless.enable = lib.mkDefault true;
    };

    nh.enable = lib.mkDefault true;

    notifications.enable = lib.mkDefault true;

    sound.enable = lib.mkDefault true;

    polkit.enable = lib.mkDefault true;

    power.enable = lib.mkDefault true;

    sops.enable = lib.mkDefault true;

    shell = {
      enable = lib.mkDefault true;
      fish.enable = lib.mkDefault true;
    };

    stylix.enable = lib.mkDefault true;
  };

  nix.settings.experimental-features = [
    "nix-command"
    "flakes"
  ];

  nixpkgs.config.allowUnfree = true;

  boot = {
    loader = {
      systemd-boot.enable = true;
      efi.canTouchEfiVariables = true;
    };

    kernelParams = [
      "quiet"
      "splash"
      "boot.shell_on_fail"
      "loglevel=3"
      "rd.systemd.show_status=false"
      "rd.udev.log_level=3"
      "udev.log_priority=3"
      "systemd.show_status=false"
      "vt.global_cursor_default=0"
    ];

    consoleLogLevel = 3;
    initrd.verbose = false;

    plymouth = {
      enable = true;
      themePackages = with pkgs; [
        adi1090x-plymouth-themes
      ];
      theme = "cuts_alt";
    };

    supportedFilesystems = ["ntfs"];
  };

  environment.systemPackages = with pkgs; [
    age
    sops
  ];

  users.users.${user} = {
    isNormalUser = true;
    uid = 1000;
    description = "${user}";
    extraGroups = [
      "networkmanager"
      "wheel"
      "video"
      "render"
    ];
  };

  time = {
    hardwareClockInLocalTime = true;
    timeZone = timeZone;
  };

  services = {
    printing.enable = true;
    xserver.enable = true;
    gvfs.enable = true;
  };

  xdg.portal = {
    enable = true;
    extraPortals = [
      pkgs.xdg-desktop-portal-gtk
      pkgs.xdg-desktop-portal-hyprland
    ];
    config.common.default = "*";
  };

  system.stateVersion = "23.11";
}
