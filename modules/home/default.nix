{
  inputs,
  lib,
  pkgs,
  config,
  ...
}: {
  imports = [
    ./fuzzel
    ./git
    ./helix
    ./hyprland
    ./hyprpanel
    ./icons
    ./kitty
    ./packages
    ./vscode
  ];

  nixpkgs.config.allowUnfree = true;
}
