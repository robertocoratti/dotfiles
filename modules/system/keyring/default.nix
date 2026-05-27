{
  inputs,
  pkgs,
  lib,
  config,
  ...
}: let
  cfg = config.modules.keyring;
in {
  options.modules.keyring = {
    enable = lib.mkEnableOption "GNOME Keyring — unlocked automatically by PAM at login using the user's password. If the keyring password drifts from the login password, PAM can't unlock it and the keyring must be reset: delete ~/.local/share/keyrings/ and re-login.";
  };

  config = lib.mkIf cfg.enable {
    services.gnome.gnome-keyring.enable = true;

    # PAM unlocks the keyring with the login password during greetd authentication.
    # The keyring password is always the same as the user's login password — there
    # is no separate keyring password. If the keyring was created under a previous
    # password, PAM will fail to unlock it silently. To reset:
    #   rm -rf ~/.local/share/keyrings/
    # Then re-login — a fresh keyring is created with the current login password.
    security.pam.services.greetd.enableGnomeKeyring = lib.mkIf config.modules.greetd.enable true;
  };
}
