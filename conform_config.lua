return {
  "stevearc/conform.nvim",
  opts = {
    formatters_by_ft = {
      javascript = { "prettierd", "prettier" },
      javascriptreact = { "prettierd", "prettier" },
      typescript = { "prettierd", "prettier" },
      typescriptreact = { "prettierd", "prettier" },
      css = { "prettierd", "prettier" },
      html = { "prettierd", "prettier" },
      scss = { "prettierd", "prettier" },
    },
    formatters = {
      prettier = {
        command = vim.fn.stdpath("data") .. "/mason/bin/prettierd",
        args = { "--stdin-filepath", "$FILENAME" },
        cwd = require("conform.util").root_file({ ".prettierrc", ".prettierrc.json", "prettier.config.js" }),
      },
    },
  },
}