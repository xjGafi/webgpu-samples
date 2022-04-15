import { RouterObject } from "./interface";

//构造函数
class Router {
  routers = {} as RouterObject;
  currentPath = '';
  menusId = ''

  constructor(menusId: string) {
    this.menusId = menusId;

    this.init();
  }

  init() {
    window.addEventListener(
      'load',
      this.listenLoad.bind(this),
      false
    );

    window.addEventListener(
      'popstate',
      (event: PopStateEvent) => this.refresh.call(this, event.state.path),
      false
    );
  }

  listenLoad() {
    this.assign.call(this, location.pathname);

    const menus = document.querySelector(`#${this.menusId}`) as HTMLUListElement;
    menus.addEventListener(
      'click',
      (event: MouseEvent) => {
        // 切换路由
        const { dataset: { path } } = event.target as any;

        this.currentPath = location.pathname;
        if (this.currentPath === path) return;

        event.preventDefault();
        this.assign.call(this, path);

        this.pathChange.call(this, path, event.target)
      },
      false
    );
  }

  // 用于注册每个视图
  register(path: string, callback = function () { }) {
    this.routers[path] = callback;
  }

  // 跳转到 path
  assign(path: string) {
    history.pushState({ path }, '', path);
    this.refresh(path);
  }

  // 替换为 path
  replace(path: string) {
    history.replaceState({ path }, '', path);
    this.refresh(path);
  }

  // 通用处理 path 调用回调函数
  refresh(path: string) {
    let handler;
    if (!this.routers.hasOwnProperty(path)) {
      // 没有对应 path
      handler = this.routers['404'] || function () { };
    } else {
      // 有对应 path
      handler = this.routers[path];
    }

    try {
      handler.call(this);
    } catch (error) {
      console.error('🤯', error);
      (this.routers['error'] || function () { }).call(this, error);
    }
  }

  /* TODO(Vincent) 🔫 : 提取出去 2022/04/15 19:48:17 */
  pathChange(path: string, target: any) {
    // 动态设置 a 标签 href
    const githubRepoFile = path === '/'
      ? window.githubRepo
      : `${window.githubRepo}/blob/master/src${path}.ts`;
    document.querySelector<HTMLLinkElement>("#githubRepoFileLink")!.href = githubRepoFile;

    // 更新菜单样式
    const currentMenu = document.querySelector('.actived') as HTMLLIElement;
    const newMenu = target.classList;

    currentMenu && currentMenu.classList.remove('actived');
    newMenu.add('actived');
  }
}

export default Router;