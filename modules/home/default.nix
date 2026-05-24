{
  inputs,
  lib,
  pkgs,
  config,
  ...
}: {
  imports = [
    ./claude-code
    ./git
    ./helix
    ./hyprland
    ./noctalia
    ./icons
    ./kitty
    ./packages
    ./screenshot
    ./shell
    ./vscode
  ];

  nixpkgs.config.allowUnfree = true;
  nixpkgs.config.chromium.enableWideVine = true;
}
