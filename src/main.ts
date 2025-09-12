import { createApp } from 'vue';
import App from '@/App.vue';
import 'virtual:svg-icons-register';
import Plugins from '@/plugins';
import 'animate.css';

const app = createApp(App);

app.use(Plugins);
app.mount('#app');
