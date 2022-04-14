interface Routers {
  [propName: string]: any
}


//构造函数
class Router {
  routes = {} as Routers;
  currentPath = '';

  constructor() {
    this.init();
  }

  route(path: string, callback: Function) {
    // 给不同的 hash 设置不同的回调函数
    this.routes[path] = callback || function () { };
    console.log('🌈 this.routes:', this.routes);
  }

  refresh() {
    // 如果存在 hash 值则获取到，否则设置 hash 值为 /
    this.currentPath = location.hash.slice(1) || '';

    // 根据当前的 hash 值来调用相对应的回调函数
    if (this.currentPath !== '/') {
      // this.loadScript(this.routes[this.currentPath]);
      this.routes[this.currentPath]();
    }

  }

  init() {
    window.addEventListener('load', this.refresh.bind(this), false);
    window.addEventListener('hashchange', this.refresh.bind(this), false);
  }

}

export default Router;