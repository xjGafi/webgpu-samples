import one from "./one";
import two from "./two";
import three from "./three";
import helloWebgpu from "./helloWebgpu";
// import basicTriangle from "./basicTriangle";

const moudles = [
  {
    path: './one',
    name: '一',
    callback: one
  },
  {
    path: './two',
    name: '二',
    callback: two
  },
  {
    path: './three',
    name: '三',
    callback: three
  },
  {
    path: './helloWebgpu',
    name: 'Hello WebGPU',
    callback: helloWebgpu
  }
]

export default moudles;