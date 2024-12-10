import {TFile} from "obsidian";
import FolderIndexPlugin from "../main";
import { PluginSetting } from "src/models/PluginSettingsTab";

export function isIndexFileWithFile(file: TFile, settings: PluginSetting) {
	return isIndexFile(file.path, settings)
}

export function isIndexFile(path: string, settings: PluginSetting) {
	if (isExcludedPath(path))
		return false
	const pathParts = path.split(/\//)
	if (pathParts[0] == FolderIndexPlugin.PLUGIN.settings.rootIndexFile)
		return true
	if (pathParts.length < 2)
		return false
	const fileName = pathParts[pathParts.length - 1]
	const expectedIndexFileName = getIndexFilePath(path, settings).split("/").pop();
	return fileName == expectedIndexFileName;
}

export function isExcludedPath(path: string) {
	for (const excludedFolder of FolderIndexPlugin.PLUGIN.settings.excludeFolders) {
		if (excludedFolder == "")
			continue
		if (RegExp(`^${excludedFolder}$`).test(path))
			return true;
	}
	return false
}

export function getIndexFilePath(path: string, settings: PluginSetting) {
	const folderName = String(path.split("/").pop());

	if (settings.indexFileUserSpecified) {
		const template = settings.indexFilename
			.replace("{{folder}}", folderName);

		return path + "/" + template + ".md";
	} else {
		return path + "/" + folderName + ".md";
	}
}
