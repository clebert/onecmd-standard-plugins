import type {Files, ModFile} from 'onecmd';
import {File} from './file';

export class StringArrayFile extends File<readonly string[]> {
  append(
    create: (content: readonly string[], otherFiles: Files) => readonly string[]
  ): ModFile<readonly string[]> {
    const {path, is} = this.init;

    return {
      type: `mod`,
      path,
      is,
      update: (content, otherFiles) => [
        ...content,
        ...create(content, otherFiles),
      ],
    };
  }
}
