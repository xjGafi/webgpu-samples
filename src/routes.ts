import home from "./pages/home";
import error from "./pages/error";
import helloWebgpu from "./pages/helloWebgpu";
import basicTriangle from "./pages/basicTriangle";
import colorTriangle from "./pages/colorTriangle";

const routes = [
  {
    path: '/',
    name: '',
    callback: home
  },
  {
    path: '/error',
    name: '',
    callback: error
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

export default routes;