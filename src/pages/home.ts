export default function main() {
  const links = [
    {
      label: '⭐️ GitHub - WebGPU: Wiki',
      url: 'https://github.com/gpuweb/gpuweb/wiki/Implementation-Status',
    },
    {
      label: '📖 W3C - WebGPU',
      url: 'https://www.w3.org/TR/webgpu',
    },
    {
      label: '📖 W3C - WebGPU (中文)',
      url: 'https://www.orillusion.com/zh/webgpu.html',
    },
    {
      label: '📖 W3C - WGSL',
      url: 'https://www.w3.org/TR/WGSL',
    },
    {
      label: '📖 W3C - WGSL (中文)',
      url: 'https://www.orillusion.com/zh/wgsl.html',
    },
    {
      label: '📖 W3C - WebGPU Explainer',
      url: 'https://gpuweb.github.io/gpuweb/explainer',
    },
    {
      label: '📖 W3C - WebGPU Explainer (中文)',
      url: 'https://www.orillusion.com/zh/explainer.html',
    },
    {
      label: '📺 Bilibili - Orillusion: 视频',
      url: 'https://space.bilibili.com/1006136755',
    },
    {
      label: '⭐️ GitHub - Orillusion: 代码',
      url: 'https://github.com/Orillusion/orillusion-webgpu-samples',
    },
    {
      label: '📺 Bilibili - Jack 老徐: 视频',
      url: 'https://space.bilibili.com/1982541803',
    },
    {
      label: '⭐️ GitHub - Jack 老徐: 代码',
      url: 'https://github.com/jack1232/WebGPU-Step-By-Step',
    },
    {
      label: '🍕 GAMES101:现代计算机图形学入门',
      url: 'https://games-cn.org/intro-graphics',
    },
  ]

  window.$message(`
    <section>
      <h2>Documents:</h2>
      <ul>
        ${links.map(link => `<li><a href="${link.url}" target="_blank">${link.label}</a></li>`).join('')}
      </ul>
    </section>`
  );
}