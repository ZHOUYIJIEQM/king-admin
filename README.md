# 记录流程

### 后台管理 ```web```

#### 配置路径别名
##### 安装 ```@types/node```
```bash
yarn @types/node -D
```
##### 修改 vite.config.ts
```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // 路径别名
    },
    extensions: [".js", ".json", ".ts"],
  }
});
```
##### ts项目要修改 ```tsconfig.json```
```json
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
    // 路径配置
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "exclude": ["node_modules"],
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### 使用```vue-router```、 ```pinia```
##### 安装
```bash
yarn add vue-router pinia
```
##### 使用 ```vue-router```
1. ```src``` 下新建 ```router/index.js```
```js
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Login from '../views/Login.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Login
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router
```
2. 在 ```mian.js``` 导入
```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
```
##### 使用 ```pinia```
1. 新建 ```store/index.js```
```js
import { defineStore } from 'pinia'
export const mainStore = defineStore('main', {
  state: () => {
    return {
      msg: '数据'
    }
  },
  getters: {},
  actions: {}
})
```
2. ```main.js``` 挂载
```js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinna = createPinia()
app.use(router)
app.use(pinia)
app.mount('#app')
```
3. 在组件里使用
```js
<script setup>
import { mainStore } from '../store';
const store = mainStore()
console.log(store.msg)
</script>
```

#### 使用```Element Plus```, 自动导入, 安装好后就可以直接使用
```bash
yarn add element-plus
yarn add unplugin-vue-components unplugin-auto-import -D
```
```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
});
```

#### 使用 ```sass```
```bash
yarn add sass -D
```

#### ```css reset```
```css
/* http://meyerweb.com/eric/tools/css/reset/ 
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
在 ```main.js``` 引入

#### 使用 ```nprogress```
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

#### 使用 ```axios```
```js
import axios, { type AxiosRequestConfig } from 'axios'
const instance = axios.create({
  baseURL: "http://192.168.31.43:3333/admin/api",
  timeout: 5000,
})
instance.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    // 加入 token
    const token = sessionStorage.token
    if (token) {
      config.headers.Authorization = `Bear ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error);
  }
)
instance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // todo: 加入未登录跳转
  }
)

export default {
  install(app:any) {
    // 类似 vue2:  Vue.prototype.$http = instance
    app.config.globalProperties.$http = instance;
  }
};

// 在组件里使用时
let app:any = getCurrentInstance()
let request = app.appContext.config.globalProperties.$http
// 这样就可以发请求了
request.get(...)
```


#### 设置了 ```scoped``` 修改 ```element-ui``` 的样式
```scss
<style lang="scss" scoped>
/* 使用深度选择器 */
:deep(选择器) {
  /* ... */
}
</style>
```

#### ```vite.config.ts``` 局域网访问
```json
server: {			
  // 设置后可以通过局域网访问
  host: '0.0.0.0',
  // port: 3000,  // 端口号，一般情况下为8080
}
```

#### 侧边栏 ```el-aside```, 展开/折叠
```html
<!-- 设置宽度auto -->
<el-aside width="auto">
  <el-scrollbar>
    <el-menu
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
    ></el-menu>
  </el-scrollbar>
</el-aside>
<style lang="scss" scoped>
  .el-menu-vertical-demo {
    // 去掉边框,不然边缘看起来对不齐
    border: none;
    &:not(.el-menu--collapse) {
      width: 200px;
    }
  }
</style>
```
但这种做法在右侧内容区域使用表格后, 展开/收缩会很卡
```html
<el-aside :width="isCollapse ? '64px' : '200px'" class="aside-box">
  <el-menu
    :collapse-transition="false"
  ></el-menu>
</el-aside>

<style lang="scss" scoped>
  .aside-box {
    /* 加这个过渡时长 */
    transition: width .2s;
  }
</style>
```

#### 使用 ```ElMessageBox```, 弹出框没有样式
```bash
yarn add -D unplugin-element-plus
```
编辑```vite.config.ts```
```ts
import ElementPlus from 'unplugin-element-plus/vite'
export default {
  plugins: [ElementPlus()],
}
```

#### 在多个组件都使用 ```loading```
新建 ```utils/loading.ts```
```ts
import { ElLoading } from 'element-plus'
let loadingFlag:any = null
function openLoading() {
  loadingFlag = ElLoading.service({
    lock: true,
    text: '正在加载...',
    background: 'rgba(0, 0, 0, 0.6)',
  })
}
function closeLoading() {
  setTimeout(() => {
    loadingFlag.close()
  }, 300)
}
export default {
  openLoading,
  closeLoading
}
```
在组件使用时
```ts
import loading from '@/utils/loading'
loading.openLoading()
loading.closeLoading()
```

#### ```reactive```数组, 异步获取数据后赋值无效?!
```ts
let data = reactive([])
setTimeout(() => {
  data = [{a: 'a'}, {b: 'b'}]
}, 1000)

<div>{{data}}</div> // 一秒后数据没有更新, 一直是 []
```
换成 ```ref```, 则没问题
```ts
let data = ref([])
setTimeout(() => {
  data.value = [{a: 'a'}, {b: 'b'}]
}, 1000)

<div>{{data}}</div> // 一秒后数据会更新
```
如果还要使用 ```reactive```
```ts
// 写成对象
let data = reactive({treeData: []})
setTimeout(() => {
  data.treeData = [{a: 'a'}, {b: 'b'}]
}, 1000)

<div>{{data}}</div> // 一秒后数据会更新
```

#### 无法获取 ```el-dialog``` 里面的 ref dom
间接获取
```js
const app = getCurrentInstance()
app?.ctx.$refs.formName?.focus()
```



