export default interface Params {
  readonly file: string | boolean;
  readonly github: boolean;
  readonly msg: boolean;
  readonly link: boolean;
  readonly all: boolean;
  readonly args: string[];
}
