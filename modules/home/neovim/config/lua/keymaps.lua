vim.g.mapleader = " "
vim.g.maplocalleader = " "

local map = vim.keymap.set

map("n", "<C-h>", "<C-w>h")
map("n", "<C-j>", "<C-w>j")
map("n", "<C-k>", "<C-w>k")
map("n", "<C-l>", "<C-w>l")

map("n", "<S-h>", "<cmd>bprevious<cr>")
map("n", "<S-l>", "<cmd>bnext<cr>")

map("v", "<", "<gv")
map("v", ">", ">gv")

map("n", "<Esc>", "<cmd>nohlsearch<cr>")
map("n", "<C-s>", "<cmd>w<cr>")
map("i", "<C-s>", "<Esc><cmd>w<cr>")
map("n", "<leader>q", "<cmd>q<cr>")

-- Move lines up/down
map("n", "<A-j>", "<cmd>m .+1<cr>==")
map("n", "<A-k>", "<cmd>m .-2<cr>==")
map("v", "<A-j>", ":m '>+1<cr>gv=gv")
map("v", "<A-k>", ":m '<-2<cr>gv=gv")
