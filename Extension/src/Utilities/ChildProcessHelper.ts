import * as vscode from 'vscode';
import * as cross_spawn from 'cross-spawn';
import { LogLevel, SimpleLogger } from '../SimpleLogger';

export interface ExecutionResult
{
    exitCode?: number
    output: string
}

/**
 * Helper for managing separate child (currently Windows only) process. 
 * Used to launch and communicate with language server.
 */
export class ChildProcessHelper
{
    protected constructor() {}    

    static async execute(command: string, args: ReadonlyArray<string>, cwd?: string) : Promise<ExecutionResult>
    {
        SimpleLogger.log(`>>> cross_spawn.command:"${command}"`, LogLevel.debug)
        SimpleLogger.log(`>>> cross_spawn.args:"${args.join(" ")}"`, LogLevel.debug)
        SimpleLogger.log(`>>> cross_spawn.cwd:"${cwd}"`, LogLevel.debug)

        let resolveResult: (value: ExecutionResult) => void
        const resultPromise = new Promise<ExecutionResult>(resolve => {
            resolveResult = resolve
        });

        let childProcess = cross_spawn.spawn(
            command,
            args,
            {
                shell: true, // without shell nothing works
                cwd : cwd
            }
        )

        let output = "";
        childProcess.stdout!.on("data", (data: Buffer) => {
            SimpleLogger.log(`>>> childProcess.stdout:"${data}"`, LogLevel.debug)
            output += data
        });
        childProcess.stderr!.on("data", (data: Buffer) => {
            SimpleLogger.log(`>>> childProcess.stderr:"${data}"`, LogLevel.debug)
          output += data
        });

        childProcess.on('exit', (exitCode: number) => {
            SimpleLogger.log(`>>> childProcess.exit, exitCode:"${exitCode}"`, LogLevel.debug)
            resolveResult({
                exitCode : exitCode,
                output : output.trim()
            })
        });

        childProcess.on('error', (err: Error) => {
            SimpleLogger.log(`>>> childProcess.error, name:"${err.name}"`, LogLevel.debug)
            SimpleLogger.log(`>>> childProcess.error, message:"${err.message}"`, LogLevel.debug)
            SimpleLogger.log(`>>> childProcess.error, stack:"${err.stack}"`, LogLevel.debug)
            resolveResult({
                exitCode : undefined,
                output : err.message
            })
        });

        return resultPromise
    }
}

