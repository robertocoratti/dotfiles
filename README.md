# dotfiles

NixOS configuration — impermanence (tmpfs root), Hyprland, Nord theming, AMD GPU (RX 6950 XT).

## Layout

```
flake.nix                         inputs + nixosConfigurations.desktop
hosts/desktop/
  default.nix                     host metadata (user, email, timezone, type)
  configuration.nix               system entry point (imports home-manager + modules)
  home.nix                        home-manager entry point (enables home modules)
  hardware-configuration.nix      hardware + AMD GPU / monitor params
  disk-config.nix                 disko partition layout
modules/
  system/                         NixOS-level modules (services, boot, users)
    default.nix                   imports all + sets lib.mkDefault enables
  home/                           home-manager modules (programs, dotfiles)
    default.nix                   imports all
```

---

## Fresh install

### 1. Boot NixOS ISO and connect to the internet

```bash
# Wi-Fi
sudo systemctl start wpa_supplicant
nmcli device wifi connect "<SSID>" password "<password>"

# Verify
ping -c 1 nixos.org
```

### 2. Clone the repo

```bash
nix-shell -p git
git clone https://github.com/Korazza/dotfiles /tmp/dotfiles
cd /tmp/dotfiles
```

### 3. Set up SOPS age key

The system uses SOPS (age encryption) for secrets, including the user password.
The age key must be in place before `nixos-install` or activation will fail.

```bash
# Migrating from another machine: copy the existing keys.txt
# Setting up fresh: generate a new key, then add its public key to .sops.yaml and re-encrypt
age-keygen -o /tmp/keys.txt
cat /tmp/keys.txt   # copy the "public key:" line → add to .sops.yaml → sops updatekeys secrets/secrets.yaml

sudo mkdir -p /mnt/persist/home/robertocoratti/.config/age
sudo cp /tmp/keys.txt /mnt/persist/home/robertocoratti/.config/age/keys.txt
```

### 4. Partition with disko

> **Check device names first:** `lsblk`
>
> The config expects `/dev/sda` (main drive: 500M ESP + rest as /persist)
> and `/dev/nvme1n1` (NTFS data SSD mounted at `/media/robertocoratti/ssd`).
> Edit `hosts/desktop/disk-config.nix` if your device names differ.

```bash
sudo nix --extra-experimental-features "nix-command flakes" run \
  github:nix-community/disko -- \
  --mode disko \
  hosts/desktop/disk-config.nix
```

Disko partitions and mounts everything under `/mnt` automatically.

### 5. Generate hardware config

```bash
sudo nixos-generate-config --no-filesystems --root /mnt
sudo cp /mnt/etc/nixos/hardware-configuration.nix hosts/desktop/hardware-configuration.nix
# Review: AMD GPU, monitor layout, kernel modules
git add hosts/desktop/hardware-configuration.nix
```

### 6. Install

```bash
sudo nixos-install --flake .#desktop --root /mnt
reboot
```

### 7. First boot — post-install setup

```bash
# SSH key (required for git signing and GitHub)
ssh-keygen -t ed25519 -C "corattiroberto@gmail.com"
cat ~/.ssh/id_ed25519.pub   # add to GitHub: Settings → SSH and GPG keys → New SSH key

# Git commit signing
echo "corattiroberto@gmail.com namespaces=\"git\" $(cat ~/.ssh/id_ed25519.pub)" \
  >> ~/.config/git/allowed_signers

# GitHub CLI
gh auth login

# Tailscale (mesh VPN)
sudo tailscale up

# Local LLM models
ollama pull qwen3.6:35b-a3b-iq3_s   # primary (~11.5GB VRAM)
ollama pull deepseek-r1:14b          # reasoning / math
```

---

## Disk layout

| Device | Partition | Size | FS | Mount |
|--------|-----------|------|----|-------|
| `/dev/sda` | ESP | 500M | FAT32 | `/boot` |
| `/dev/sda` | persist | 100% | ext4 | `/persist` |
| `/dev/nvme1n1` | data | 100% | NTFS | `/media/robertocoratti/ssd` |

**Impermanence:** root is tmpfs (2G, wiped on every boot).
`/nix` and `/home` are bind-mounted from `/persist` — all user data persists automatically.

---

## Day-to-day system management

```bash
nh os switch               # build and apply new config
nh os switch --dry         # dry-run (check without applying)
nix flake update           # update all flake inputs
nix flake update <input>   # update one input (e.g. home-manager)
alejandra .                # format all Nix files
```

New files must be tracked before building:

```bash
git add <path>   # untracked files cause "path not in Nix store" errors
```

---

## Hyprland keybindings

### Apps

| Key | App |
|-----|-----|
| `Super + Enter` | Kitty (terminal) |
| `Super + B` | Brave (browser) |
| `Super + E` | Nautilus (file manager) |
| `Super + V` | VS Code |
| `Super + C` | Vesktop (Discord) |
| `Super + M` | Spotify |
| `Super + O` | Obsidian |
| `Super + T` | btop (system monitor) |
| `Super + D` | App launcher |
| `Super + A` | ChatGPT (webapp) |
| `Super + Y` | YouTube (webapp) |
| `Super + W` | WhatsApp (PWA via .desktop entry) |
| `Super + I` | Open WebUI / Ollama (localhost:8080) |

### Window management

| Key | Action |
|-----|--------|
| `Super + Esc` | Close window |
| `Super + F` | Toggle float |
| `Super + Space` | Fullscreen |
| `Super + K` | Toggle group |
| `Super + Tab` | Next window in group |
| `Super + ↑↓←→` | Move focus |
| `Super + 1–0` | Switch to workspace |
| `Alt + 1–0` | Move window to workspace |
| `Super + scroll` | Switch workspace |
| `Super + drag (LMB)` | Move window |
| `Super + drag (RMB)` | Resize window |

### System

| Key | Action |
|-----|--------|
| `Super + L` | Lock screen |
| `Super + ,` | Settings panel |
| `Super + S` | Control center |
| `Super + .` | Emoji picker |
| `Super + Shift + V` | Clipboard history |
| `Print` | Screenshot — select area, copy to clipboard |
| `Super + Shift + S` | Screenshot — select area, copy to clipboard |
| `Super + Print` | Screenshot — full screen, save to file |

Media keys (volume, brightness, playback) work via hardware XF86 keys.

---

## Shell

Fish with:

| Alias | Expands to |
|-------|-----------|
| `ls` | `eza --icons --git-ignore` |
| `la` | `eza -a` (include hidden) |
| `ll` | `eza -l` with git status |
| `lla` | `eza -la` with git status |
| `cat` | `bat` (syntax highlighting) |

Other tools:

| Command | Purpose |
|---------|---------|
| `z <dir>` | Jump to directory (zoxide) |
| `Ctrl+R` | Fuzzy history search (atuin) |
| `, <bin>` | Run any binary without installing (comma) |
| `direnv` | Auto per-project env (`.envrc` + `nix-direnv`) |
| `zellij` | Terminal multiplexer |
| `just` | Task runner (`Justfile`) |
| `lazygit` | TUI git client |
| `httpie` | HTTP client (`http GET https://...`) |

---

## Apps

| App | Purpose |
|-----|---------|
| Brave | Browser |
| VS Code | Editor — LSP, heavy development |
| Neovim | Terminal editor (lazy.nvim, lightweight) |
| Kitty | Terminal |
| Obsidian | Notes |
| Vesktop | Discord |
| Spotify | Music |
| WhatsApp | Brave PWA (`Super+W`) |
| Nautilus | File manager |
| btop | System monitor |
| mpv | Video player (Vulkan, VAAPI hardware decoding) |
| imv | Image viewer |
| Bitwarden | Password manager |
| LibreOffice | Office suite |
| Ollama + Open WebUI | Local LLM inference (ROCm/AMD) |
| Podman | Container runtime (docker-compatible) |

---

## Local LLM (Ollama + Open WebUI)

Open WebUI runs at `http://localhost:8080` — open with `Super+I`.

```bash
ollama pull qwen3.6:35b-a3b-iq3_s   # primary (~11.5GB VRAM, IQ3_S quant)
ollama pull deepseek-r1:14b          # reasoning / math
# Fallback if MoE is unstable on ROCm:
ollama pull qwen3:14b
```

The AI module sets `HSA_OVERRIDE_GFX_VERSION=10.3.0` for RX 6950 XT (RDNA2/gfx1030).

---

## Theming

[Stylix](https://github.com/danth/stylix) manages colors, fonts, wallpaper, cursor, and opacity
for all supported apps automatically.

- Scheme: **Nord** (base16, base02 override `5c6e82`)
- Monospace font: Monaspace Nerd Font
- Cursor: Bibata-Modern-Classic
- Boot theme: `cuts_alt` (Plymouth, managed separately)

Do not set theme-related options that Stylix already controls — it causes "defined multiple times" errors.
