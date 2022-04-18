async function initWebGPU() {
  // GPU
  const { gpu } = navigator;
  if (!gpu) {
    throw new Error('No Support WebGPU');
  }

  // 适配器
  const adapter = await gpu.requestAdapter({
    powerPreference: 'high-performance'
  })
  if (!adapter) {
    throw new Error('No Adapter Found');
  }
  // console.log('🌈 adapter:', adapter);

  // 设备
  const device = await adapter.requestDevice();
  if (!device) {
    throw new Error('No Device Found');
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