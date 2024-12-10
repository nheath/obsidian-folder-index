import { TFolder, Notice, App } from 'obsidian';
import FolderIndexPlugin from "../main";
import { getIndexFilePath } from 'src/types/Utilities';

export class ContextMenuModule {
	// eslint-disable-next-line no-unused-vars
    constructor(private app: App, private plugin: FolderIndexPlugin) {
    }

    addFolderContextMenu() {
        this.app.workspace.on("file-menu", (menu, folder) => {
            if (folder instanceof TFolder) {
                const indexFileForFolder = getIndexFilePath(folder.path, this.plugin.settings);

                if (!this.doesIndexFileExistForFolder(indexFileForFolder)) {
                    menu.addItem((item) => {
                        item.setTitle("Create Index File")
                            .setIcon("any-icon")
                            .onClick(() => this.createIndexFileForFolder(indexFileForFolder));
                    });
                }
            }
        });
    }

    private doesIndexFileExistForFolder(fullPath:string): boolean {
        return this.app.vault.getAbstractFileByPath(fullPath) != null
    }

    private async createIndexFileForFolder(indexFileForFolder: string) {
        const filePath = indexFileForFolder.substring(0, indexFileForFolder.lastIndexOf("/"))
        try {
			//todo testing, what should {{folder}} be replaced with?
            // Create a new markdown file
			const indexFile = getIndexFilePath(indexFileForFolder, this.plugin.settings);
            const newFile = await this.app.vault.create(
				indexFileForFolder,
				this.plugin.settings.indexFileInitText.replace("{{folder}}", indexFile));

            // Notify the user
            new Notice(`File "${newFile.name}" created successfully in folder "${newFile.path}".`);
			// eslint-disable-next-line no-console
            console.log(`File created at path: ${newFile.path}`);
        } catch (error) {
			// eslint-disable-next-line no-console
            console.error(`Failed to create file at path: ${filePath}`, error);
            new Notice("Failed to create file. See console for details.");
        }
    }
}
