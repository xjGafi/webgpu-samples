export const handleBeforeChange = () => {
  const messageBox = document.querySelector<HTMLElement>('#message')!;
  messageBox.style.display = 'none';
}

export const handleChanged = (githubRepo: string) => {
  const pathname = location.pathname.slice(1);

  // 动态设置 a 标签 href
  let githubRepoFile;
  if (pathname) {
    githubRepoFile = `${githubRepo}/blob/master/src/modules/${pathname}.ts`;
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

export const showMessage = (message: string) => {
  // 隐藏画板
  const sketchpad = document.querySelector<HTMLCanvasElement>('#sketchpad')!;
  sketchpad.style.display = 'none';
  // 显示消息
  const messageBox = document.querySelector<HTMLElement>('#message')!;
  messageBox.style.display = 'block';
  messageBox.innerHTML = message
}