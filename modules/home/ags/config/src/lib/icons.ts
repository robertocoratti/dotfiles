export const icons = {
  volume: {
    high: "audio-volume-high-symbolic",
    medium: "audio-volume-medium-symbolic",
    low: "audio-volume-low-symbolic",
    muted: "audio-volume-muted-symbolic",
  },
  microphone: {
    high: "microphone-sensitivity-high-symbolic",
    medium: "microphone-sensitivity-medium-symbolic",
    low: "microphone-sensitivity-low-symbolic",
    muted: "microphone-sensitivity-muted-symbolic",
  },
  network: {
    wired: "network-wired-symbolic",
    wifi: "network-wireless-symbolic",
    wifiSignal: (strength: number) => {
      if (strength >= 80) return "network-wireless-signal-excellent-symbolic";
      if (strength >= 60) return "network-wireless-signal-good-symbolic";
      if (strength >= 40) return "network-wireless-signal-ok-symbolic";
      if (strength >= 20) return "network-wireless-signal-weak-symbolic";
      return "network-wireless-signal-none-symbolic";
    },
    disconnected: "network-wireless-offline-symbolic",
  },
  bluetooth: {
    enabled: "bluetooth-active-symbolic",
    disabled: "bluetooth-disabled-symbolic",
  },
  battery: {
    charging: "battery-level-100-charged-symbolic",
    full: "battery-level-100-symbolic",
    high: "battery-level-80-symbolic",
    medium: "battery-level-60-symbolic",
    low: "battery-level-40-symbolic",
    critical: "battery-level-20-symbolic",
  },
  notifications: {
    bell: "notification-symbolic",
    none: "notification-disabled-symbolic",
  },
  power: "system-shutdown-symbolic",
  weather: {
    sunny: "weather-clear-symbolic",
    cloudy: "weather-overcast-symbolic",
    rain: "weather-showers-symbolic",
    snow: "weather-snow-symbolic",
    storm: "weather-storm-symbolic",
  },
  cpu: "computer-symbolic",
  ram: "memory-symbolic",
  chevron: "pan-end-symbolic",
  empty: "checkbox-symbolic",
  lock: "system-lock-screen-symbolic",
  logout: "system-log-out-symbolic",
  reboot: "system-reboot-symbolic",
  shutdown: "system-shutdown-symbolic",
  hibernate: "system-hibernate-symbolic",
} as const;
