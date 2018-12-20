import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home/Home'
import Register from '@/pages/auth/components/Register'
import Login from '@/pages/auth/components/Login'
import ProjectList from '@/pages/project/ProjectList'
import DataBase from '@/pages/project/DataBase'
import ProjectDetail from '@/pages/project/ProjectDetail'
import DebugTalk from '@/pages/httprunner/DebugTalk'
import RecordApi from '@/pages/fastrunner/api/RecordApi'
import AutoTest from '@/pages/fastrunner/case/AutoTest'
import RecordConfig from '@/pages/fastrunner/config/RecordConfig'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/fastrunner/register',
            name: 'Register',
            component: Register,
            meta: {
                title: '用户注册'
            }
        }, {
            path: '/fastrunner/login',
            name: 'Login',
            component: Login,
            meta: {
                title: '用户登录'
            }
        },
        {
            path: '/fastrunner',
            name: 'Home',
            component: Home,
            meta: {
                title: '首页',
            },
            children: [
                {
                    name: 'ProjectList',
                    path: 'index',
                    component: ProjectList,
                    meta: {
                        title: '项目列表',
                        requireAuth: true,
                    }
                },
                {
                    name: 'DataBase',
                    path: 'database',
                    component: DataBase,
                    meta: {
                        title: '数据库',
                        requireAuth: true,
                    }
                },
                {
                    name: 'ProjectDetail',
                    path:'project/:id/dashbord',
                    component: ProjectDetail,
                    meta: {
                        title: '项目预览',
                        requireAuth: true,
                    }

                },
                {
                    name: 'DebugTalk',
                    path:'debugtalk/:id',
                    component: DebugTalk,
                    meta: {
                        title: '编辑驱动',
                        requireAuth: true,
                    }

                },
                {
                    name: 'RecordApi',
                    path:'api_record/:id',
                    component: RecordApi,
                    meta: {
                        title: '接口模板',
                        requireAuth: true
                    }

                },
                {
                    name: 'AutoTest',
                    path:'auto_test/:id',
                    component: AutoTest,
                    meta: {
                        title: '自动化测试',
                        requireAuth: true
                    }

                },
                {
                    name: 'RecordConfig',
                    path:'record_config/:id',
                    component: RecordConfig,
                    meta: {
                        title: '环境管理',
                        requireAuth: true
                    }

                }
            ]
        }
    ]
})

