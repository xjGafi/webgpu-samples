async function initWebGPU() {
  // GPU
  const { gpu } = navigator;
  if (!gpu) {
    throw new Error('Not Support WebGPU');
  }

  // 适配器
  const adapter = await gpu.requestAdapter()
  if (!adapter) {
    throw new Error('Adapter Not Found');
  }
  // console.log('🌈 adapter:', adapter);

  // 设备
  const device = await adapter.requestDevice();
  if (!device) {
    throw new Error('Device Not Found');
  }
  // console.log('🌈 device:', device);
}

async function main() {
  try {
    await initWebGPU();
    window.$message('Hello WebGPU');
  } catch (error: any) {
    console.error('🌈 error:', error);
    window.$message(error.message);
  }
}

export default main;