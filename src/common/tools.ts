import { Menu } from "./interface";

export const getMenus = (router: any, modules: Array<Menu>) => {

  let menus = '';
  modules.forEach(page => {
    const { name, path, callback } = page;
    const menu = `<li data-path="${path}">${name}</li>`;
    menus += menu;

    router.register(path, callback);
  });

  return menus;
}

export const drawTextMessage = (message: string) => {
  const sketchpad = document.querySelector('#sketchpad') as HTMLCanvasElement;
  const context = sketchpad.getContext('2d') as CanvasRenderingContext2D;

  // 获取 canvas 画布宽高
  const { clientWidth: sketchpadWidth, clientHeight: sketchpadHeight } = sketchpad;
  // 获取设备 dpr
  const dpr = window.devicePixelRatio || 1;
  // 解决高清屏模糊问题
  sketchpad.width = dpr * sketchpadWidth;
  sketchpad.height = dpr * sketchpadHeight;
  context.scale(dpr, dpr);

  // 绘制文本
  context.font = "30px sans-serif";
  context.fillStyle = '#fff';
  context.textAlign = "center";
  context.textBaseline = 'middle'
  context.fillText(message, sketchpadWidth / dpr, sketchpadHeight / dpr);
}

export const githubRepo = 'https://github.com/xjGafi/webgpu-samples';