import * as vscode from 'vscode';
import { FileTextRange } from '../ProjectMapData/LanguageServerContract/FileTextRange';

export class Mapper{
    static toRange (fileTextRange: FileTextRange){
        return new vscode.Range(fileTextRange.StartLine, 
            fileTextRange.StartColumn,
            fileTextRange.EndLine, 
            fileTextRange.EndColumn)
    }
    
}