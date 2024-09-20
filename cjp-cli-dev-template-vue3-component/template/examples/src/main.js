import { createApp } from 'vue'
import App from './App.vue'
import LegoComponents from '../../dist/<%= projectName %>.esm'

const app = createApp(App)

app.use(LegoComponents)

app.mount('#app')
