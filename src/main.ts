import Router from "./common/router";

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <h1>Hello Vite!</h1>
  <div id="click_btn">
    <a href="#/one">第一个页面</a>
    <a href="#/two">第二个页面</a>
    <a href="#/three">第三个页面</a>
    <a href="#/helloWebgpu">helloWebgpu</a>
    <a href="#/basicTriangle">basicTriangle</a>
  </div>
  <div class="content"></div>
  <canvas id="sketchpad"></canvas>
`

const router = new Router();

router.register('/one', () => import("./one"));
router.register('/two', () => import("./two"));
router.register('/three', () => import("./three"));
router.register('/helloWebgpu', () => import("./components/helloWebgpu"));
router.register('/basicTriangle', () => import("./components/basicTriangle"));
