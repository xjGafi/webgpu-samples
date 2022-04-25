// 路由切换之前执行
export const handleBeforeChange = () => {
  // 移除画布样式
  const sketchpad = document.querySelector<HTMLCanvasElement>('#sketchpad')!;
  sketchpad.removeAttribute('style');

  // 隐藏消息
  const noticeboard = document.querySelector<HTMLElement>('#noticeboard')!;
  noticeboard.style.display = 'none';

  // 清空控制器
  const controller = document.querySelector<HTMLElement>('#controller')!;
  controller.innerHTML = '';
}

// 路由切换之后执行
export const handleChanged = (githubRepo: string) => {
  const pathname = location.pathname.slice(1);

  // 动态设置 a 标签 href
  let githubRepoFile;
  if (pathname) {
    githubRepoFile = `${githubRepo}/blob/master/src/pages/${pathname}.ts`;
  } else {
    githubRepoFile = githubRepo;
  }
  const githubRepoFileLink = document.querySelector<HTMLLinkElement>("#githubRepoFileLink")!
  githubRepoFileLink.href = githubRepoFile;

  // 移除旧路由对应菜单 actived 样式
  const oldMenu = document.querySelector<HTMLLIElement>('.actived')
  oldMenu?.classList.remove('actived');

  // 设置新路由对应菜单 actived 样式
  if (pathname) {
    const newMenu = document.querySelector<HTMLLIElement>(`#${pathname}`)
    newMenu?.classList.add('actived');
  }
}

// 通用消息提示
export const showMessage = (message: string) => {
  // 隐藏画板
  const sketchpad = document.querySelector<HTMLCanvasElement>('#sketchpad')!;
  sketchpad.style.display = 'none';

  // 显示消息
  const noticeboard = document.querySelector<HTMLElement>('#noticeboard')!;
  noticeboard.style.display = 'block';
  noticeboard.innerHTML = message
}