import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import {registerPlugins} from "./plugins";
import {route} from "./router/router.ts";
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';
const app = createApp(App)

registerPlugins(app)
app.use(route)
app.use(VCalendar, {})

app.mount('#app')
