//定制请求的实例

//导入axios  npm install axios
import axios from 'axios';
import { ElMessage } from 'element-plus';
//定义一个变量,记录公共的前缀  ,  baseURL
// const baseURL = 'http://localhost:8080';
const baseURL = '/api';
const instance = axios.create({ baseURL })

import { useTokenStore } from '@/stores/token.js';
//添加请求拦截器
instance.interceptors.request.use(
    (config) => {
        //请求前的回调
        //添加token
        let tokenStore = useTokenStore();
        if (tokenStore.token) {
            config.headers.Authorization = tokenStore.token;
        }
        return config;
    },
    (err) => {
        //请求错误回调
    }
)

// import { useRouter } from 'vue-router';
// const router = useRouter();

import router from '@/router';

//添加响应拦截器
instance.interceptors.response.use(
    result => {
        //判断业务状态码
        if (result.data.code === 0) {
            return result.data;
        }

        // alert(result.message ? result.message : '服务异常');
        ElMessage.error(result.data.message ? result.data.message : '服务异常')
        return Promise.reject(result.data);//异步的状态转化成失败的状态
    },
    err => {
        //判断相应状态码，若为401，则证明未登录，需要提示请登录，并转到登录界面
        if (err.response.status === 401) {
            ElMessage.error('请先登录');
            router.push('/login')
        } else {
            ElMessage.error('服务异常');
        }
        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)




export default instance;