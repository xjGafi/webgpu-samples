import Router from "./common/router";

import one from "./one";
import two from "./two";
import three from "./three";
import helloWebgpu from "./components/helloWebgpu";
import basicTriangle from "./components/basicTriangle";

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

router.register('/', one);
router.register('/one', one);
router.register('/two', two);
router.register('/three', three);
router.register('/helloWebgpu', helloWebgpu);
router.register('/basicTriangle', basicTriangle);
