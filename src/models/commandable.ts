import { Command } from './command';

export interface Commandable {
  readonly aliases: string[];
  
  fetchHelp(prefix: string): string;
  executeCommand(parsedMessage: Command): Promise<void>;
  userCanRun(parsedMessage: Command): boolean;
}
