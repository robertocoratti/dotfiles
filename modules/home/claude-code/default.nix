{
  inputs,
  pkgs,
  lib,
  config,
  ...
}: let
  cfg = config.modules.claudeCode;
in {
  options.modules.claudeCode = {
    enable = lib.mkEnableOption "enable claude-code";
  };

  config = lib.mkIf cfg.enable {
    home.packages = [
      inputs.claude-code-nix.packages.${pkgs.stdenv.hostPlatform.system}.default
    ];
  };
}
