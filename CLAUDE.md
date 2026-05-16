# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & apply

```bash
nh os switch          # build and switch to new config
nh os switch --dry    # dry-run (check without applying)
nix flake update      # update all flake inputs
nix flake update <input>  # update a single input (e.g. claude-code-nix)
alejandra .           # format all Nix files (alejandra is the project formatter)
```

New files/directories must be tracked by git before building:
```bash
git add <path>        # required or Nix will error: "path is not tracked by Git"
```

## Architecture

```
flake.nix                       # inputs + single nixosConfigurations.desktop output
hosts/desktop/
  configuration.nix             # system entry point: imports home-manager + modules/system
  home.nix                      # home-manager entry point: enables home modules
  hardware-configuration.nix    # hardware + desktop-specific boot params (AMD GPU, monitors)
modules/
  system/                       # NixOS-level modules (services, boot, users)
    default.nix                 # imports all system modules + sets defaults with lib.mkDefault
  home/                         # home-manager modules (user programs, dotfiles)
    default.nix                 # imports all home modules + nixpkgs.config
secrets/
  secrets.json                  # sops-encrypted secrets (age key at ~/.config/sops/age/keys.txt)
```

### Module pattern

Every module follows the same structure:

```nix
{ pkgs, lib, config, ... }: let
  cfg = config.modules.<name>;
in {
  options.modules.<name>.enable = lib.mkEnableOption "...";
  config = lib.mkIf cfg.enable { ... };
}
```

- System modules live in `modules/system/<name>/default.nix`
- Home modules live in `modules/home/<name>/default.nix`
- Each new module must be added to its respective `default.nix` imports list
- System modules are enabled in `modules/system/default.nix` via `lib.mkDefault true`
- Home modules are enabled in `hosts/desktop/home.nix`
- camelCase for multi-word option names (e.g. `modules.claudeCode`, `modules.shellEnhancements`)

### Key special args

Passed to all NixOS modules via `specialArgs`: `user`, `host`, `language`, `timeZone`, `inputs`, `system`.  
Passed to home-manager modules via `extraSpecialArgs`: `user`, `inputs`.

### Theming

Stylix (`inputs.stylix`) manages colors, fonts, wallpaper, cursor, and opacity for all supported programs (bat, hyprlock, gtk, kitty, etc.). **Do not set theme-related options that Stylix already controls** — this causes "defined multiple times" errors. Current scheme: `tokyo-night-dark` (base16), dark polarity, Monaspace Nerd Font monospace, Bibata-Modern-Classic cursor.

The exception is `targets.plymouth.enable = false` in `modules/system/stylix/default.nix` — Plymouth theme is managed manually (`boot.plymouth.theme`).

### Secrets (sops-nix)

Secrets are encrypted in `secrets/secrets.json` with age. The `modules/system/sops` module decrypts them at boot and writes a JSON file to `/var/lib/sopsjson/secrets.json` via a dedicated system user, making secrets available to services that need them (e.g. `weather_api_key`).

### AI stack

- `services.ollama` uses `pkgs.ollama-rocm` (not `acceleration = "rocm"` which is deprecated)
- `HSA_OVERRIDE_GFX_VERSION = "10.3.0"` is required for RX 6950 XT (RDNA2/gfx1030)
- Open WebUI runs on `localhost:8080`, accessible via `Super+I` in Hyprland
- After first switch, pull models:
  ```bash
  ollama pull qwen3.6:35b-a3b-iq3_s   # primary — if IQ3_S unavailable try: ollama pull qwen3.6:35b-a3b
  ollama pull deepseek-r1:14b          # secondary (reasoning/math)
  # fallback if MoE unstable on ROCm:
  ollama pull qwen3:14b
  ```
- Default model in Open WebUI: qwen3.6:35b-a3b (IQ3_S ~11.5GB VRAM); deepseek-r1:14b for reasoning tasks
