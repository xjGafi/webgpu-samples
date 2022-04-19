import initLayout from './layout';
import routes from "./routes";
import Router from "./common/router";
import { showMessage, handleBeforeChange, handleChanged } from "./common/tools";

const GITHUB_REPO = 'https://github.com/xjGafi/webgpu-samples';

// 全局消息绘制方法挂载到 window 上
window.$message = showMessage;

// 初始化页面
initLayout('app', GITHUB_REPO, routes);

// 注册路由
const router = new Router('menus');
routes.forEach(route => {
  const { path, callback } = route;
  router.register(path, callback);
})

// 路由更新前，更新 UI
router.beforeEach(() => { handleBeforeChange() });

// 路由更新后，更新 UI
router.afterEach(() => { handleChanged(GITHUB_REPO) });