import { createApp } from 'vue';
import App from '@/App.vue';
import 'virtual:svg-icons-register';
import '@/styles/tailwind.css';
import 'animate.css';
import Plugins from '@/plugins';

const app = createApp(App);

app.use(Plugins);
app.mount('#app');
