// check webgpu support
async function initWebGPU() {
  try {
    // GPU
    const { gpu } = navigator
    if (!gpu) {
      throw new Error("No support WebGPU");
    }
    document.body.innerHTML = "<h1>Hello WebGPU</h1>"

    // 适配器
    const adapter = await gpu.requestAdapter()
    if (!adapter) {
      throw new Error("No adapter found");
    }
    console.log('🌈 adapter:', adapter);
    document.body.innerHTML += "<h2>👀 adapter</h2>"

    // let x: keyof GPUSupportedLimits;
    // for (x in adapter.limits) {
    //   document.body.innerHTML += `<p>${x}:${adapter.limits[x]}</p>`
    // }

    // 设备
    const device = await adapter.requestDevice();
    if (!device) {
      throw new Error("No device found");
    }
    // console.log('🌈 device:', device);
    document.body.innerHTML += "<h2>👀 device</h2>"

    // let y: keyof GPUSupportedLimits;
    // for (y in device.limits) {
    //   document.body.innerHTML += `<p>${y}:${device.limits[y]}</p>`
    // }

  } catch (error: any) {
    document.body.innerHTML = `<h1>${error.message}</h1>`
    console.error('🌈 error:', error);
  }
}

initWebGPU()