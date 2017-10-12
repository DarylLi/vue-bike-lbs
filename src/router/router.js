import App from '../App'
const map = r => require.ensure([], () => r(require('../pages/map')), 'map')
const pendingMission = r => require.ensure([], () => r(require('../pages/pendingMission')), 'pendingMission')
const allMission = r => require.ensure([], () => r(require('../pages/allMission')), 'allMission')
const addMission = r => require.ensure([], () => r(require('../pages/addMission')), 'addMission')
const todayMission = r => require.ensure([], () => r(require('../pages/todayMission')), 'todayMission')

export default [{
    path: '/',
    component: App,
    children: [{
        path: 'map',
        component: map,
        meta: {
            hasMenu: true
        }
    }, {
        path: 'pending',
        component: pendingMission,
        meta: {
            hasMenu: true
        }
    }, {
        path: 'all',
        component: allMission,
        meta: {
            hasMenu: true
        }
    }, {
        path: 'add',
        component: addMission,
        meta: {
            hasMenu: true
        }
    }, {
        path: '',
        component: todayMission,
        meta: {
            hasMenu: true
        }
    }]
}]