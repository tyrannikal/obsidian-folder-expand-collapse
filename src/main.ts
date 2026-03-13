import { Plugin, TFolder, TAbstractFile, WorkspaceLeaf } from "obsidian";

interface FileItem {
	collapsed: boolean;
	setCollapsed(collapsed: boolean): void;
}

interface FileExplorerView {
	fileItems: Record<string, FileItem>;
}

export default class FolderExpandCollapsePlugin extends Plugin {
	async onload() {
		this.registerContextMenu();
		this.registerAltClick();
	}

	private registerContextMenu() {
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				if (!(file instanceof TFolder)) return;

				menu.addItem((item) => {
					item.setTitle("Expand all children")
						.setIcon("chevrons-down-up")
						.onClick(() => this.setCollapsedRecursive(file, false));
				});

				menu.addItem((item) => {
					item.setTitle("Collapse all children")
						.setIcon("chevrons-up-down")
						.onClick(() => this.setCollapsedRecursive(file, true));
				});
			})
		);
	}

	private registerAltClick() {
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			if (!evt.altKey) return;

			const target = evt.target as HTMLElement;
			const navFolder = target.closest(".nav-folder");
			if (!navFolder) return;

			const titleEl = navFolder.querySelector(
				":scope > .nav-folder-title"
			);
			if (!titleEl) return;

			// Only trigger if clicking the title row or collapse indicator
			if (!target.closest(".nav-folder-title")) return;

			const folderPath = titleEl.getAttribute("data-path");
			if (folderPath === null) return;

			const folder = this.app.vault.getAbstractFileByPath(folderPath);
			if (!(folder instanceof TFolder)) return;

			evt.preventDefault();
			evt.stopPropagation();

			const fileExplorer = this.getFileExplorer();
			if (!fileExplorer) return;

			const fileItem = fileExplorer.fileItems[folderPath];
			if (!fileItem) return;

			// Toggle: if currently collapsed, expand all children; otherwise collapse all
			const shouldCollapse = !fileItem.collapsed;
			this.setCollapsedRecursive(folder, shouldCollapse);
		});
	}

	private setCollapsedRecursive(folder: TFolder, collapsed: boolean) {
		const fileExplorer = this.getFileExplorer();
		if (!fileExplorer) return;

		const setChildren = (parent: TFolder) => {
			for (const child of parent.children) {
				if (child instanceof TFolder) {
					const item = fileExplorer.fileItems[child.path];
					if (item) {
						item.setCollapsed(collapsed);
					}
					setChildren(child);
				}
			}
		};

		// When expanding, also expand the target folder itself
		if (!collapsed) {
			const targetItem = fileExplorer.fileItems[folder.path];
			if (targetItem) {
				targetItem.setCollapsed(false);
			}
		}

		setChildren(folder);
	}

	private getFileExplorer(): FileExplorerView | null {
		const leaves: WorkspaceLeaf[] =
			this.app.workspace.getLeavesOfType("file-explorer");
		if (leaves.length === 0) return null;
		return leaves[0].view as unknown as FileExplorerView;
	}
}
