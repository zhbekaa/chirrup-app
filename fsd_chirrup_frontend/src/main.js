
import 'bootstrap/dist/css/bootstrap.css';


import { createApp } from 'vue'
import App from './views/App.vue'


import router from './router'


import { library } from '@fortawesome/fontawesome-svg-core'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faUserSecret } from '@fortawesome/free-solid-svg-icons'

import { faHeart, faEllipsisV, faCircleUser, faTrashCan } from '@fortawesome/free-solid-svg-icons';


/* add icons to the library */
library.add(faHeart, faEllipsisV, faCircleUser, faTrashCan)

createApp(App).use(router)
.component('font-awesome-icon', FontAwesomeIcon)
.mount('#app')
