{
  lib,
  inputs,
  config,
  hostInfo,
  ...
}: {
  imports = [
    ../../modules/home/default.nix
  ];

  home.username = hostInfo.user;
  home.homeDirectory = "/home/${hostInfo.user}";

  modules = {
    art.enable = true;
    claudeCode.enable = true;
    development = {
      enable = true;
      gameDev.enable = true;
    };
    git.enable = true;
    hyprland.enable = true;
    noctalia.enable = true;
    neovim.enable = true;
    icons.enable = true;
    kitty.enable = true;
    packages.enable = true;
    screenshot.enable = true;
    shell.enable = true;
    ssh.enable = true;
    vscode.enable = true;
  };

  gtk.gtk4.theme = null;

  xdg.userDirs = {
    enable = true;
    createDirectories = true;
    setSessionVariables = true;
    desktop = "Scrivania";
    documents = "Documenti";
    download = "Scaricati";
    music = "Musica";
    pictures = "Immagini";
    videos = "Video";
    publicShare = "Pubblici";
    templates = "Modelli";
    extraConfig = {
      DESKTOP = "$HOME/Scrivania";
      DOCUMENTS = "$HOME/Documenti";
      DOWNLOAD = "$HOME/Scaricati";
      MUSIC = "$HOME/Musica";
      PICTURES = "$HOME/Immagini";
      VIDEOS = "$HOME/Video";
      PUBLICSHARE = "$HOME/Pubblici";
      TEMPLATES = "$HOME/Modelli";
    };
  };

  home.stateVersion = "24.05";

  programs.home-manager.enable = true;
}
