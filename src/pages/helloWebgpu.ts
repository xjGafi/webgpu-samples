// 初始化 WebGPU
async function initWebGPU() {
  // GPU
  const { gpu } = navigator;
  if (!gpu) {
    throw new Error('WebGPU is Not Supported');
  }

  // 适配器：adapter 是浏览器对 WebGPU 的抽象代理，并不能拿它去操作 GPU 进行绘制或计算
  const adapter = await gpu.requestAdapter({
    // 可选参数，开启高画质
    powerPreference: 'high-performance'
  });
  if (!adapter) {
    throw new Error('Adapter Not Found');
  }
  // console.log('🌈 adapter:', adapter);

  // 设备：需要从 adpater 中请求一个具体的逻辑实例，该实例则是可以被 JS 控制来操作 GPU 的具体对象了
  const device = await adapter.requestDevice({
    // 可选参数，添加要申请的功能
    requiredFeatures: ['texture-compression-bc'],
    // 可选参数，修改允许的Buffer最大值为浏览器允许的最大值
    requiredLimits: {
      maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize
    }
  });
  if (!device) {
    throw new Error('Device Not Found');
  }
  // console.log('🌈 device:', device);
}

async function main() {
  try {
    // 初始化
    await initWebGPU();
    window.$message('<h2>Hello WebGPU</h2>');
  } catch (error: any) {
    console.error('🌈 error:', error);
    window.$message(`<h2>${error.message}</h2>`);
  }
}

export default main;
