import Router from "./common/router";
import modules from "./menu";

import { getMenus, handleRouteChange, drawTextMessage } from "./common/tools";

const GITHUB_REPO = 'https://github.com/xjGafi/webgpu-samples';
document.querySelector<HTMLLinkElement>("#githubRepoLink")!.href = GITHUB_REPO;

// 注册路由并生成菜单
const router = new Router('menus');
const menu = document.querySelector('#menus') as HTMLUListElement;
menu.innerHTML = getMenus(router, modules);

// 路由更新后更新一些动态数据
router.afterEach(() => { handleRouteChange(GITHUB_REPO) });

// 全局消息绘制方法挂载到 window 上
window.drawTextMessage = drawTextMessage;