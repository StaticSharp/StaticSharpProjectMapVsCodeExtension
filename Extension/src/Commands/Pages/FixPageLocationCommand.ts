import { PageTreeItem } from '../../Views/Pages/PageTreeItem';
import * as vscode from 'vscode';
import path = require("path");

/**
 * DEPRECATED
 * Moves and renames page file so that its name and path match page class name and namespace
 */
export class FixPageLocationCommand
{
    static readonly commandName = 'staticSharp.fixPageLocation'

    callback = async (pageTreeItem: PageTreeItem) => {
        let userResponse = await vscode.window.showInformationMessage(`Move page "${pageTreeItem.label}" to "${pageTreeItem.model.ExpectedFilePath}"?`, { modal: true }, "Yes", "No")
        if (userResponse !== "Yes") { return }

        await vscode.commands.executeCommand("vscode.open", vscode.Uri.file(pageTreeItem.model.FilePath))
        try {
            if (!await vscode.window.activeTextEditor?.document.save()) {
                throw new Error('error on saving changes') }
            await vscode.workspace.fs.rename(vscode.Uri.file(pageTreeItem.model.FilePath), vscode.Uri.file(pageTreeItem.model.ExpectedFilePath))

        } catch (err)
        {
            vscode.window.showErrorMessage(`Failed: ${err}`, { modal: true })
            return
        }

        const sourceDirUri = vscode.Uri.file(path.dirname(pageTreeItem.model.FilePath))
        
        const dirContent = await vscode.workspace.fs.readDirectory(sourceDirUri)
        if (dirContent.length === 0)
        {
            userResponse = await vscode.window.showInformationMessage(`Source directory became empty. Remove it?`, { modal: true }, "Yes", "No")
            if (userResponse === "Yes")
            {
                await vscode.workspace.fs.delete(sourceDirUri, {recursive: true})
            }
        }
    }
}