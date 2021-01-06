import { Commandable } from './';

export interface SubCommandable {
  readonly subCommands: Commandable[];

  fetchSubHelp(prefix: string): string;
}