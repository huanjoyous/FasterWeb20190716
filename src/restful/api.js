import axios from 'axios'
import store from '../store/state'
import router from '../router'
import {Notification} from 'element-ui';


export const baseUrl = "http://localhost:8000";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = baseUrl;

axios.interceptors.request.use(function (config) {
    if (store.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
        config.headers.Authorization = `JWT ${store.token}`;
    }
    return config;
    },function (error) {
        return Promise.reject(error);
    });
axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    try {
        if (error.response.status === 401) {
            Notification.error({
                message: '请先登录'
            });
            router.replace({
                name: 'Login'
            })
        }else if (error.response.status === 403) {
            Notification.error({
                message: '您无权限访问，请联系管理员'
            });
        }else if (error.response.status === 500) {
            Notification.error({
                message: '服务器内部异常, 请检查'
            })
        }else{
            for (let key in error.response.data){
                if (error.response.data[key].constructor == Array){
                    Notification.error({
                        title: key,
                        message: error.response.data[key][0]
                        })
                }else if (error.response.data[key].constructor == String){
                    Notification.error({
                        title: key,
                        message: error.response.data[key]
                    })
                }
            }
        }
        return Promise.reject(error.response.data)
    }
    catch (e) {
        Notification.error({
            message: '服务器连接超时，请重试'
        })
    }
});

// user api
// export const register = params => {
//     return axios.post('/api/user/register/', params).then(res => res.data)
// };

export const login = params => {
    return axios.post('/api/user/login/', params).then(res => res)
};

// fastrunner api
export const addProject = params => {
    return axios.post('/api/fastrunner/project/', params).then(res => res)
};

export const deleteProject = url => {
    return axios.delete('/api/fastrunner/project/'+ url + '/').then(res => res)
};

export const getProjectList = params => {
    return axios.get('/api/fastrunner/project/').then(res => res)
};

export const getProjectDetail = pk => {
    return axios.get('/api/fastrunner/dashboard/' + pk + '/').then(res => res)
};

export const getPagination = url => {
    return axios.get(url).then(res => res)
};

export const updateProject = (url, params) => {
    return axios.patch('/api/fastrunner/project/' + url + '/', params).then(res => res)
};

export const addPycode = params => {
    return axios.post('/api/fastrunner/pycode/', params).then(res => res.data)
};

export const deletePycode = url => {
    return axios.delete('/api/fastrunner/pycode/' + url + '/').then(res => res.data)
};

export const delAllPycode = params => {
    return axios.delete('/api/fastrunner/pycode/', params).then(res => res.data)
};

export const getPycodeList = params => {
    return axios.get('/api/fastrunner/pycode/', params).then(res => res.data)
};

export const getPycodeListPaginationBypage = params => {
    return axios.get('/api/fastrunner/pycode/', params).then(res => res.data)
};

export const getPycode = url => {
    return axios.get('/api/fastrunner/pycode/' + url + '/').then(res => res.data)
};

export const runPycode = (url, params) => {
    return axios.post('/api/fastrunner/pycode/' + url + '/', params).then(res => res.data)
};

export const updatePycode = (url, params) => {
    return axios.patch('/api/fastrunner/pycode/' + url + '/', params).then(res => res.data)
};

export const getTree = (url, params) => {
    return axios.get('/api/fastrunner/tree/' + url + '/', params).then(res => res.data)
};

export const updateTree = (url, params) => {
    return axios.patch('/api/fastrunner/tree/' + url + '/', params).then(res => res.data)
};

export const uploadFile = params => {
    return baseUrl + '/api/fastrunner/file/'
};

export const downloadTestdata = params => {
    return axios.post('/api/fastrunner/download/',params,{responseType:'blob' })
};

export const testdataList = params => {
    return axios.get('/api/fastrunner/file/', params).then(res => res.data)
};

export const getTestdataListPaginationBypage = params => {
    return axios.get('/api/fastrunner/file/', params).then(res => res.data)
};

export const deleteTestdata = (url, params) => {
    return axios.delete('/api/fastrunner/file/' + url + '/', params).then(res => res)
};

export const delAllTestdata = (params,data) => {
    return axios.delete('/api/fastrunner/file/-1', {params,data}).then(res => res)
};

export const addAPI = params => {
    return axios.post('/api/fastrunner/api/', params).then(res => res.data)
};

export const updateAPI = (url, params) => {
    return axios.patch('/api/fastrunner/api/' + url + '/', params).then(res => res.data)
};

export const apiList = params => {
    return axios.get('/api/fastrunner/api/', params).then(res => res.data)
};

export const delAPI = url => {
    return axios.delete('/api/fastrunner/api/' + url + '/').then(res => res.data)
};

export const delAllAPI = params => {
    return axios.delete('/api/fastrunner/api/', params).then(res => res.data)
};

export const getAPISingle = url => {
    return axios.get('/api/fastrunner/api/' + url + '/').then(res => res.data)
};



export const getPaginationBypage = params => {
    return axios.get('/api/fastrunner/api/', params).then(res => res.data)
};



export const addTestCase = params => {
    return axios.post('/api/fastrunner/test/', params).then(res => res.data)
};

export const updateTestCase = (url, params) => {
    return axios.patch('/api/fastrunner/test/' + url + '/', params).then(res => res.data)
};

export const testList = params => {
    return axios.get('/api/fastrunner/test/', params).then(res => res.data)
};

export const deleteTest = url => {
    return axios.delete('/api/fastrunner/test/' + url + '/').then(res => res.data)
};

export const delAllTest = params => {
    return axios.delete('/api/fastrunner/test/', params).then(res => res.data)
};

export const coptTest = (url, params) => {
    return axios.post('/api/fastrunner/test/' + url + '/', params).then(res => res.data)
};

export const editTest = url => {
    return axios.get('/api/fastrunner/teststep/' + url + '/').then(res => res.data)
};

export const getTestPaginationBypage = params => {
    return axios.get('/api/fastrunner/test/', params).then(res => res.data)
};

export const addConfig = params => {
    return axios.post('/api/fastrunner/config/', params).then(res => res.data)
};

export const updateConfig = (url, params) => {
    return axios.patch('/api/fastrunner/config/' + url + '/', params).then(res => res.data)
};


export const configList = params => {
    return axios.get('/api/fastrunner/config/', params).then(res => res.data)
};

export const copyConfig = (url, params) => {
    return axios.post('/api/fastrunner/config/' + url + '/', params).then(res => res.data)
};

export const copyAPI = (url, params) => {
    return axios.post('/api/fastrunner/api/' + url + '/', params).then(res => res.data)
};

export const deleteConfig = url => {
    return axios.delete('/api/fastrunner/config/' + url + '/').then(res => res.data)
};
export const delAllConfig = params => {
    return axios.delete('/api/fastrunner/config/', params).then(res => res.data)
};

export const getConfigPaginationBypage = params => {
    return axios.get('/api/fastrunner/config/', params).then(res => res.data)
};

export const getAllConfig = url => {
    return axios.get('/api/fastrunner/config/' + url + '/').then(res => res.data)
};


export const runSingleAPI = params => {
    return axios.post('/api/fastrunner/run_api/', params).then(res => res.data)
};

export const runAPIByPk = (url, params) => {
    return axios.get('/api/fastrunner/run_api_pk/' + url + '/', params).then(res => res.data)
};

export const runAPITree = params => {
    return axios.post('/api/fastrunner/run_api_tree/', params).then(res => res.data)
};

export const runSingleTestSuite = params => {
    return axios.post('/api/fastrunner/run_testsuite/', params).then(res => res.data)
};

export const runSingleTest = params => {
    return axios.post('/api/fastrunner/run_test/', params).then(res => res.data)
};

export const runTestByPk = (url, params) => {
    return axios.get('/api/fastrunner/run_testsuite_pk/' + url + '/', params).then(res => res.data)
};

export const runSuiteTree = params => {
    return axios.post('/api/fastrunner/run_suite_tree/', params).then(res => res.data)
};

export const addVariables = params => {
    return axios.post('/api/fastrunner/variables/', params).then(res => res.data)
};

export const variablesList = params => {
    return axios.get('/api/fastrunner/variables/', params).then(res => res.data)
};

export const getVariablesPaginationBypage = params => {
    return axios.get('/api/fastrunner/variables/', params).then(res => res.data)
};


export const updateVariables = (url, params) => {
    return axios.patch('/api/fastrunner/variables/' + url + '/', params).then(res => res.data)
};

export const deleteVariables = url => {
    return axios.delete('/api/fastrunner/variables/' + url + '/').then(res => res.data)
};

export const delAllVariabels = params => {
    return axios.delete('/api/fastrunner/variables/', params).then(res => res.data)
};

export const reportList = params => {
    return axios.get('/api/fastrunner/reports/', params).then(res => res.data)
};

export const deleteReports = url => {
    return axios.delete('/api/fastrunner/reports/' + url + '/').then(res => res.data)
};

export const getReportsPaginationBypage = params => {
    return axios.get('/api/fastrunner/reports/', params).then(res => res.data)
};

export const delAllReports = params => {
    return axios.delete('/api/fastrunner/reports/', params).then(res => res.data)
};

export const watchSingleReports = url => {
    return axios.get('/api/fastrunner/reports/' + url + '/')
};

export const addTask = params => {
    return axios.post('/api/fastrunner/schedule/', params).then(res => res.data)
};
export const taskList = params => {
    return axios.get('/api/fastrunner/schedule/', params).then(res => res.data)
};
export const getTaskPaginationBypage = params => {
    return axios.get('/api/fastrunner/schedule/', params).then(res => res.data)
};
export const deleteTasks = url => {
    return axios.delete('/api/fastrunner/schedule/' + url + '/').then(res => res.data)
};

export const addHostIP = data => {
    return axios.post('/api/fastrunner/host_ip/', data)
};

export const hostList = params => {
    return axios.get('/api/fastrunner/host_ip/', params).then(res => res.data)
};

export const updateHost = (url, params,data) => {
    return axios({url:'/api/fastrunner/host_ip/' + url + '/',method:'PATCH', params:params,data:data})
};

export const deleteHost = (url, params)=> {
    return axios.delete('/api/fastrunner/host_ip/' + url + '/',params)
};

export const getHostPaginationBypage = params => {
    return axios.get('/api/fastrunner/host_ip/', params).then(res => res.data)
};
