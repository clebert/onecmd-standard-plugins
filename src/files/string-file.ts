import type {Files, ModFile} from 'onecmd';
import {File} from './file';

export class StringFile extends File<string> {
  append(
    create: (content: string, otherFiles: Files) => string,
  ): ModFile<string> {
    const {path, is} = this.init;

    return {
      type: `mod`,
      path,
      is,
      update: (content, otherFiles) => content + create(content, otherFiles),
    };
  }
}
