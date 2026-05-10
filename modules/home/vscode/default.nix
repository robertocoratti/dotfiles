{
  inputs,
  pkgs,
  lib,
  config,
  ...
}: let
  cfg = config.modules.vscode;
in {
  options.modules.vscode = {
    enable = lib.mkEnableOption "Enable vscode";
  };

  config = lib.mkIf cfg.enable {
    programs.vscode = {
      enable = true;

      profiles.default = {
        userSettings = {
          "window.titleBarStyle" = "custom";

          "workbench.iconTheme" = "material-icon-theme";
          "workbench.startupEditor" = "none";
          "workbench.editor.decorations.colors" = true;
          "workbench.editor.decorations.badges" = true;

          "material-icon-theme.activeIconPack" = "react_redux";
          "files.autoSave" = "afterDelay";
          "files.autoSaveDelay" = 800;

          "editor.formatOnSave" = true;
          "editor.fontLigatures" = true;
          "editor.tabSize" = 2;
          "editor.selectionClipboard" = false;
          "editor.suggestSelection" = "first";
          "editor.linkedEditing" = true;
          "editor.bracketPairColorization.enabled" = true;

          "git.decorations.enabled" = true;

          # cpp
          "C_Cpp.intelliSenseEngine" = "disabled";
          "clangd.path" = "clangd";
          "clangd.arguments" = [
            "--background-index"
            "--clang-tidy"
            "--completion-style=detailed"
            "--header-insertion=iwyu"
          ];
          "cmake.generator" = "Ninja";
          "cmake.buildDirectory" = "\${workspaceFolder}/build";
          "cmake.configureOnOpen" = true;
          "cmake.exportCompileCommandsFile" = true;
          "[cpp]" = {"editor.defaultFormatter" = "xaver.clang-format";};
          "[c]" = {"editor.defaultFormatter" = "xaver.clang-format";};
          "clang-format.style" = "LLVM";

          # rust
          "rust-analyzer.cargo.features" = "all";
          "rust-analyzer.checkOnSave" = true;
          "[rust]" = {"editor.defaultFormatter" = "rust-lang.rust-analyzer";};

          # go
          "go.useLanguageServer" = true;
          "[go]" = {"editor.defaultFormatter" = "golang.go";};

          # python
          "[python]" = {"editor.defaultFormatter" = "ms-python.python";};

          # typescript / javascript
          "[typescript]" = {"editor.defaultFormatter" = "esbenp.prettier-vscode";};
          "[typescriptreact]" = {"editor.defaultFormatter" = "esbenp.prettier-vscode";};
          "[javascript]" = {"editor.defaultFormatter" = "esbenp.prettier-vscode";};
          "[javascriptreact]" = {"editor.defaultFormatter" = "esbenp.prettier-vscode";};
          "[json]" = {"editor.defaultFormatter" = "esbenp.prettier-vscode";};
          "[html]" = {"editor.defaultFormatter" = "esbenp.prettier-vscode";};
          "[css]" = {"editor.defaultFormatter" = "esbenp.prettier-vscode";};
        };

        extensions = with pkgs.vscode-extensions; [
          pkief.material-icon-theme
          bbenoist.nix

          # cpp
          llvm-vs-code-extensions.vscode-clangd
          ms-vscode.cpptools
          ms-vscode.cmake-tools
          vadimcn.vscode-lldb
          xaver.clang-format

          # rust
          rust-lang.rust-analyzer

          # go
          golang.go

          # python
          ms-python.python

          # typescript / javascript
          esbenp.prettier-vscode
          dbaeumer.vscode-eslint

          # zig
          ziglang.vscode-zig
        ];
      };
    };

    home.packages = with pkgs; [
      clang
      clang-tools
      cmake
      ninja
      lldb
      gdb
    ];
  };
}
