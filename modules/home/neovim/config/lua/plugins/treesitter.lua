return {
  {
    "nvim-treesitter/nvim-treesitter",
    build = ":TSUpdate",
    config = function()
      require("nvim-treesitter.configs").setup({
        ensure_installed = {
          "lua", "nix", "rust", "go", "python",
          "typescript", "javascript", "tsx", "json",
          "yaml", "toml", "markdown", "bash", "c",
        },
        highlight = { enable = true },
        indent = { enable = true },
      })
    end,
  },
}
