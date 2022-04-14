import Router from "./common/router";

import one from "./one";
import two from "./two";
import three from "./three";

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <h1>Hello Vite!</h1>
  <div id="click_btn">
    <a href="#/one">第一个页面</a>
    <a href="#/two">第二个页面</a>
    <a href="#/three">第三个页面</a>
  </div>

  <div class="content"></div>
`

const $router = new Router();

$router.route('/one', one);
$router.route('/two', two);
$router.route('/three', three);
