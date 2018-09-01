<template>
    <div class="background_img">
        <img src="~@/assets/images/bg.jpg">
        <div class="main">
            <div class="header">
                <h2>Welcome to FasterRunner</h2>
            </div>

            <div class="register_main clearfix" style="margin-top: -33px">
                <div style="margin-top: 20px">
                    <el-form :model="registerForm"
                             status-icon
                             :rules="rules"
                             ref="registerForm"
                             label-width="80px"
                             class="registerForm">
                        <el-form-item label="用户名" prop="username" style="font-weight: bold;">
                            <el-input type="text" v-model="registerForm.username" auto-complete="off"
                                      style="width: 350px;"></el-input>
                        </el-form-item>

                        <el-form-item label="密码" prop="password" style="font-weight: bold;">
                            <el-input type="password" v-model="registerForm.password" auto-complete="off"
                                      style="width: 350px"></el-input>
                        </el-form-item>

                        <el-form-item label="确认密码" prop="repwd" style="font-weight: bold;">
                            <el-input type="password" v-model="registerForm.repwd" auto-complete="off"
                                      style="width: 350px"></el-input>
                        </el-form-item>

                        <el-form-item label="邮箱" prop="email" style="font-weight: bold;">
                            <el-input type="email" v-model="registerForm.email" auto-complete="off"
                                      style="width: 350px"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('registerForm')">提交</el-button>
                            <el-button @click="resetForm('registerForm')">重置</el-button>
                            <router-link to="/fastrunner/login" style="margin-left: 30%">
                                <el-button type="danger">登陆</el-button>
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
        name: "Register",
        data() {
            var validateUser = (rule, value, callback) => {
                var uPattern = /^[a-zA-Z0-9_-]{4,16}$/;
                if (value === '') {
                    callback(new Error('用户名不能为空'));
                } else if (!uPattern.test(value)) {
                    callback(new Error('用户名4到16位,只能是字母,数字,下划线,连字符'));
                }
                callback();
            };

            var validatePassword = (rule, value, callback) => {
                var pPattern = /^[a-zA-Z\d_]{6,}$/;
                if (value === '') {
                    callback(new Error('密码不能为空'));
                } else if (!pPattern.test(value)) {
                    callback(new Error("密码至少6位数"));
                }
                callback();
            };

            var validateRepwd = (rule, value, callback) => {
                if (value !== this.registerForm.password || value === '') {
                    callback(new Error('确认密码和密码不一致'));
                }
                callback();
            };

            var validateEmail = (rule, value, callback) => {
                var ePattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                if (value === '') {
                    callback(new Error('邮箱不能为空'));
                } else if (!ePattern.test(value)) {
                    callback(new Error("邮箱格式不正确"));
                }
                callback();
            };

            return {
                registerForm: {
                    username: '',
                    password: '',
                    repwd: '',
                    email: ''
                },
                rules: {
                    username: [
                        {validator: validateUser, trigger: 'blur'}
                    ],
                    password: [
                        {validator: validatePassword, trigger: 'blur'}
                    ],
                    repwd: [
                        {validator: validateRepwd, trigger: 'blur'}
                    ],
                    email: [
                        {validator: validateEmail, trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            handleRegisterSuccess(resp) {
                if (resp['success']) {
                    this.$router.push('/fastrunner/login')
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
                        this.$api.register(this.registerForm).then(resp => {
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
