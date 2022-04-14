import Router from "./common/router";

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <h1>Hello Vite!</h1>
  <ul id="router">
    <li data-path="/one">第一个页面</li>
    <li data-path="/two">第二个页面</li>
    <li data-path="/three">第三个页面</li>
    <li data-path="/helloWebgpu">helloWebgpu</li>
    <li data-path="/basicTriangle">basicTriangle</li>
  </ul>
  <div class="content"></div>
  <canvas id="sketchpad"></canvas>
`

const router = new Router();

router.register('/', () => import("./one"));
router.register('/one', () => import("./one"));
router.register('/two', () => import("./two"));
router.register('/three', () => import("./three"));
router.register('/helloWebgpu', () => import("./components/helloWebgpu"));
router.register('/basicTriangle', () => import("./components/basicTriangle"));
