import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const routers = [
    {
        path: '/',
        component: require('./views/App'),
        children: [
            {
                path: '/home',
                name: 'home',
                component(resolve) {
                    require.ensure(['./views/index.vue'], () => {
                        resolve(require('./views/index.vue'));
                    });
                },
                meta: { requiresAuth: true }
            }, {
                path: '/result',
                name: 'result',
                component(resolve) {
                    require.ensure(['./views/result.vue'], () => {
                        resolve(require('./views/result.vue'));
                    });
                },
                meta: { requiresAuth: true }
            }, {
                path: '/result2',
                name: 'result2',
                component(resolve) {
                    require.ensure(['./views/result2.vue'], () => {
                        resolve(require('./views/result2.vue'));
                    });
                },
                meta: { requiresAuth: true }
            }, {
                path: '/searchhistory',
                name: 'searchhistory',
                component(resolve) {
                    require.ensure(['./views/searchhistory.vue'], () => {
                        resolve(require('./views/searchhistory.vue'));
                    });
                }
            }, {
                path: '/login',
                name: 'login',
                component(resolve) {
                    require.ensure(['./views/login.vue'], () => {
                        resolve(require('./views/login.vue'));
                    });
                }
            }
        ]
    }
];

const router = new VueRouter({
    routes: routers,
    history: true,
    linkActiveClass: 'active'
});

export default router;
