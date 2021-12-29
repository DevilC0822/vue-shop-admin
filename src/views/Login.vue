<template>
  <div class='login'>
    <div class='login-card'>
      <el-form>
        <el-form-item>
          <span>用户名</span>
          <el-input prefix-icon="el-icon-user" v-model="userName"></el-input>
        </el-form-item>
        <el-form-item>
          <span>密码</span>
          <el-input prefix-icon="el-icon-lock" type="password" v-model="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">登录</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'Login',
    data() {
      return {
        userName: '',
        password: ''
      }
    },
    methods: {
      reset() {
        this.userName = ''
        this.password = ''
      }
    }
  }
</script>

<style lang='scss' scoped>
  .login {
    .login-card {
      width: 40%;
      height: 40vh;
      min-height: 300px;
      box-sizing: border-box;
      border: 1px solid #f5f5f5;
      margin: auto;
      transform: translate(0, 50%);
      padding: 12px 24px;
      box-shadow: 1px 1px 1px 1px #f5f5f5;
      border-radius: 16px;
    }

    ::v-deep .el-input__icon {
      margin-left: -25px;
    }

    ::v-deep .el-form {
      transform: translate(0, 50%);
    }

    ::v-deep .el-form-item__content {
      display: flex;

      &:last-child {
        justify-content: flex-end;
      }

      span {
        white-space: nowrap;
        min-width: 50px;
      }
    }
  }

  @media screen and (max-width:750px){
    .login {
      .login-card {
        width: 95%;
      }
    } 
  }
</style>