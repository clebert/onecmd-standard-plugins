import deepmerge from 'deepmerge';
import type {Files, ModFile} from 'onecmd';
import {File} from './file';

export type MergeOptions =
  | {readonly deep: false}
  | {readonly deep: true; readonly replaceArrays?: boolean};

export class ObjectFile extends File<object> {
  merge(
    create: (content: object, otherFiles: Files) => object,
    options: MergeOptions = {deep: true},
  ): ModFile<object> {
    const {path, is} = this.init;

    const update = (contentA: object, otherFiles: Files): object => {
      const contentB = create(contentA, otherFiles);

      return options.deep
        ? deepmerge(contentA, contentB, {
            arrayMerge: (target, source) =>
              options.replaceArrays ? source : [...target, ...source],
          })
        : {...contentA, ...contentB};
    };

    return {type: `mod`, path, is, update};
  }
}
