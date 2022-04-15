import Router from "./common/router";
import modules from "./menu";

import { getMenus, drawTextMessage, githubRepo } from "./common/tools";

document.querySelector<HTMLLinkElement>("#githubRepoLink")!.href = githubRepo;

// 注册路由并生成菜单
const router = new Router('menus');
const menu = document.querySelector('#menus') as HTMLUListElement;
menu.innerHTML = getMenus(router, modules);

// 全局消息绘制方法挂载到 window 上
window.drawTextMessage = drawTextMessage;
window.githubRepo = githubRepo;