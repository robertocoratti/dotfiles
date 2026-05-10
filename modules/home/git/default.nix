{
  inputs,
  pkgs,
  lib,
  config,
  ...
}: let
  cfg = config.modules.git;
in {
  options.modules.git = {
    enable = lib.mkEnableOption "Enable git";
    # options
  };

  config = lib.mkIf cfg.enable {
    programs.git = {
      enable = true;
      settings = {
        user = {
          name = "Roberto Coratti";
          email = "corattiroberto@gmail.com";
        };
      };
      signing.format = null;
    };
  };
}
