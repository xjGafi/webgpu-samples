export interface RouterObject {
  [key: string]: any
}

export interface Menu {
  name: string;
  path: string;
  callback: Function;
}