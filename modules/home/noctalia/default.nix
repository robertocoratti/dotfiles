{
  inputs,
  pkgs,
  lib,
  config,
  osConfig,
  ...
}: let
  cfg = config.modules.noctalia;
  isLaptop = osConfig.modules.host.type == "laptop";
  stylixWallpaper = osConfig.stylix.image or null;

  mkWidget = id: {inherit id;};
  mkLauncherWidget = id: {inherit id; useDistroLogo = true;};

  leftWidgets =
    [
      (mkLauncherWidget "Launcher")
      (mkWidget "Workspace")
      (mkWidget "ActiveWindow")
      (mkWidget "MediaMini")
    ];
  centerWidgets = [
    (mkWidget "Clock")
    (mkWidget "plugin:weather-indicator")
  ];
  rightWidgets =
    [
      (mkWidget "Microphone")
      (mkWidget "Volume")
      (mkWidget "Network")
    ]
    ++ lib.optionals isLaptop [
      (mkWidget "Battery")
      (mkWidget "Brightness")
    ]
    ++ [
      (mkWidget "SystemMonitor")
      (mkWidget "plugin:screen-toolkit")
      (mkWidget "Tray")
      (mkWidget "NotificationHistory")
      (mkWidget "ControlCenter")
      (mkWidget "SessionMenu")
    ];

  wallpaperSettings = lib.optionalAttrs (stylixWallpaper != null) {
    defaultWallpaper = stylixWallpaper;
  };
in {
  imports = [inputs.noctalia.homeModules.default];

  options.modules.noctalia = {
    enable = lib.mkEnableOption "enable Noctalia Shell";
  };

  config = lib.mkIf cfg.enable {
    home.file.".face".source = pkgs.fetchurl {
      url = "https://github.com/robertocoratti.png";
      hash = "sha256-FoUDndNhtssatLShpngIsqMJWt9uLgCGSi8wRAADkeY=";
    };

    programs.noctalia-shell = {
      enable = true;
      settings = lib.mkForce {
        settingsVersion = 0;

        bar = {
          barType = "simple";
          position = "top";
          monitors = [];
          density = "default";
          showOutline = false;
          showCapsule = true;
          capsuleOpacity = 0.75;
          capsuleColorKey = "none";
          widgetSpacing = 8;
          contentPadding = 4;
          fontScale = 1;
          enableExclusionZoneInset = true;
          backgroundOpacity = 0.35;
          useSeparateOpacity = false;
          marginVertical = 4;
          marginHorizontal = 4;
          frameThickness = 8;
          frameRadius = 16;
          outerCorners = true;
          hideOnOverview = false;
          displayMode = "always_visible";
          autoHideDelay = 500;
          autoShowDelay = 150;
          showOnWorkspaceSwitch = true;
          mouseWheelAction = "none";
          reverseScroll = false;
          mouseWheelWrap = true;
          middleClickAction = "none";
          middleClickFollowMouse = false;
          middleClickCommand = "";
          rightClickAction = "controlCenter";
          rightClickFollowMouse = true;
          rightClickCommand = "";
          screenOverrides = [];
          widgets = {
            left = leftWidgets;
            center = centerWidgets;
            right = rightWidgets;
          };
        };

        general = {
          avatarImage = "~/.face";
          dimmerOpacity = 0.2;
          showScreenCorners = false;
          forceBlackScreenCorners = false;
          scaleRatio = 1;
          radiusRatio = 1;
          iRadiusRatio = 1;
          boxRadiusRatio = 1;
          screenRadiusRatio = 1;
          animationSpeed = 1;
          animationDisabled = false;
          compactLockScreen = false;
          lockScreenAnimations = false;
          lockOnSuspend = true;
          showSessionButtonsOnLockScreen = true;
          showHibernateOnLockScreen = false;
          enableLockScreenMediaControls = false;
          enableShadows = true;
          enableBlurBehind = true;
          shadowDirection = "bottom_right";
          shadowOffsetX = 4;
          shadowOffsetY = 4;
          language = "";
          allowPanelsOnScreenWithoutBar = true;
          showChangelogOnStartup = true;
          telemetryEnabled = false;
          enableLockScreenCountdown = true;
          lockScreenCountdownDuration = 10000;
          autoStartAuth = false;
          allowPasswordWithFprintd = false;
          clockStyle = "custom";
          clockFormat = "hh\nmm";
          passwordChars = false;
          lockScreenMonitors = [];
          lockScreenBlur = 0.5;
          lockScreenTint = 0.25;
          keybinds = {
            keyUp = ["Up"];
            keyDown = ["Down"];
            keyLeft = ["Left"];
            keyRight = ["Right"];
            keyEnter = ["Return" "Enter"];
            keyEscape = ["Esc"];
            keyRemove = ["Del"];
          };
          reverseScroll = false;
          smoothScrollEnabled = true;
        };

        ui = {
          fontDefault = osConfig.stylix.fonts.sansSerif.name;
          fontFixed = osConfig.stylix.fonts.monospace.name;
          fontDefaultScale = 1;
          fontFixedScale = 1;
          tooltipsEnabled = true;
          scrollbarAlwaysVisible = true;
          boxBorderEnabled = true;
          panelBackgroundOpacity = 0.35;
          translucentWidgets = true;
          panelsAttachedToBar = true;
          settingsPanelMode = "attached";
          settingsPanelSideBarCardStyle = false;
        };

        location = {
          name = "";
          weatherEnabled = true;
          weatherShowEffects = true;
          weatherTaliaMascotAlways = false;
          useFahrenheit = false;
          use12hourFormat = false;
          showWeekNumberInCalendar = false;
          showCalendarEvents = true;
          showCalendarWeather = true;
          analogClockInCalendar = false;
          firstDayOfWeek = -1;
          hideWeatherTimezone = false;
          hideWeatherCityName = false;
          autoLocate = true;
        };

        calendar = {
          cards = [
            {enabled = true; id = "calendar-header-card";}
            {enabled = true; id = "calendar-month-card";}
            {enabled = true; id = "weather-card";}
          ];
        };

        wallpaper =
          {
            enabled = true;
            overviewEnabled = false;
            directory = "";
            monitorDirectories = [];
            enableMultiMonitorDirectories = false;
            showHiddenFiles = false;
            viewMode = "single";
            setWallpaperOnAllMonitors = true;
            linkLightAndDarkWallpapers = true;
            fillMode = "crop";
            fillColor = "#000000";
            useSolidColor = false;
            solidColor = "#1a1a2e";
            automationEnabled = false;
            wallpaperChangeMode = "random";
            randomIntervalSec = 300;
            transitionDuration = 1500;
            transitionType = ["fade" "disc" "stripes" "wipe" "pixelate" "honeycomb"];
            skipStartupTransition = false;
            transitionEdgeSmoothness = 0.05;
            panelPosition = "follow_bar";
            hideWallpaperFilenames = false;
            useOriginalImages = false;
            overviewBlur = 0.5;
            overviewTint = 0.4;
            useWallhaven = true;
            wallhavenQuery = "";
            wallhavenSorting = "toplist";
            wallhavenOrder = "desc";
            wallhavenCategories = "111";
            wallhavenPurity = "100";
            wallhavenRatios = "";
            wallhavenApiKey = "";
            wallhavenResolutionMode = "atleast";
            wallhavenResolutionWidth = "2560";
            wallhavenResolutionHeight = "1440";
            sortOrder = "name";
            favorites = [];
          }
          // wallpaperSettings;

        appLauncher = {
          enableClipboardHistory = false;
          autoPasteClipboard = false;
          enableClipPreview = true;
          clipboardWrapText = true;
          enableClipboardSmartIcons = true;
          enableClipboardChips = true;
          clipboardWatchTextCommand = "wl-paste --type text --watch cliphist store";
          clipboardWatchImageCommand = "wl-paste --type image --watch cliphist store";
          position = "center";
          pinnedApps = ["brave" "nautilus" "code" "kitty" "spotify" "obsidian"];
          sortByMostUsed = true;
          terminalCommand = "kitty -e";
          customLaunchPrefixEnabled = false;
          customLaunchPrefix = "";
          viewMode = "list";
          showCategories = true;
          iconMode = "tabler";
          showIconBackground = false;
          enableSettingsSearch = true;
          enableWindowsSearch = true;
          enableSessionSearch = true;
          ignoreMouseInput = false;
          screenshotAnnotationTool = "";
          overviewLayer = false;
          density = "default";
        };

        controlCenter = {
          position = "close_to_bar_button";
          diskPath = "/";
          shortcuts = {
            left = [
              {id = "Network";}
              {id = "Bluetooth";}
              {id = "WallpaperSelector";}
              {id = "NoctaliaPerformance";}
            ];
            right = [
              {id = "Notifications";}
              {id = "PowerProfile";}
              {id = "KeepAwake";}
              {id = "NightLight";}
            ];
          };
          cards = [
            {enabled = true; id = "profile-card";}
            {enabled = true; id = "shortcuts-card";}
            {enabled = true; id = "audio-card";}
            {enabled = false; id = "brightness-card";}
            {enabled = true; id = "weather-card";}
            {enabled = true; id = "media-sysmon-card";}
          ];
        };

        systemMonitor = {
          cpuWarningThreshold = 80;
          cpuCriticalThreshold = 90;
          tempWarningThreshold = 80;
          tempCriticalThreshold = 90;
          gpuWarningThreshold = 80;
          gpuCriticalThreshold = 90;
          memWarningThreshold = 80;
          memCriticalThreshold = 90;
          swapWarningThreshold = 80;
          swapCriticalThreshold = 90;
          diskWarningThreshold = 80;
          diskCriticalThreshold = 90;
          diskAvailWarningThreshold = 20;
          diskAvailCriticalThreshold = 10;
          batteryWarningThreshold = 20;
          batteryCriticalThreshold = 5;
          enableDgpuMonitoring = false;
          useCustomColors = false;
          warningColor = "";
          criticalColor = "";
          externalMonitor = "resources || missioncenter || jdsystemmonitor || corestats || system-monitoring-center || gnome-system-monitor || plasma-system-monitor || mate-system-monitor || ukui-system-monitor || deepin-system-monitor || pantheon-system-monitor";
        };

        noctaliaPerformance = {
          disableWallpaper = true;
          disableDesktopWidgets = true;
        };

        dock = {
          enabled = true;
          position = "bottom";
          displayMode = "auto_hide";
          dockType = "floating";
          backgroundOpacity = 0.35;
          floatingRatio = 1;
          size = 1;
          onlySameOutput = true;
          monitors = [];
          pinnedApps = ["brave" "nautilus" "code" "kitty" "spotify" "obsidian"];
          colorizeIcons = false;
          showLauncherIcon = false;
          launcherPosition = "end";
          launcherUseDistroLogo = false;
          launcherIcon = "";
          launcherIconColor = "none";
          pinnedStatic = false;
          inactiveIndicators = false;
          groupApps = false;
          groupContextMenuMode = "extended";
          groupClickAction = "cycle";
          groupIndicatorStyle = "dots";
          deadOpacity = 0.6;
          animationSpeed = 1;
          sitOnFrame = false;
          showDockIndicator = false;
          indicatorThickness = 4;
          indicatorColor = "primary";
          indicatorOpacity = 0.6;
        };

        network = {
          bluetoothRssiPollingEnabled = false;
          bluetoothRssiPollIntervalMs = 60000;
          networkPanelView = "wifi";
          wifiDetailsViewMode = "grid";
          bluetoothDetailsViewMode = "grid";
          bluetoothHideUnnamedDevices = false;
          disableDiscoverability = false;
          bluetoothAutoConnect = true;
        };

        sessionMenu = {
          enableCountdown = true;
          countdownDuration = 10000;
          position = "center";
          showHeader = true;
          showKeybinds = true;
          largeButtonsStyle = true;
          largeButtonsLayout = "single-row";
          powerOptions = [
            {action = "lock"; enabled = true; keybind = "1";}
            {action = "suspend"; enabled = true; keybind = "2";}
            {action = "hibernate"; enabled = true; keybind = "3";}
            {action = "reboot"; enabled = true; keybind = "4";}
            {action = "logout"; enabled = true; keybind = "5";}
            {action = "shutdown"; enabled = true; keybind = "6";}
            {action = "rebootToUefi"; enabled = true; keybind = "7";}
          ];
        };

        notifications = {
          enabled = true;
          enableMarkdown = false;
          density = "default";
          monitors = [];
          location = "top_right";
          overlayLayer = true;
          backgroundOpacity = 0.35;
          respectExpireTimeout = false;
          lowUrgencyDuration = 3;
          normalUrgencyDuration = 6;
          criticalUrgencyDuration = 12;
          clearDismissed = true;
          saveToHistory = {
            low = true;
            normal = true;
            critical = true;
          };
          sounds = {
            enabled = false;
            volume = 0.5;
            separateSounds = false;
            criticalSoundFile = "";
            normalSoundFile = "";
            lowSoundFile = "";
            excludedApps = "discord,brave,firefox,chrome,chromium,edge";
          };
          enableMediaToast = false;
          enableKeyboardLayoutToast = true;
          enableBatteryToast = true;
        };

        osd = {
          enabled = true;
          location = "bottom_center`";
          autoHideMs = 2000;
          overlayLayer = true;
          backgroundOpacity = 0.35;
          enabledTypes = [0 1 2];
          monitors = [];
        };

        audio = {
          volumeStep = 2;
          volumeOverdrive = false;
          spectrumFrameRate = 30;
          visualizerType = "linear";
          spectrumMirrored = true;
          mprisBlacklist = [];
          preferredPlayer = "";
          volumeFeedback = false;
          volumeFeedbackSoundFile = "";
        };

        brightness = {
          brightnessStep = 2;
          enforceMinimum = true;
          enableDdcSupport = false;
          backlightDeviceMappings = [];
        };

        colorSchemes = {
          useWallpaperColors = false;
          predefinedScheme = "Nord";
          darkMode = true;
          schedulingMode = "off";
          manualSunrise = "06:30";
          manualSunset = "18:30";
          generationMethod = "tonal-spot";
          monitorForColors = "";
          syncGsettings = true;
        };

        templates = {
          activeTemplates = [];
          enableUserTheming = false;
        };

        nightLight = {
          enabled = false;
          forced = false;
          autoSchedule = true;
          nightTemp = "4000";
          dayTemp = "6500";
          manualSunrise = "06:30";
          manualSunset = "18:30";
        };

        hooks = {
          enabled = false;
          wallpaperChange = "";
          darkModeChange = "";
          screenLock = "";
          screenUnlock = "";
          performanceModeEnabled = "";
          performanceModeDisabled = "";
          startup = "";
          session = "";
          colorGeneration = "";
        };

        plugins = {
          autoUpdate = false;
          notifyUpdates = true;
        };

        idle = {
          enabled = false;
          screenOffTimeout = 600;
          lockTimeout = 660;
          suspendTimeout = 1800;
          fadeDuration = 5;
          screenOffCommand = "";
          lockCommand = "";
          suspendCommand = "";
          resumeScreenOffCommand = "";
          resumeLockCommand = "";
          resumeSuspendCommand = "";
          customCommands = "[]";
        };

        desktopWidgets = {
          enabled = false;
          overviewEnabled = true;
          gridSnap = false;
          gridSnapScale = false;
          monitorWidgets = [];
        };
      };

      plugins = {
        sources = [
          {
            enabled = true;
            name = "Noctalia Plugins";
            url = "https://github.com/noctalia-dev/noctalia-plugins";
          }
        ];
        states = {
          weather-indicator = {
            enabled = true;
            sourceUrl = "https://github.com/noctalia-dev/noctalia-plugins";
          };
          screen-toolkit = {
            enabled = true;
            sourceUrl = "https://github.com/noctalia-dev/noctalia-plugins";
          };
        };
        version = 2;
      };
    };
  };
}
