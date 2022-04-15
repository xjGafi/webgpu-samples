import { RouterObject } from "./interface";
import { isFunction } from "./tools";

//构造函数
class Router {
  routers = {} as RouterObject;
  currentPath = '';
  menusId = '';
  beforeHandler = Object.create(Function);
  afterHandler = Object.create(Function);

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
    // 首次加载
    this.assign.call(this, location.pathname);

    // 监听菜单点击事件
    const menus = document.querySelector(`#${this.menusId}`) as HTMLUListElement;
    menus.addEventListener(
      'click',
      (event: MouseEvent) => {
        const path = `/${(event.target as Element).id}`;

        // 处理误触
        if (path.slice(1) === this.menusId) {
          return;
        }

        this.currentPath = location.pathname;
        if (this.currentPath === path) return;

        event.preventDefault();
        this.assign.call(this, path);
      },
      false
    );
  }

  // 注册每个视图
  register(path: string, callback: Function) {
    if (isFunction(callback)) {
      this.routers[path] = callback;
    } else {
      console.error('register(): callback is not a function');
    }
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
    try {
      let refreshHandler;
      const hasOwnProperty = this.routers.hasOwnProperty(path);

      if (hasOwnProperty) {
        // 有对应 path
        refreshHandler = this.routers[path];
      } else {
        // 没有对应 path
        refreshHandler = this.routers['404'];
      }

      refreshHandler.call(this);
      hasOwnProperty && this.afterHandler();
    } catch (error) {
      console.error('🤯', error);
      (this.routers['error'] || function () { }).call(this, error);
    }
  }

  // path 切换之前
  beforeEach(callback: Function) {
    if (isFunction(callback)) {
      this.beforeHandler = callback;
    } else {
      console.error('beforeEach(): callback is not a function');
    }
  }

  // path 切换之后
  afterEach(callback: Function) {
    if (isFunction(callback)) {
      this.afterHandler = callback;
    } else {
      console.error('afterEach(): callback is not a function');
    }
  }
}

export default Router;