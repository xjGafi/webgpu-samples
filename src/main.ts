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

const $router = new Router();

$router.route('/one', () => import("./one"));
$router.route('/two', () => import("./two"));
$router.route('/three', () => import("./three"));
$router.route('/helloWebgpu', () => import("./components/helloWebgpu"));
$router.route('/basicTriangle', () => import("./components/basicTriangle"));
