var _defaultApi = {
    debug: {
        showHot: 'http://192.168.130.210:8081/hotpoint/list',
        groundTaskList: 'http://10.172.20.48:8085/static/mock/ground_tasks.json',
        saveMission: 'http://192.168.130.210:8081/task/updateTask',
        view: 'http://192.168.130.210:8081/illegal/list',
        saveTask: 'http://192.168.130.210:8081/task/h5SaveTask',
        taskType: 'http://192.168.130.210:8081/task/taskTypeList',
        taskStatus: 'http://192.168.130.210:8081/task/taskStatusList',
        getTodayMission: 'http://192.168.130.210:8081/task/groundTaskCount'
    },
    product: {
        showHot: '/hotpoint/list',
        groundTaskList: '/task/groundTaskList',
        // groundTaskList: '/static/mock/ground_tasks.json',
        saveMission: '/task/updateTask',
        view: '/illegal/list',
        saveTask: '/task/h5SaveTask',
        taskType: '/task/taskTypeList',
        taskStatus: '/task/taskStatusList',
        getTodayMission: '/task/groundTaskCount'
    }
}
module.exports = {
    getApi: function(env, name) {
        // var type = env == 'product' ? env : 'debug'
            var type = 'debug'
        return _defaultApi[type][name]
    }
}