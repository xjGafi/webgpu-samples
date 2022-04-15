import { Menu } from "./interface";

export const isFunction = (fn: Function) => {
  const type = Object.prototype.toString.call(fn);

  if (type === '[object Function]' || type === '[object AsyncFunction]') {
    return true;
  }

  return false;
}

export const getMenus = (router: any, modules: Array<Menu>) => {
  let menus = '';
  modules.forEach(page => {
    const { name, path, callback } = page;
    const menu = `<li id="${path.slice(1)}">${name}</li>`;
    menus += menu;

    router.register(path, callback);
    router.register('/', () => { drawTextMessage('Have Fun ;-)') });
    router.register('404', () => { drawTextMessage('404 Page Not Found') });
  });

  return menus;
}

export const handleRouteChange = (githubRepo: string) => {
  const pathname = location.pathname.slice(1);

  // 动态设置 a 标签 href
  let githubRepoFile;
  if (pathname) {
    githubRepoFile = `${githubRepo}/blob/master/src/modules/${pathname}.ts`;
  } else {
    githubRepoFile = githubRepo;
  }
  document.querySelector<HTMLLinkElement>("#githubRepoFileLink")!.href = githubRepoFile;

  // 移除旧路由对应菜单 actived 样式
  document.querySelector<HTMLLIElement>('.actived')?.classList.remove('actived');

  // 设置新路由对应菜单 actived 样式
  pathname && document.querySelector<HTMLLIElement>(`#${pathname}`)?.classList.add('actived');
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