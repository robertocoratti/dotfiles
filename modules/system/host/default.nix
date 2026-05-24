{
  lib,
  config,
  ...
}: let
  cfg = config.modules.host;
in {
  options.modules.host = {
    enable = lib.mkEnableOption "Enable host metadata";
    name = lib.mkOption {
      type = lib.types.str;
      description = "Host name (e.g. desktop, laptop)";
    };
    type = lib.mkOption {
      type = lib.types.enum ["desktop" "laptop"];
      default = "desktop";
      description = "Device type";
    };
    language = lib.mkOption {
      type = lib.types.str;
      default = "en_US";
      description = "System language (e.g. it_IT, en_US)";
    };
    timeZone = lib.mkOption {
      type = lib.types.str;
      default = "UTC";
      description = "Timezone (e.g. Europe/Rome)";
    };
  };

  config = lib.mkIf cfg.enable {};
}
