import Vue from 'vue'
import Router from 'vue-router'
import editor from '../components/editor.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/editor',
      name: '/editor',
      component: editor
    }

  ]
})
