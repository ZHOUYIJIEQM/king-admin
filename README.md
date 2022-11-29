# Vue3 王者荣耀后台管理系统
> 基于Vue3+TypeScript+Vite+Vue-Router+Axios+Pinia开发, 项目还包含了[移动端王者荣耀](https://github.com/ZHOUYIJIEQM/king-mobile), [node+express后端](https://github.com/ZHOUYIJIEQM/king-server)

## 开始项目
```bash
# 创建项目
yarn create vite
# 按需选择
```

### 为方便开发, 需要做些配置, 如: 自动导入, 设置路径别名 (当前vite版本: 2.9.9) [element plus 按需导入](http://element-plus.org/zh-CN/guide/quickstart.html#%E6%8C%89%E9%9C%80%E5%AF%BC%E5%85%A5)
```js
yarn add -D @types/node unplugin-vue-components unplugin-auto-import unplugin-element-plus
// @types/node 路径别名
// unplugin-vue-components unplugin-auto-import vue自动导入, 配置后可以不用手动import组件
// unplugin-element-plus element plus 按需导入
```

```ts
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
// element plus 按需导入
import ElementPlus from 'unplugin-element-plus/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  // 打包后资源相对定位
  base: './',
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router']
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    ElementPlus()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // 路径别名
    },
    extensions: [".js", ".json", ".ts"],
  },
  server: {			
    // 设置可通过局域网访问(移动端开发有用)
    host: '0.0.0.0',
    // port: 3000,  // 设置端口号
  }
});
```
```ts
// tsconfig.json
{
  "compilerOptions": {
    "target": "esnext",
    "useDefineForClassFields": true,
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "jsx": "preserve",
    "sourceMap": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["esnext", "dom"],
    "skipLibCheck": true,
    "types": ["element-plus/global"],
    // 路径配置
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "noImplicitAny": false
  },
  "exclude": ["node_modules"],
  // include 加入 "./auto-imports.d.ts" 不然在 vscode 会提示报错
  "include": [
    "src/**/*.ts", 
    "src/**/*.d.ts", 
    "src/**/*.tsx", 
    "src/**/*.vue",
    "./auto-imports.d.ts"
  ],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 安装```sass```, 并设置重置浏览器默认样式
```bash
yarn add sass -D
```
#### [```css reset```重置浏览器默认css样式](https://meyerweb.com/eric/tools/css/reset/)
```scss
// @/styles/reset.scss
/* 
  http://meyerweb.com/eric/tools/css/reset/ 
  v2.0 | 20110126
  License: none (public domain)
*/
html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
  display: block;
}
body {
  line-height: 1;
}
ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
```
```ts
// 在 @/main.ts 引入
import "@/styles/reset.scss";
```
或者是在 ```@/App.vue``` 引入
```html
<style lang="scss">
@import '@/styles/reset.scss';
</style>
```
#### 设置了 ```scoped```(style里样式只作用于当前的组件, 使组件之间的样式不互相污染) 无法直接修改 ```element plus``` 的默认样式
```html
<style lang="scss" scoped>
/* 使用深度选择器 */
:deep(选择器) {
  /* ... */
}
</style>
```

### 使用```vue-router, pinia```
#### 安装模块
```bash
yarn add vue-router pinia
```
#### [使用 ```pinia```, 查看文档](https://pinia.web3doc.top/introduction.html)
使用插件
```ts
// 修改 @/main.ts
import { createPinia } from 'pinia'
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
```
创建 ```store```
```ts
// store/index.js
import { defineStore } from 'pinia'
export const useCounterStore = defineStore('counter', {
  state: () => {
    return { count: 0 }
  },
  // 也可以定义为
  // state: () => ({ count: 0 })
  getters: {},
  actions: {
    increment() {
      this.count++
    },
  },
})

// 也可以使用一个函数, 来为更高级的用例定义一个Store：
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment() {
    count.value++
  }
  return { count, increment }
})
```
在组件里使用时
```ts
<script lang="ts" setup>
import { useCounterStore } from '@/store/counter'
const counter = useCounterStore()
// 修改 count
counter.count++
// 或使用 $patch
counter.$patch({ count: counter.count + 1 })
// 或使用 actions 里的函数
counter.increment()
</script>
```

#### 使用```axios```, 封装```api```请求接口


#### 使用 [请求进度条```nprogress```](https://github.com/callumacrae/nprogress)
```bash
yarn add nprogress
# ts需要这个
yarn add -D @types/nprogress
```
```js
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.start()
NProgress.done()
```

#### 权限管理


#### 组件逻辑复用, 多个组件保存滚动高度, 在多个组件使用加载提示

#### 无法获取 ```el-dialog``` 里面的 ref dom
```dialog```里的内容是打开后才渲染的, 所以无法直接获取, 需要在```dialog```打开, 才能得到正确的```ref```

#### note: 有坑, 写过来

#### vue3 watch 新写法
```ts
watch(
  () => route.name, 
  (newV) => {
    // 设置面包屑
    newV && setBreadCrumb(newV)
  }, 
  { immediate: true }
)
// 可简化为
watchEffect(() => {
  // 设置面包屑
  setBreadCrumb(route.name)
})
```
```vue``` 会自动追踪 ```route.name``` 作为依赖。每当 ```route.name``` 变化时，回调会再次执行。