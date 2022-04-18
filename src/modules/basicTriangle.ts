import triangleVert from '../shaders/triangle.vert.wgsl?raw'
import redFrag from '../shaders/red.frag.wgsl?raw'

// check webgpu support
async function initWebGPU() {
  // GPU
  const { gpu } = navigator
  if (!gpu) {
    throw new Error("Not Support WebGPU");
  }

  // 适配器
  const adapter = await gpu.requestAdapter({
    powerPreference: 'high-performance'
  })
  if (!adapter) {
    throw new Error("Adapter Not Found");
  }
  // console.log('🌈 adapter:', adapter);

  // 设备
  const device = await adapter.requestDevice();
  if (!device) {
    throw new Error("Device Not Found");
  }
  // console.log('🌈 device:', device);

  // 画布
  const canvas = document.querySelector<HTMLCanvasElement>('#sketchpad');
  if (!canvas) {
    throw new Error('Canvas Not Found');
  }
  canvas.style.display = 'block';
  const context = canvas.getContext('webgpu') as GPUCanvasContext;

  const format = context.getPreferredFormat(adapter);
  const devicePixelRatio = window.devicePixelRatio || 1;
  const size = [
    canvas.clientWidth * devicePixelRatio,
    canvas.clientHeight * devicePixelRatio
  ];
  context.configure({
    device, format, size,
    compositingAlphaMode: 'opaque'
  });

  return { device, context, format, size };
}

// create a simple pipiline
async function initPipeline(device: GPUDevice, format: GPUTextureFormat): Promise<GPURenderPipeline> {
  const descriptor: GPURenderPipelineDescriptor = {
    vertex: {
      module: device.createShaderModule({
        code: triangleVert
      }),
      entryPoint: 'main'
    },
    primitive: {
      topology: 'triangle-list' // try point-list, line-list, line-strip, triangle-strip?
    },
    fragment: {
      module: device.createShaderModule({
        code: redFrag
      }),
      entryPoint: 'main',
      targets: [{ format }]
    }
  }
  return await device.createRenderPipelineAsync(descriptor)
}

// create & submit device commands
function draw(device: GPUDevice, context: GPUCanvasContext, pipeline: GPURenderPipeline) {
  const view = context.getCurrentTexture().createView()
  const renderPassDescriptor: GPURenderPassDescriptor = {
    colorAttachments: [
      {
        view: view,
        clearValue: { r: 0, g: 0, b: 0, a: 1.0 },
        loadOp: 'clear', // clear/load
        storeOp: 'store', // store/discard
        // before v101
        loadValue: { r: 0, g: 0, b: 0, a: 1.0 }
      }
    ]
  }

  const commandEncoder = device.createCommandEncoder()
  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor)
  passEncoder.setPipeline(pipeline)
  // 3 vertex form a triangle
  passEncoder.draw(3, 1, 0, 0)
  // endPass is deprecated after v101
  passEncoder.end ? passEncoder.end() : passEncoder.endPass()
  // webgpu run in a separate process, all the commands will be executed after submit
  device.queue.submit([commandEncoder.finish()])
}

async function main() {
  try {
    // 初始化
    const { device, context, format } = await initWebGPU();

    // 配置管线
    const pipeline = await initPipeline(device, format)

    // 绘制
    draw(device, context, pipeline)
  } catch (error: any) {
    console.error('🌈 error:', error);
    window.$message(error.message);
  }
}

export default main;
