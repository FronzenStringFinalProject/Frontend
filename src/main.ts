import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import {registerPlugins} from "./plugins";
import {route} from "./router/router.ts";

const app = createApp(App)
registerPlugins(app)
app.use(route)

app.mount('#app')
