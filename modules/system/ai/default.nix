{
  pkgs,
  lib,
  config,
  ...
}: let
  cfg = config.modules.ai;
in {
  options.modules.ai = {
    enable = lib.mkEnableOption "enable local AI stack (Ollama + Open WebUI)";
  };

  config = lib.mkIf cfg.enable {
    services.ollama = {
      enable = true;
      package = pkgs.ollama-rocm;
      environmentVariables = {
        # RX 6950 XT = RDNA2 (gfx1030)
        HSA_OVERRIDE_GFX_VERSION = "10.3.0";
      };
    };

    services.open-webui = {
      enable = true;
      port = 8080;
      host = "127.0.0.1";
      environment = {
        SCARF_NO_ANALYTICS = "True";
        DO_NOT_TRACK = "True";
        ANONYMIZED_TELEMETRY = "False";
        OLLAMA_API_BASE_URL = "http://127.0.0.1:11434";
      };
    };
  };
}
