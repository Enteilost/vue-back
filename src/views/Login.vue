<template>
  <div class="login-main">
    <!-- 背景图 -->
    <img class="bg-img" src="../assets/img/bg.jpeg" alt="" />

    <!-- 登录表单 -->
    <el-form :model="ruleForm" status-icon :rules="rules" label-position="left" ref="ruleForm" label-width="80px"
      class="rule-form">
      <!-- 用户名 -->
      <el-form-item label="用户名:" prop="username">
        <el-input v-model="ruleForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item label="密码:" prop="password">
        <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label-width="0px">
        <!-- 登录按钮 -->
        <el-button type="primary" @click="submitForm()">登录</el-button>
        <!-- 重置按钮 -->
        <el-button type="info" @click="resForm()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {
    LoginIn
  } from '@/assets/js/package.js'
  export default {
    data() {
      return {
        ruleForm: {
          username: "admin",
          password: "123456",
        },
        rules: {
          username: [{
              required: true,
              message: "请输入用户名",
              trigger: "blur",
            },
            {
              min: 2,
              max: 5,
              message: "长度在 2 到 5 个字符",
              trigger: "blur",
            },
          ],
          password: [{
              required: true,
              message: "请输入密码",
              trigger: "blur",
            },
            {
              min: 6,
              max: 12,
              message: "长度在 6 到 12 个字符",
              trigger: "blur",
            },
          ],
        },
      };
    },

    methods: {
      // 登录
      submitForm() {
        //   登录验证
        this.$refs.ruleForm.validate(async (vali) => {
          if (!vali) return;
          //   验证成功 向登录接口发起请求
          LoginIn(this.ruleForm).then(res => {
            //   console.log(res)
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.$message.success(res.meta.msg);
            // 登录成功保存 token 到 stroage 里面
            // const token =
            window.sessionStorage.setItem("token", res.data.token);
            // 登录保存 token 后设置跳转到后台主页
            this.$router.push("/home");
          }).catch(err => {
            console.log(err)
          })

        });
      },
      resForm() {
        //   重置登录验证
          this.$refs.ruleForm.resetFields();
      },
    },
    // 创建前
    beforeCreate() {},
    // 创建后
    created() {},
    // 挂载前
    beforeMount() {},
    // 挂载后
    mounted() {},
    // 更新前
    beforeUpdate() {},
    // 更新后
    updated() {},
    // 摧毁前
    beforeDestroy() {},
    // 摧毁后
    destroyed() {},
  };

</script>

<style scoped>
  .login-main {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  .bg-img {
    width: 1920px;
    height: 1080px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -960px;
    margin-top: -540px;
  }

  .rule-form {
    width: 400px;
    height: 200px;
    padding: 40px 40px 0px 40px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -240px;
    margin-top: -120px;
    z-index: 2;
    background: #fff;
    border-radius: 10px;
  }

</style>
