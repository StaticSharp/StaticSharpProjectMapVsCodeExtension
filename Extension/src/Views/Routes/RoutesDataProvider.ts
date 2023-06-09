import path = require('path');
import * as vscode from 'vscode';
import { ProjectMap } from '../../ProjectMapData/LanguageServerContract/ProjectMap';
import { ProjectMapDataProvider } from '../../ProjectMapData/ProjectMapDataProvider';
import { RouteTreeItem as RouteTreeItem } from './RouteTreeItem';
import { SimpleLogger } from '../../SimpleLogger';

export class RoutesDataProvider implements vscode.TreeDataProvider<RouteTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<RouteTreeItem | undefined | null | void> = new vscode.EventEmitter<RouteTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<RouteTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;
    
    public projectMap?: ProjectMap;


    constructor(protected _projectMapDataProvider: ProjectMapDataProvider) {}

    public setData(projectMap?: ProjectMap)
    {
        this.projectMap = projectMap
        this._onDidChangeTreeData.fire();
    }


    getTreeItem(treeItem: RouteTreeItem): vscode.TreeItem {
        return treeItem;
    }

    getChildren(treeItem?: RouteTreeItem): RouteTreeItem[] {
        let result: RouteTreeItem[] = []
        if (treeItem) {
            /*return*/ result = treeItem.model.ChildRoutes.map(c => new RouteTreeItem(c)).
                sort((a,b) => a.model.Name > b.model.Name ? 1 : a.model.Name === b.model.Name? 0: -1)
        } else {
            /*return*/ result = this.projectMap ? [new RouteTreeItem(this.projectMap.Root)] : []
        }

        return result
    }

    getParent(treeItem: RouteTreeItem): RouteTreeItem | undefined
    {
        if (treeItem.model.RelativePathSegments.length === 1) {
            return undefined
        }

        const parentRelativePath = path.join(...treeItem.model.RelativePathSegments.slice(0, -1))
        const parent = this._projectMapDataProvider.routesByPath.get(parentRelativePath)

        if (parent) {
            return new RouteTreeItem(parent)
        }

        throw new Error(`Route with relative path "${parentRelativePath}" does not exist`)
    }
}