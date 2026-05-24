{
  inputs,
  pkgs,
  lib,
  user,
  config,
  ...
}: let
  cfg = config.modules.sops;
in {
  options.modules.sops = {
    enable = lib.mkEnableOption "Enable SOPS";
    # options
  };

  config = lib.mkIf cfg.enable {
    sops = {
      defaultSopsFile = ../../../secrets/secrets.json;
      defaultSopsFormat = "json";

      age.keyFile = "/home/${user}/.config/sops/age/keys.txt";

      secrets = {
        weather_api_key = {
          owner = "sopsjson";
        };
      };
    };

    systemd.services."sopsjson" = {
      script = ''
        echo "
        {
          \"weather_api_key\": \"$(cat ${config.sops.secrets.weather_api_key.path})\"
        }
        " > /var/lib/sopsjson/secrets.json
      '';

      serviceConfig = {
        User = "sopsjson";
        WorkingDirectory = "/var/lib/sopsjson";
      };
    };

    users = {
      users.sopsjson = {
        home = "/var/lib/sopsjson";
        createHome = true;
        isSystemUser = true;
        group = "sopsjson";
      };

      groups.sopsjson = {};
    };
  };
}
