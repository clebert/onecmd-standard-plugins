import type {Files, ModFile, NewFile} from 'onecmd';

export type FileInit<TContent> = Omit<NewFile<TContent>, 'type' | 'create'>;

export class File<TContent> {
  constructor(readonly init: FileInit<TContent>) {}

  new(create: (otherFiles: Files) => TContent): NewFile<TContent> {
    return {...this.init, type: 'new', create};
  }

  override(
    create: (content: TContent, otherFiles: Files) => TContent
  ): ModFile<TContent> {
    const {path, is} = this.init;

    return {type: 'mod', path, is, update: create};
  }
}
