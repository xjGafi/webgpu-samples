import Router from "./router";

export const menus = (modules: Array<any>) => {
  let menus = '';
  modules.forEach(page => {
    const { path, name } = page;
    const menu = `<li data-path="${path}">${name}</li>`;
    menus += menu;
  })

  return menus;
}

export const routes = (modules: Array<any>) => {
  const router = new Router();

  modules.forEach(page => {
    const { path, callback } = page;
    router.register(path, callback);
  });

}