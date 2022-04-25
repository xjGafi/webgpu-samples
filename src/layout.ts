import './style.css';

const initLayout = (appId = 'app', githubRepo: string, routes: Array<Menu>) => {

  let menus = '';
  routes.filter(menu => {
    const { name, path } = menu;
    if (name) {
      menus += `<li id="${path.slice(1)}">${name}</li>`
    }
  });

  const layout = `
    <aside class="webgpu--aside">
      <section class="webgpu--aside__header">
        <h1 id="title">WebGPU</h1>
        <a id="githubRepoLink" href="${githubRepo}" target="_blank" data-tag="github">
          <svg fill="#000">
            <use xlink:href="#github"></use>
          </svg>
        </a>
      </section>
      <ul id="menus" class="webgpu--aside__menus">${menus}</ul>
      <p class="webgpu--aside__footer">have fun 🏝</p>
    </aside>
    <article class="webgpu--article">
      <canvas id="sketchpad" class="webgpu--article__sketchpad"></canvas>
      <section id="message" class="webgpu--article__message"></section>
      <a
        id="githubRepoFileLink"
        class="webgpu--article__github"
        target="_blank"
        data-tag="github"
      >
        <svg fill="#fff">
          <use xlink:href="#github"></use>
        </svg>
      </a>
    </article>
  `
  const app = document.querySelector<HTMLElement>(`#${appId}`)!
  app.innerHTML = layout;
}

export default initLayout;