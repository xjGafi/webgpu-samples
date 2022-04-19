# webgpu-samples

## Install and Run

Type the following in any terminal:

```bash
# Clone the repo
git clone https://github.com/xjGafi/webgpu-samples.git

# Go inside the folder
cd webgpu-samples

# Start installing dependencies
npm install # or yarn

# Run project at localhost:3000
npm run dev # or yarn run dev
```

## Project Layout

```bash
├── LICENSE
├── README.md
├── index.html
├── package.json
├── src
│   ├── common
│   │   ├── router.ts
│   │   └── tools.ts
│   ├── main.ts
│   ├── layout.ts
│   ├── routes.ts
│   ├── style.css
│   ├── pages
│   │   ├── helloWebgpu.ts
│   │   ├── basicTriangle.ts
│   │   ├── colorTriangle.ts
│   │   ├── home.ts
│   │   └── error.ts
│   ├── shaders
│   │   ├── basic.vert.wgsl
│   │   ├── color.frag.wgsl
│   │   ├── red.frag.wgsl
│   │   └── triangle.vert.wgsl
│   ├── util
│   │   ├── ractangle.ts
│   │   └── triangle.ts
│   └── vite-env.d.ts
├── tsconfig.json
└── vite.config.js
```

## How to enable WebGPU

1. We have embedded a WebGPU Origin-Trail token in `tsconfig.json`, you can use WebGPU at `localhost:3000` via Chrome v94-105
2. For Edge Canary, please open `edge://flags/#enable-unsafe-webgpu`, and enable the flag
3. For FireFox Nightly, please open `about:config`, and change `dom.webgpu.enabled` to `true`

Modified base on [orillusion-webgpu-samples](https://github.com/Orillusion/orillusion-webgpu-samples)

## TODO

Page lazy loading
