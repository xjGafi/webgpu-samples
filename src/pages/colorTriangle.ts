import basicVert from '../shaders/basic.vert.wgsl?raw'
import colorFrag from '../shaders/color.frag.wgsl?raw'
import * as triangle from '../util/triangle'

// 初始化 WebGPU，配置画布
async function initWebGPU() {
  // GPU
  const { gpu } = navigator
  if (!gpu) {
    throw new Error("Not Support WebGPU");
  }

  // 适配器：adapter 是浏览器对 WebGPU 的抽象代理，不能被 JS 用来操作 GPU 进行绘制或计算
  const adapter = await gpu.requestAdapter({
    // 可选参数，开启高画质
    powerPreference: 'high-performance'
  })
  if (!adapter) {
    throw new Error("Adapter Not Found");
  }
  // console.log('🌈 adapter:', adapter);

  // 设备：device 是从 adpater 中申请的一个具体的逻辑实例，能被 JS 用来操作 GPU 进行绘制或计算
  const device = await adapter.requestDevice(
    {
      // 可选参数，添加要申请的功能
      requiredFeatures: ['texture-compression-bc'],
      // 可选参数，修改允许的 Buffer 最大值为浏览器允许的最大值
      requiredLimits: {
        maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize
      }
    }
  );
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
    code: basicVert
  });
  // 创建片元着色器
  const fragmentShader = device.createShaderModule({
    code: colorFrag
  });

  // 渲染管线配置
  const descriptor: GPURenderPipelineDescriptor = {
    label: 'Basic Pipline',
    // 顶点着色器
    vertex: {
      // 传入顶点着色器 shader
      module: vertexShader,
      // 告诉管线该 Shader 程序的入口函数是什么
      entryPoint: 'main',
      // 表明 pipeline 可以传入几个顶点数据。目前的 WebGPU 最多支持 8 个，这里的数量要和 setVertexBuffer() 的个数相对应
      buffers: [{
        // arrayStride 是传入的 vertex buffer 要以多大的数据量作为切分成为一个顶点数据传入 vertex shader
        // 这里的三角形以每三个数据作为一个顶点，所以对应的就是以 3 数字分为一个切分
        arrayStride: 3 * 4, // 3 points per triangle,
        // attributes 可以对参数进行精细的划分，可以将 xy、z 或是 x、y、z 拆开传入
        // 实际场景中可能包括 position、uv、normal 等信息，可以分开传入，也可以混合在一个 buffer 里传入
        attributes: [
          {
            // 与 shader 中接收参数对应，这里为 0 ,在 shader 中则用 @location(0) 接收
            shaderLocation: 0,
            // 为 0 即从头开始
            offset: 0,
            // 标示参数的长度大小，这里是 xyz，所以是 float32x3
            format: 'float32x3',
          }
        ]
      }]
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

  // 在 GPU 中创建一个 vertex buffer
  const vertexBuffer = device.createBuffer({
    label: 'GPUBuffer store vertex',
    // buffer 字节大小，Float32Array 一个数字占 4 个字节，所以是 9*4。也可直接调用 byteLength 获取
    size: triangle.vertex.byteLength,
    // 设置 Buffer 用途，这里选择为 VERTEX 即可
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    //mappedAtCreation: true
  });
  // 将 CPU 的中数据写入到 GPU 中，将 JS 中的 TypedArray 直接拷贝给 GPUBuffer
  device.queue.writeBuffer(vertexBuffer, 0, triangle.vertex);

  // 创建在 CPU 中存储颜色的 color buffer
  const colorBuffer = device.createBuffer({
    label: 'GPUBuffer store rgba color',
    // RGBA 颜色即 4*4
    size: 4 * 4, // 4 * float32
    // 这里不再是顶点数据，而是作为通用 buffer，在 WebGPU 中有两种数据
    // - UNIFORM 适合一般只读的小数据，最大 64KB，在 Shader 中只可读，不能修改
    // - STORAGE 可以非常大，最大支持 2GB，在 Shader 中可修改
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true
  });
  // 将颜色数据写入到 GPU 中
  // device.queue.writeBuffer(colorBuffer, 0, new Float32Array([1,1,0,1]))
  new Float32Array(colorBuffer.getMappedRange()).set(new Float32Array([1, 1, 0, 1]));
  colorBuffer.unmap();

  // 创建一个 uniform group，用于 color 变量
  const uniformGroup = device.createBindGroup({
    label: 'Uniform Group with colorBuffer',
    // 用来说明绑定到 pipeline 的位置布局，由于目前只有一个 group ，所以使用 0 位置的布局即可
    layout: pipeline.getBindGroupLayout(0),
    // 它是一个数组，可以添加多个资源（如果有多个资源可依次传入）
    entries: [
      {
        // 每个资源要指定绑定的位置，这里只有一个 buffer，所以位置是 0
        binding: 0,
        // 指明具体用到了哪个资源，将 colorBuffer 传入即可
        resource: {
          buffer: colorBuffer
        }
      }
    ]
  });

  return { pipeline, vertexBuffer, colorBuffer, uniformGroup };
}

// 创建、录制 command 队列（绘制）
function draw(device: GPUDevice, context: GPUCanvasContext, pipeline: GPURenderPipeline, uniformGroup: GPUBindGroup, vertexBuffer: GPUBuffer) {
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
        storeOp: 'store',
      }
    ]
  };

  // 录制 command 队列
  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
  passEncoder.setPipeline(pipeline);
  // 将 group 绑定到对应的 pipeline 上。注意：位置要和 group 中设置的 layout 一致
  passEncoder.setBindGroup(0, uniformGroup);
  // 向第 0 个通道中设置 vertexBuffer 数据
  passEncoder.setVertexBuffer(0, vertexBuffer);
  // 设置 pipeline 中的 vertex shader 会被并行的次数
  passEncoder.draw(triangle.vertexCount, 1, 0, 0)
  // 结束通道录制
  passEncoder.end ? passEncoder.end() : passEncoder.endPass()
  // 结束录制，得到 buffer，并将 buffer 提交到 GPU
  device.queue.submit([commandEncoder.finish()])
}

async function main() {

  try {
    // 初始化
    const { device, context, format } = await initWebGPU();

    // 配置管线
    const { pipeline, uniformGroup, colorBuffer, vertexBuffer } = await initPipeline(device, format);

    // 绘制
    draw(device, context, pipeline, uniformGroup, vertexBuffer);

    // 控制区域
    const controller = document.querySelector<HTMLElement>('#controller')!;
    // 颜色控制
    const inputColor = document.createElement("input");
    inputColor.type = 'color';
    inputColor.value = '#00ff00'; // 必须是 6 位
    controller.appendChild(inputColor);

    // 颜色改变时，重新绘制
    inputColor.addEventListener('input', (e: Event) => {
      // 获取 HEX（十六进制）的色值
      const color = (e.target as HTMLInputElement).value;
      // HEX 转 RGB
      const r = +('0x' + color.slice(1, 3));
      const g = +('0x' + color.slice(3, 5));
      const b = +('0x' + color.slice(5, 7));
      // 将新的数据写入到 vertex buffer 中并重新绘制当前图形
      device.queue.writeBuffer(colorBuffer, 0, new Float32Array([r / 255, g / 255, b / 255, 1]));
      // 重新绘制
      draw(device, context, pipeline, uniformGroup, vertexBuffer);
    });
  } catch (error: any) {
    console.error('🌈 error:', error);
    window.$message(`<h2>${error.message}</h2>`);
  }
}

export default main;