import triangleVert from '../shaders/triangle.vert.wgsl?raw';
import redFrag from '../shaders/red.frag.wgsl?raw';

// 初始化 WebGPU，配置画布
async function initWebGPU() {
  // GPU
  const { gpu } = navigator;
  if (!gpu) {
    throw new Error('WebGPU is Not Supported');
  }

  // 适配器：adapter 是浏览器对 WebGPU 的抽象代理，不能被 JS 用来操作 GPU 进行绘制或计算
  const adapter = await gpu.requestAdapter({
    // 可选参数，开启高画质
    powerPreference: 'high-performance'
  });
  if (!adapter) {
    throw new Error('Adapter Not Found');
  }
  // console.log('🌈 adapter:', adapter);

  // 设备：device 是从 adpater 中申请的一个具体的逻辑实例，能被 JS 用来操作 GPU 进行绘制或计算
  const device = await adapter.requestDevice({
    // 可选参数，添加要申请的功能
    requiredFeatures: ['texture-compression-bc'],
    // 可选参数，修改允许的 Buffer 最大值为浏览器允许的最大值
    requiredLimits: {
      maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize
    }
  });
  if (!device) {
    throw new Error('Device Not Found');
  }
  // console.log('🌈 device:', device);

  // 画布
  const canvas = document.querySelector<HTMLCanvasElement>('#sketchpad');
  if (!canvas) {
    throw new Error('Canvas Not Found');
  }
  canvas.style.display = 'block';
  const context = canvas.getContext('webgpu') as GPUCanvasContext;

  // WebGPU 支持非常多的颜色格式，通常推荐使用 API 来获取当前浏览器默认的颜色格式
  // 一般情况下是 'bgra8unorm'，简单来说就是常用的 0-255 的 rgba 排列方式，只不过都将数据以 0-1 的小数作为表示
  const format = context.getPreferredFormat(adapter);
  const devicePixelRatio = window.devicePixelRatio || 1;
  const size = [
    canvas.clientWidth * devicePixelRatio,
    canvas.clientHeight * devicePixelRatio
  ];
  // 配置画布
  context.configure({
    // 必选参数
    device,
    // 必选参数
    format,
    // 可选参数，使用 canvas 实际大小，避免高清屏模糊问题
    size,
    // 可选参数，Chrome 102 开始默认为 'opaque'，即不透明选项
    compositingAlphaMode: 'opaque'
  });

  return { device, context, format, size };
}

// 初始化并配置 GPU 渲染管线
async function initPipeline(device: GPUDevice, format: GPUTextureFormat) {
  // 创建顶点着色器
  const vertexShader = device.createShaderModule({
    code: triangleVert
  });
  // 创建片元着色器
  const fragmentShader = device.createShaderModule({
    code: redFrag
  });

  // 渲染管线配置
  const descriptor: GPURenderPipelineDescriptor = {
    // 顶点着色器
    vertex: {
      // 传入顶点着色器 shader
      module: vertexShader,
      // 告诉管线该 Shader 程序的入口函数是什么
      entryPoint: 'main'
    },
    // 绘图方式，默认: triangle-list，其他可选: point-list, line-list, line-strip, triangle-strip
    primitive: {
      topology: 'triangle-list'
    },
    // 片元着色器
    fragment: {
      // 传入片元着色器 shader
      module: fragmentShader,
      // 告诉管线该 Shader 程序的入口函数是什么
      entryPoint: 'main',
      // 表明输出的颜色格式
      // 因为片元着色器输出的是每个像素点的颜色，WebGPU 又支持很多的颜色格式
      // 所以这里需要告诉 GPU 管线，在对应的 Shader 中使用的到底是哪种颜色格式，并且这种格式要跟设置画面的格式能够匹配，否则将无法正常显示
      targets: [{ format }]
    }
  };

  // 渲染管线
  const pipeline = await device.createRenderPipelineAsync(descriptor);

  return pipeline;
}

// 创建、录制 command 队列（绘制）
function draw(
  device: GPUDevice,
  context: GPUCanvasContext,
  pipeline: GPURenderPipeline
) {
  // 画布
  const view = context.getCurrentTexture().createView();
  // 类似于图层
  const renderPassDescriptor: GPURenderPassDescriptor = {
    colorAttachments: [
      {
        view: view,
        clearValue: { r: 0, g: 0, b: 0, a: 1.0 },
        // 可选: clear, load
        loadOp: 'clear',
        // 兼容 Chrome 101 之前的版本
        loadValue: { r: 0, g: 0, b: 0, a: 1.0 },
        // 可选: store, discard
        storeOp: 'store'
      }
    ]
  };

  // 录制 command 队列
  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
  // 设置渲染管线配置
  passEncoder.setPipeline(pipeline);
  // 由于这个例子中的 pipeline 是写死的数据，都不需要再引用其它外部数据了，所以这里也不再需要设置其它资源
  // 可以直接调用 renderPassDescriptor 中的 draw API 直接运行管线就可以了
  // 这里是画一个三角形，有三个顶点，也就是说期望 vertex shader 运行三次，输出三个顶点信息。所以这里传入 3 即可
  // 对应的也就是 pipeline 中的 vertex shader 会被并行运行三次
  passEncoder.draw(3, 1, 0, 0);
  // 结束通道录制，endPass 在 Chrome 101 之后的版本被弃用
  passEncoder.end ? passEncoder.end() : passEncoder.endPass();
  // 结束录制，得到 commandBuffer
  const commandBuffer = commandEncoder.finish();

  // WebGPU 运行在一个单独的进程中，所有的命令都会在提交后执行
  device.queue.submit([commandBuffer]);
}

async function main() {
  try {
    // 初始化
    const { device, context, format } = await initWebGPU();

    // 配置管线
    const pipeline = await initPipeline(device, format);

    // 绘制
    draw(device, context, pipeline);
  } catch (error: any) {
    console.error('🌈 error:', error);
    window.$message(`<h2>${error.message}</h2>`);
  }
}

export default main;
