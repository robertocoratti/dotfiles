{
  lib,
  inputs,
  config,
  ...
}: {
  imports = [
    ../../modules/home/default.nix
  ];

  home.username = "korazza";
  home.homeDirectory = "/home/korazza";

  modules = {
    claudeCode.enable = true;
    git.enable = true;
    helix.enable = true;
    hyprland.enable = true;
    noctalia.enable = true;
    icons.enable = true;
    kitty.enable = true;
    packages.enable = true;
    screenshot.enable = true;
    shell.enable = true;
    vscode.enable = true;
  };

  gtk.gtk4.theme = null;

  home.stateVersion = "24.05";

  programs.home-manager.enable = true;
}
