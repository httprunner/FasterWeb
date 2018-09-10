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

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/fastrunner/register',
            name: 'Register',
            component: Register,
            meta: {
                title: '注册页面'
            }
        }, {
            path: '/fastrunner/login',
            name: 'Login',
            component: Login,
            meta: {
                title: '登陆页面'
            }
        },
        {
            path: '/fastrunner',
            name: 'Home',
            component: Home,
            meta: {
                title: '首页'
            },
            children: [
                {
                    name: 'ProjectList',
                    path: 'index',
                    component: ProjectList,
                    meta: {
                        title: '项目列表'
                    }
                },
                {
                    name: 'DataBase',
                    path: 'database',
                    component: DataBase,
                    meta: {
                        title: '数据库'
                    }
                },
                {
                    name: 'ProjectDetail',
                    path:'project/:id/dashbord',
                    component: ProjectDetail,
                    meta: {
                        title: '项目预览'
                    }

                },
                {
                    name: 'DebugTalk',
                    path:'debugtalk/:id',
                    component: DebugTalk,
                    meta: {
                        title: '编辑驱动'
                    }

                },
                {
                    name: 'RecordApi',
                    path:'api_record/:id',
                    component: RecordApi,
                    meta: {
                        title: '接口'
                    }

                },
                {
                    name: 'AutoTest',
                    path:'auto_test/:id',
                    component: AutoTest,
                    meta: {
                        title: '用例'
                    }

                }
            ]
        }
    ]
})

