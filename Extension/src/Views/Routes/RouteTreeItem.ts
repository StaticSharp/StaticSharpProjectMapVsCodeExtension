import path = require("path");
import * as vscode from 'vscode';
import { GlobalDecorationProvider } from '../GlobalDecorationProvider';
import { RouteMap } from "../../ProjectMapData/LanguageServerContract/RouteMap";
import { EmptyCommand } from "../../Commands/EmptyCommand";

export class RouteTreeItem extends vscode.TreeItem
{
    constructor(
        public model: RouteMap,
        
    ) {
        super(model.Name, model.ChildRoutes.length>0 ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.None)
        
        this.iconPath = new vscode.ThemeIcon("type-hierarchy-sub")
        this.resourceUri = vscode.Uri.parse(`route://${path.join(...model.RelativePathSegments)}`)
        // looks like no way to remove tooltip if resourceUri!==undefined
        // id resourceUri===undefined, no way to decorate

        let isInconsistent = model.Pages.some(r => r.Errors.length > 0)

        this.tooltip = isInconsistent 
            ?  new vscode.MarkdownString(path.join(...model.RelativePathSegments) + "  \n**Some pages have errors**")
            : path.join(...model.RelativePathSegments)
        
        GlobalDecorationProvider.singleton.updateDecoration(this.resourceUri, 
            isInconsistent ?
            {
                // badge: "⇐",
                color: new vscode.ThemeColor("charts.red"), 
            }
            : undefined)

        // command is required to prevent expand/collapse on click
        this.command = {
            title: "",
            command: EmptyCommand.commandName,
            arguments: []
        }
    }
}