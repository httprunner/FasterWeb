<template>
    <div class="background_img">
        <img src="~@/assets/images/bg.jpg">
        <div class="main">
            <div class="header">
                <h2>Welcome to FasterRunner</h2>
            </div>

            <div class="register_main clearfix" style="margin-top: -33px">
                <div style="margin-top: 20px">
                    <el-form :model="loginForm"
                             status-icon
                             :rules="rules"
                             ref="loginForm"
                             label-width="80px"
                             class="registerForm">
                        <el-form-item label="用户名" prop="username" style="font-weight: bold;">
                            <el-input type="text" v-model="loginForm.username" auto-complete="off"
                                      style="width: 350px;"></el-input>
                        </el-form-item>

                        <el-form-item label="密码" prop="password" style="font-weight: bold;">
                            <el-input type="password" v-model="loginForm.password" auto-complete="off"
                                      style="width: 350px"></el-input>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="submitForm('loginForm')">提交</el-button>
                            <el-button @click="resetForm('loginForm')">重置</el-button>
                            <router-link to="/fastrunner/register" style="margin-left: 30%">
                                <el-button type="danger">注册</el-button>
                            </router-link>
                        </el-form-item>
                    </el-form>

                </div>
            </div>
        </div>


    </div>


</template>

<script>

    export default {
        name: "Login",
        data() {
            var validateUser = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('用户名不能为空'));
                }
                callback();
            };

            var validatePassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('密码不能为空'));
                }
                callback();
            };


            return {
                loginForm: {
                    username: '',
                    password: '',
                },
                rules: {
                    username: [
                        {validator: validateUser, trigger: 'blur'}
                    ],
                    password: [
                        {validator: validatePassword, trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            handleRegisterSuccess(resp) {
                if (resp['success']) {
                    this.$router.push('/fastrunner/index')
                } else {
                    this.$message.error({
                        message: resp["msg"],
                        duration: 2000,
                        center: true
                    })
                }
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$api.login(this.loginForm).then(resp => {
                            this.handleRegisterSuccess(resp)
                        }).catch(resp => {
                            this.$message.error({
                                message:'服务器连接超时，请重试',
                                duration:1000
                            })
                        })
                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style scoped>

    .background_img img {
        overflow: hidden;
        background-repeat: no-repeat;
        width: 100%;
        height: 100%;
        position: absolute;
    }

    .main {
        position: absolute;
        top: 20%;
        left: 35%;
    }

    .register_main {
        /*background: #3878949;*/
        width: 100%;
        height: 400px;
        border-radius: 3px;

    }

    .header h2 {
        color: #fff;
        font-size: 40px;
    }

    .clearfix:before {
        content: '';
        display: table;
    }
</style>
