{
  inputs,
  hostInfo,
  pkgs,
  lib,
  config,
  ...
}: {
  imports = [
    ./ai
    ./bluetooth
    ./containers
    ./firewall
    ./greetd
    ./host
    ./i18n
    ./impermanence
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
    ./tailscale
    ./xdg
  ];

  modules = {
    ai.enable = lib.mkDefault true;

    bluetooth.enable = lib.mkDefault true;

    containers.enable = lib.mkDefault true;

    firewall.enable = lib.mkDefault true;

    greetd.enable = lib.mkDefault true;

    i18n = {
      enable = lib.mkDefault true;
      language = config.modules.host.language;
    };

    impermanence.enable = lib.mkDefault true;

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

    shell = {
      enable = lib.mkDefault true;
      fish.enable = lib.mkDefault true;
    };

    sops.enable = lib.mkDefault true;

    stylix.enable = lib.mkDefault true;

    tailscale.enable = lib.mkDefault true;

    xdgPortal.enable = lib.mkDefault true;
  };

  nix.settings = {
    experimental-features = ["nix-command" "flakes"];
    substituters = [
      "https://noctalia.cachix.org"
      "https://nix-community.cachix.org"
      "https://hyprland.cachix.org"
    ];
    trusted-public-keys = [
      "noctalia.cachix.org-1:pCOR47nnMEo5thcxNDtzWpOxNFQsBRglJzxWPp3dkU4="
      "nix-community.cachix.org-1:mB9FSh9qf2dCimDSUo8Zy7bkq5CX+/rkCWyvRCYg3Fs="
      "hyprland.cachix.org-1:a7pgxzMz7+chwVL3/pzj6jIBMioiJM7ypFP8PwtkuGc="
    ];
  };

  nix.gc = {
    automatic = true;
    dates = "weekly";
    options = "--delete-older-than 7d";
  };

  programs.nh.clean.enable = lib.mkForce false;

  nix.optimise.automatic = true;

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

  users.mutableUsers = false;

  users.users.${hostInfo.user} = {
    isNormalUser = true;
    uid = 1000;
    description = hostInfo.fullName;
    hashedPasswordFile = config.sops.secrets.user-password.path;
    extraGroups = [
      "networkmanager"
      "wheel"
      "video"
      "render"
    ];
  };

  users.users.root.hashedPasswordFile = config.sops.secrets.user-password.path;

  time = {
    hardwareClockInLocalTime = true;
    timeZone = config.modules.host.timeZone;
  };

  services = {
    printing.enable = true;
    xserver.enable = true;
    gvfs.enable = true;
    fstrim.enable = true;
    tumbler.enable = true;
  };

  system.stateVersion = "24.11";
}
