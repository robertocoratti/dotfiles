{
  inputs,
  lib,
  pkgs,
  config,
  ...
}: {
  imports = [
    ./claude-code
    ./fuzzel
    ./git
    ./helix
    ./hyprland
    ./hyprpanel
    ./icons
    ./kitty
    ./lock
    ./packages
    ./screenshot
    ./shell
    ./vscode
  ];

  nixpkgs.config.allowUnfree = true;
  nixpkgs.config.chromium.enableWideVine = true;
}
