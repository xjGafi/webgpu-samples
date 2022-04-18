import basicVert from '../shaders/basic.vert.wgsl?raw'
import colorFrag from '../shaders/color.frag.wgsl?raw'
import * as triangle from '../util/triangle'

// initialize webgpu device & config canvas context
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
async function initPipeline(device: GPUDevice, format: GPUTextureFormat) {
  const pipeline = await device.createRenderPipelineAsync({
    label: 'Basic Pipline',
    vertex: {
      module: device.createShaderModule({
        code: basicVert,
      }),
      entryPoint: 'main',
      buffers: [{
        arrayStride: 3 * 4, // 3 points per triangle,
        attributes: [
          {
            // position
            shaderLocation: 0,
            offset: 0,
            format: 'float32x3',
          }
        ]
      }]
    },
    fragment: {
      module: device.createShaderModule({
        code: colorFrag,
      }),
      entryPoint: 'main',
      targets: [
        {
          format: format
        }
      ]
    },
    primitive: {
      topology: 'triangle-list' // try point-list, line-list, line-strip, triangle-strip?
    }
  } as GPURenderPipelineDescriptor)
  // create vertex buffer
  const vertexBuffer = device.createBuffer({
    label: 'GPUBuffer store vertex',
    size: triangle.vertex.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    //mappedAtCreation: true
  })
  device.queue.writeBuffer(vertexBuffer, 0, triangle.vertex)
  // create color buffer
  const colorBuffer = device.createBuffer({
    label: 'GPUBuffer store rgba color',
    size: 4 * 4, // 4 * float32
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true
  })
  // device.queue.writeBuffer(colorBuffer, 0, new Float32Array([1,1,0,1]))
  new Float32Array(colorBuffer.getMappedRange()).set(new Float32Array([1, 1, 0, 1]))
  colorBuffer.unmap()

  // create a uniform group for color
  const uniformGroup = device.createBindGroup({
    label: 'Uniform Group with colorBuffer',
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: colorBuffer
        }
      }
    ]
  })
  // return all vars
  return { pipeline, vertexBuffer, colorBuffer, uniformGroup }
}
// create & submit device commands
function draw(device: GPUDevice, context: GPUCanvasContext, pipeline: GPURenderPipeline, uniformGroup: GPUBindGroup, vertexBuffer: GPUBuffer) {
  const commandEncoder = device.createCommandEncoder()
  const view = context.getCurrentTexture().createView()
  const renderPassDescriptor: GPURenderPassDescriptor = {
    colorAttachments: [
      {
        view: view,
        clearValue: { r: 0, g: 0, b: 0, a: 1.0 },
        loadOp: 'clear',
        storeOp: 'store',
        // before v101
        loadValue: { r: 0, g: 0, b: 0, a: 1.0 }
      }
    ]
  }
  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor)
  passEncoder.setPipeline(pipeline)
  // set uniformGroup
  passEncoder.setBindGroup(0, uniformGroup)
  // set vertex
  passEncoder.setVertexBuffer(0, vertexBuffer)
  // 3 vertex form a triangle
  passEncoder.draw(triangle.vertexCount, 1, 0, 0)
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
    const { pipeline, uniformGroup, colorBuffer, vertexBuffer } = await initPipeline(device, format);

    // 绘制
    draw(device, context, pipeline, uniformGroup, vertexBuffer);

    // update draw if color changed
    document.querySelector('input')?.addEventListener('input', (e: Event) => {
      // get hex color string
      const color = (e.target as HTMLInputElement).value
      console.log(color)
      // parse hex color into rgb
      const r = +('0x' + color.slice(1, 3))
      const g = +('0x' + color.slice(3, 5))
      const b = +('0x' + color.slice(5, 7))
      // update colorBuffer with new rgba color
      device.queue.writeBuffer(colorBuffer, 0, new Float32Array([r / 255, g / 255, b / 255, 1]))
      // re-draw
      draw(device, context, pipeline, uniformGroup, vertexBuffer)
    })
  } catch (error: any) {
    console.error('🌈 error:', error);
    window.$message(error.message);
  }
}

export default main;