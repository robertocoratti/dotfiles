{
  inputs,
  pkgs,
  osConfig,
  lib,
  config,
  ...
}: let
  cfg = config.modules.hyprland;
in {
  options.modules.hyprland = {
    enable = lib.mkEnableOption "enable hyprland wm";
    terminal = lib.mkOption {
      type = lib.types.str;
      default = "kitty";
    };
    browser = lib.mkOption {
      type = lib.types.str;
      default = "brave";
    };
    fileManager = lib.mkOption {
      type = lib.types.str;
      default = "nautilus";
    };
  };

  config = lib.mkIf cfg.enable {
    wayland.windowManager.hyprland = {
      enable = true;
      xwayland.enable = true;
      systemd.enable = true;

      settings = {
        "$ipc" = "noctalia-shell ipc call";
        "$mod" = "SUPER";
        "$terminal" = cfg.terminal;
        "$browser" = cfg.browser;
        "$fileManager" = cfg.fileManager;
        "$webapp" = "$browser --app";

        exec-once = [
          "wl-paste --type text --watch cliphist store"
          "wl-paste --type image --watch cliphist store"
          "noctalia-shell"
        ];

        monitor = [
          "HDMI-A-1, 2560x1440@240, 1920x0, 1.25, bitdepth, 10"
          "DP-1, 1920x1080@75, 0x180, 1"
        ];

        general = {
          border_size = 1;
          allow_tearing = false;
          layout = "dwindle";

          gaps_in = 8;
          gaps_out = 12;
        };

        input = {
          kb_layout = osConfig.services.xserver.xkb.layout;
          kb_variant = osConfig.services.xserver.xkb.variant;
          sensitivity = -0.5;
        };

        misc = {
          disable_hyprland_logo = true;
          disable_splash_rendering = true;
        };

        decoration = {
          rounding = 16;
          rounding_power = 2;

          active_opacity = 1.00;
          inactive_opacity = 0.75;

          blur = {
            enabled = true;
            size = 12;
            passes = 3;
            ignore_opacity = true;
            noise = 0.02;
            contrast = 0.9;
            brightness = 0.75;
            vibrancy = 0.1696;
            vibrancy_darkness = 0.0;
            popups = true;
            special = true;
          };

          shadow = {
            enabled = true;
            range = 4;
            render_power = 3;
            color = lib.mkForce "rgba(1a1a1aee)";
          };
        };

        layerrule = [
          {
            "name" = "noctalia";
            "match:namespace" = "noctalia-background-.*$";
            ignore_alpha = 0.3;
            blur = true;
            blur_popups = true;
          }
          {
            "name" = "noctalia-panels";
            "match:namespace" = "noctalia-(bar|notifications|dock|panel|osd|launcher|overview|toast)-.*$";
            ignore_alpha = 0.10;
            blur = true;
            blur_popups = true;
          }
        ];

        animations = {
          enabled = true;

          bezier = [
            "ease, 0.25, 0.1, 0.25, 1.0"
            "spring, 0.43, 0.0, 0.15, 1.0"
          ];

          animation = [
            "windows, 1, 2, spring, slide"
            "windowsIn, 1, 2, spring, slide"
            "windowsOut, 1, 2, ease, slide"
            "windowsMove, 1, 2, spring"
            "border, 1, 3, spring"
            "borderangle, 1, 50, ease, loop"
            "fade, 1, 2, ease"
            "fadeIn, 1, 3, ease"
            "fadeOut, 1, 2, ease"
            "workspaces, 1, 4, spring, slidefade"
            "layers, 1, 2, spring, slide"
            "layersIn, 1, 2, spring, slide"
            "layersOut, 1, 1, ease, slide"
            "specialWorkspaceIn, 1, 3, spring, slidevert"
            "specialWorkspaceOut, 1, 2, ease, slidevert"
          ];
        };

        bindm = [
          "$mod, mouse:272, movewindow"
          "$mod, mouse:273, resizewindow"
        ];

        bind =
          [
            "$mod, ESCAPE, killactive,"
            "$mod, F, togglefloating,"
            "$mod, SPACE, fullscreen"
            "$mod, K, togglegroup,"
            "$mod, Tab, changegroupactive, f"
            "$mod, up, movefocus, u"
            "$mod, right, movefocus, r"
            "$mod, down, movefocus, d"
            "$mod, left, movefocus, l"
            "$mod, mouse_down, workspace, e+1"
            "$mod, mouse_up, workspace, e-1"
            # media
            ", XF86AudioRaiseVolume, exec, $ipc volume increase"
            ", XF86AudioLowerVolume, exec, $ipc volume decrease"
            ", XF86AudioMute, exec, $ipc volume muteOutput"
            ", XF86AudioMicMute, exec, $ipc volume muteInput"
            ", XF86AudioPlay, exec, $ipc media play-pause"
            ", XF86AudioPause, exec, $ipc media play-pause"
            ", XF86AudioPrev, exec, $ipc media previous"
            ", XF86AudioNext, exec, $ipc media next"
            ", XF86MonBrightnessUp, exec, $ipc brightness increase"
            ", XF86MonBrightnessDown, exec, $ipc brightness decrease"
            ", PAUSE, exec, $ipc volume muteInput"
            # screenshot
            ", Print, exec, grimblast --notify copy area"
            "$mod SHIFT, S, exec, grimblast --notify copy area"
            "$mod, Print, exec, grimblast --notify save screen"
            # clipboard
            "$mod SHIFT, V, exec, $ipc panel-toggle clipboard"
            # lock
            "$mod, L, exec, $ipc lock"
            # apps
            "$mod, RETURN, exec, $terminal"
            "$mod, comma, exec, $ipc settings toggle"
            "$mod, S, exec, $ipc controlCenter toggle"
            "$mod, period, exec, $ipc launcher emoji"
            "$mod, E, exec, $fileManager"
            "$mod, B, exec, $browser"
            "$mod, D, exec, $ipc launcher toggle"
            "$mod, T, exec, $terminal -e btop"
            "$mod, C, exec, vesktop"
            "$mod, V, exec, code"
            "$mod, M, exec, spotify"
            "$mod, O, exec, obsidian"
            # webapps
            "$mod, A, exec, $webapp=\"https:\\\\chatgpt.com\""
            "$mod, W, exec, brave --app=https://web.whatsapp.com"
            "$mod, Y, exec, $webapp=\"https:\\\\youtube.com\""
            "$mod, I, exec, $browser --app=http://localhost:8080"
          ]
          ++ (
            builtins.concatLists (
              builtins.genList (
                x: let
                  ws = let
                    c = (x + 1) / 10;
                  in
                    builtins.toString (x + 1 - (c * 10));
                in [
                  "$mod, ${ws}, workspace, ${toString (x + 1)}"
                  "ALT, ${ws}, movetoworkspace, ${toString (x + 1)}"
                ]
              )
              10
            )
          );

        windowrule = [
          {
            name = "suppress-maximize-events";
            "match:class" = ".*";
            suppress_event = "maximize";
          }
          {
            name = "tile-brave";
            "match:class" = "Brave-browser";
            tile = true;
          }
        ];
      };
    };
  };
}
