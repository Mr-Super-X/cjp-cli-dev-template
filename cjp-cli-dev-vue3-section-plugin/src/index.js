import { createApp } from 'vue'
// 难点是如何拿到这个Section
import App from '@section'

const app = createApp(App)

app.mount('#app-section')