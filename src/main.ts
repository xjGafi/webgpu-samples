import modules from "./modules/index";

import { menus, routes } from "./common/tools";

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <h1>Hello Vite!</h1>
  <ul id="router">
    ${menus(modules)}
  </ul>
  <div class="content"></div>
  <canvas id="sketchpad"></canvas>
`

routes(modules);