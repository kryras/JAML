import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import {
    faBars,
    faPlus,
    faSearch,
    faHome,
    faInfoCircle,
    faEraser,
    faCheck,
    faFrown,
    faExchangeAlt,
    faHourglassHalf,
    faPaintBrush,
    faTimes,
    faGraduationCap,
    faArrowUp
} from '@fortawesome/free-solid-svg-icons'
library.add(
    faBars,
    faPlus,
    faSearch,
    faHome,
    faInfoCircle,
    faEraser,
    faCheck,
    faFrown,
    faExchangeAlt,
    faHourglassHalf,
    faPaintBrush,
    faTimes,
    faGraduationCap,
    faArrowUp
);

const app = createApp(App).use(router)
app.component("font-awesome-icon", FontAwesomeIcon);
app.config.productionTip = false

app.mount('#app')
