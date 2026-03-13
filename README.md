# Folder Expand Collapse

An [Obsidian](https://obsidian.md) plugin that adds recursive expand and collapse to individual folders in the file explorer.

Obsidian's built-in expand/collapse buttons operate on the entire vault. This plugin lets you target a specific folder — expand everything inside it without blowing up your whole navigation tree, or collapse it back down without resetting every other folder you had open.

## Usage

### Right-click

Right-click any folder in the file explorer to see two new menu items:

- **Expand all children** — recursively expands the folder and every subfolder inside it
- **Collapse all children** — recursively collapses the folder and everything inside it

### Alt+Click

Hold `Alt` and click a folder to recursively expand or collapse it. The folder toggles normally, then all children follow.

## Installation

### From Community Plugins

1. Open Settings → Community plugins → Browse
2. Search for "Folder Expand Collapse"
3. Click Install, then Enable

### Manual

1. Download `main.js` and `manifest.json` from the [latest release](https://github.com/tyrannikal/obsidian-folder-expand-collapse/releases)
2. Create a folder at `<vault>/.obsidian/plugins/folder-expand-collapse/`
3. Copy both files into that folder
4. Reload Obsidian and enable the plugin in Settings → Community plugins

## Building from source

```fish
git clone https://github.com/tyrannikal/obsidian-folder-expand-collapse.git
cd obsidian-folder-expand-collapse
npm install
npm run build
```

This produces `main.js` in the project root.
