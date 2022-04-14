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

  register(path: string, callback: Function) {
    // 给不同的 hash 设置不同的回调函数
    this.routers[path] = callback || function () { };
    console.log('🌈 this.routers:', this.routers);
  }

  refresh() {
    // 如果存在 hash 值则获取到，否则设置 hash 值为 /
    this.currentPath = location.hash.slice(1) || '';

    // 根据当前的 hash 值来调用相对应的回调函数
    if (this.currentPath !== '/') {
      this.routers[this.currentPath]();
    }
  }

  init() {
    window.addEventListener('load', this.refresh.bind(this), false);
    window.addEventListener('hashchange', this.refresh.bind(this), false);
  }
}

export default Router;