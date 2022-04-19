interface Routers {
  [key: string]: any
}

interface Router {
  routers: Routers
  currentPath: string
  menusId: string
  beforeHandler: Function | null
  afterHandler: Function | null
}

//构造函数
class Router {

  constructor(menusId: string) {
    this.routers = {}  // 保存注册的所有路由
    this.currentPath = '';
    this.menusId = menusId;
    this.beforeHandler = null  // 切换前
    this.afterHandler = null  // 切换后

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
  async register(path: string, callback: Function) {
    if (typeof callback === 'function') {
      this.routers[path] = callback;
    } else {
      console.error('🤯 register(): callback is not a function');
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
      // 判断路由是否被注册
      const hasOwnProperty = this.routers.hasOwnProperty(path);
      if (hasOwnProperty) {
        // 路由的回调函数执行前触发
        this.beforeHandler && this.beforeHandler();

        // 执行路由的回调函数
        this.routers[path].call(this);

        // 路由的回调函数执行后触发
        this.afterHandler && this.afterHandler();
      } else {
        throw new Error(`${path} is not registered.`);
      }
    } catch (error) {
      console.error('🤯 refresh():', error);
      this.routers['/error'].call(this);
    }
  }

  // path 切换之前
  beforeEach(callback: Function) {
    if (typeof callback === 'function') {
      this.beforeHandler = callback;
    } else {
      console.error('🤯 beforeEach(): callback is not a function');
    }
  }

  // path 切换之后
  afterEach(callback: Function) {
    if (typeof callback === 'function') {
      this.afterHandler = callback;
    } else {
      console.error('🤯 afterEach(): callback is not a function');
    }
  }
}

export default Router;