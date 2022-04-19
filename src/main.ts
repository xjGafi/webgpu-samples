import Router from "./common/router";
import { getMenus, handleChanged, showMessage } from "./common/tools";

const GITHUB_REPO = 'https://github.com/xjGafi/webgpu-samples';
document.querySelector<HTMLLinkElement>("#githubRepoLink")!.href = GITHUB_REPO;

// 注册路由
const menusId = 'menus';
const router = new Router(menusId);

// demo 页面菜单
const routes = [
  {
    path: '/',
    name: '',
    callback: () => import('./pages/home')
  },
  {
    path: '/404',
    name: '',
    callback: () => import('./pages/error')
  },
  {
    path: '/helloWebgpu',
    name: 'Hello WebGPU',
    callback: () => import('./pages/helloWebgpu')
  },
  {
    path: '/basicTriangle',
    name: 'Basic Triangle',
    callback: () => import('./pages/basicTriangle')
  },
  {
    path: '/colorTriangle',
    name: 'Color Triangle',
    callback: () => import('./pages/colorTriangle')
  }
];
const menus = document.querySelector<HTMLUListElement>(`#${menusId}`)!;
menus.innerHTML = getMenus(router, routes);

// 路由更新后更新一些动态数据
router.afterEach(() => { handleChanged(GITHUB_REPO) });

// 全局消息绘制方法挂载到 window 上
window.$message = showMessage;