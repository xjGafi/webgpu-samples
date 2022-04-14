interface Routers {
  [propName: string]: any
}

//构造函数
class Router {
  routers = {} as Routers;
  currentPath = '';

  constructor() {
    this.init();
  }

  // register(path: string, callback: Function) {
  //   // 给不同的 hash 设置不同的回调函数
  //   this.routers[path] = callback || function () { };
  //   console.log('🌈 this.routers:', this.routers);
  // }

  // refresh() {
  //   // 如果存在 hash 值则获取到，否则设置 hash 值为 /
  //   this.currentPath = location.hash.slice(1) || '';

  //   // 根据当前的 hash 值来调用相对应的回调函数
  //   if (this.currentPath !== '/') {
  //     this.routers[this.currentPath]();
  //   }
  // }

  init() {
    window.addEventListener(
      'load',
      () => {
        let path = location.pathname;
        this.assign.call(this, path);
      },
      false
    );

    window.addEventListener(
      'popstate',
      (event: PopStateEvent) => {
        const state = event.state || {};
        const path = state.path || '';
        this.refresh.call(this, path);
      },
      false
    );

    const router = document.querySelector<HTMLUListElement>('#router')!;
    router.addEventListener(
      'click',
      (event: MouseEvent) => {
        const { dataset: { path } } = event.target as any;

        this.currentPath = location.pathname;
        if (this.currentPath === path) return;

        event.preventDefault();
        this.assign.call(this, path);
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
    console.log('🌈 assign path:', path);

    history.pushState({ path }, '', path);
    this.refresh(path);
  }

  // 替换为 path
  replace(path: string) {
    console.log('🌈 replace path:', path);

    history.replaceState({ path }, '', path);
    this.refresh(path);
  }

  // 通用处理 path 调用回调函数
  refresh(path: string) {
    console.log('🌈 refresh path:', path);

    let handler;
    // 没有对应 path
    if (!this.routers.hasOwnProperty(path)) {
      handler = this.routers['404'] || function () { };
    }
    // 有对应 path
    else {
      handler = this.routers[path];
    }

    console.log('🌈 handler:', handler);

    try {
      handler.call(this);
    } catch (error) {
      console.error('🤯', error);
      (this.routers['error'] || function () { }).call(this, error);
    }

  }

}

export default Router;