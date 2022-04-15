import one from "./modules/one";
import two from "./modules/two";
import three from "./modules/three";
import helloWebgpu from "./modules/helloWebgpu";
import basicTriangle from "./modules/basicTriangle";
import colorTriangle from "./modules/colorTriangle";

const moudles = [
  {
    path: '/one',
    name: '一',
    callback: one
  },
  {
    path: '/two',
    name: '二',
    callback: two
  },
  {
    path: '/three',
    name: '三',
    callback: three
  },
  {
    path: '/helloWebgpu',
    name: 'Hello WebGPU',
    callback: helloWebgpu
  },
  {
    path: '/basicTriangle',
    name: 'Basic Triangle',
    callback: basicTriangle
  },
  {
    path: '/colorTriangle',
    name: 'Color Triangle',
    callback: colorTriangle
  }
]

export default moudles;