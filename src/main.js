import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { faCat, faBars, faPlus, faSearch, faHome, faInfoCircle} from '@fortawesome/free-solid-svg-icons'
library.add(faCat, faBars, faPlus, faSearch, faHome, faInfoCircle);


const app = createApp(App).use(store).use(router)
app.component("font-awesome-icon", FontAwesomeIcon);
app.config.productionTip = false

app.mount('#app')
