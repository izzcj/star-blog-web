import { createApp } from 'vue';
import App from '@/App.vue';
import 'virtual:svg-icons-register';
import Plugins from '@/plugins';
import '@/styles/tailwind/index.css';
import 'animate.css';

const app = createApp(App);

app.use(Plugins);
app.mount('#app');
