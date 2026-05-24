{
  config,
  pkgs,
  hostInfo,
  inputs,
  ...
}: {
  imports = [
    inputs.home-manager.nixosModules.default
    ./hardware-configuration.nix
    ../../modules/system/default.nix
  ];

  home-manager = {
    extraSpecialArgs = {inherit inputs hostInfo;};
    backupFileExtension = "backup";
    users.${hostInfo.user} = import ./home.nix;
  };

  modules = {
    host = {
      enable = true;
      name = hostInfo.host;
      type = hostInfo.type;
      language = hostInfo.language;
      timeZone = hostInfo.timeZone;
    };

    keyboard = {
      layout = "us";
      variant = "altgr-intl";
    };

    networking = {
      nameservers = [
        "1.1.1.1"
        "1.0.0.1"
      ];
    };
  };
}
