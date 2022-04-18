/// <reference types="vite/client" />

declare interface Window {
  $message: Function;
}

interface Menu {
  name: string;
  path: string;
  callback: Function;
}
