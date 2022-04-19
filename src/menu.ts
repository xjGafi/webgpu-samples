const moudles = [
  {
    path: '/',
    name: '',
    callback: () => import('./pages/home')
  },
  {
    path: '/404',
    name: '',
    callback: () => import('./pages/error')
  },
  {
    path: '/helloWebgpu',
    name: 'Hello WebGPU',
    callback: () => import('./pages/helloWebgpu')
  },
  {
    path: '/basicTriangle',
    name: 'Basic Triangle',
    callback: () => import('./pages/basicTriangle')
  },
  {
    path: '/colorTriangle',
    name: 'Color Triangle',
    callback: () => import('./pages/colorTriangle')
  }
]

export default moudles;