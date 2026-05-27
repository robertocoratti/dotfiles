{
  inputs,
  lib,
  pkgs,
  config,
  ...
}: {
  imports = [
    ./art
    ./claude-code
    ./development
    ./git
    ./hyprland
    ./noctalia
    ./icons
    ./kitty
    ./neovim
    ./packages
    ./screenshot
    ./shell
    ./ssh
    ./vscode
  ];

  nixpkgs.config.allowUnfree = true;
  nixpkgs.config.chromium.enableWideVine = true;
}
