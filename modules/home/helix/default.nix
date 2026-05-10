{
  inputs,
  pkgs,
  lib,
  config,
  ...
}: let
  cfg = config.modules.helix;
in {
  options.modules.helix = {
    enable = lib.mkEnableOption "Enable helix";
    # options
  };

  config = lib.mkIf cfg.enable {
    programs.helix = {
      enable = true;
      defaultEditor = true;

      settings = {
        editor = {
          line-number = "relative";
          cursorline = true;
          true-color = true;
          color-modes = true;

          soft-wrap = {
            enable = true;
          };

          lsp = {
            display-messages = true;
            auto-signature-help = true;
          };
        };

        keys = {
          normal = {
            "C-s" = ":w";
            "C-q" = ":q";
            "C-/" = "toggle_comments";
          };

          insert = {"C-s" = ":w";};
          select = {"C-s" = ":w";};
        };
      };

      languages = {
        language = [
          {
            name = "cpp";
            scope = "source.cpp";
            file-types = ["cpp" "cxx" "cc" "hpp" "hxx" "hh"];
            roots = ["compile_commands.json" "CMakeLists.txt"];
            language-servers = ["clangd"];
            formatter = {
              command = "clang-format";
              args = ["-style=LLVM"];
            };
          }
          {
            name = "c";
            scope = "source.c";
            file-types = ["c" "h"];
            roots = ["compile_commands.json" "CMakeLists.txt"];
            language-servers = ["clangd"];
            formatter = {
              command = "clang-format";
              args = ["-style=LLVM"];
            };
          }
          {
            name = "python";
            language-servers = ["pyright"];
          }
          {
            name = "typescript";
            auto-format = true;
            formatter = {
              command = "prettier";
              args = ["--parser" "typescript"];
            };
          }
          {
            name = "tsx";
            auto-format = true;
            formatter = {
              command = "prettier";
              args = ["--parser" "babel"];
            };
          }
          {
            name = "javascript";
            auto-format = true;
            formatter = {
              command = "prettier";
              args = ["--parser" "babel"];
            };
          }
          {
            name = "jsx";
            auto-format = true;
            formatter = {
              command = "prettier";
              args = ["--parser" "babel"];
            };
          }
          {
            name = "zig";
            language-servers = ["zls"];
          }
          {
            name = "elixir";
            language-servers = ["elixir-ls"];
          }
        ];

        language-server = {
          clangd = {
            command = "clangd";
            args = [
              "--background-index"
              "--clang-tidy"
              "--all-scopes-completion"
              "--completion-style=detailed"
            ];
          };

          pyright = {
            command = "pyright-langserver";
            args = ["--stdio"];
          };

          zls = {command = "zls";};

          elixir-ls = {command = "elixir-ls";};
        };
      };
    };

    home.packages = with pkgs; [
      clang
      clang-tools
      rust-analyzer
      gopls
      typescript-language-server
      prettier
      pyright
      zls
      elixir-ls
    ];
  };
}
