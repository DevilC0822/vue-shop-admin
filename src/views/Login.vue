<template>
	<div class="login">
		<div class="login-card">
			<el-form
				:rules="loginRules"
				:model="loginRuleForm"
				label-width="80px"
				ref="loginForm"
			>
				<el-form-item label="用户名" prop="userName">
					<el-input
						prefix-icon="el-icon-user"
						v-model="loginRuleForm.userName"
					></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input
						prefix-icon="el-icon-lock"
						type="password"
						v-model="loginRuleForm.password"
					></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="login">登录</el-button>
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
			loginRuleForm: {
				userName: 'admin',
				password: 'admin',
			},

			loginRules: {
				userName: [
					{
						required: true,
						message: '请输入用户名',
						trigger: 'blur',
					},
				],
				password: [
					{
						required: true,
						message: '请输入密码',
						trigger: 'blur',
					},
				],
			},
		}
	},
	methods: {
		reset() {
			this.$refs.loginForm.resetFields()
		},
		login() {
			this.$refs.loginForm.validate(async (isOk) => {
				if (!isOk) {
					this.$notify.error({
						title: '错误',
						message: '用户名或密码为不合规',
					})
					return
				}

				const { data: res } = await this.$http({
					url: '/login',
					params: {
						username: this.loginRuleForm.userName,
						password: this.loginRuleForm.password,
					},
				})
				console.log(res)
				if (res.meta.status === 200) {
          window.sessionStorage.setItem('token',res.data.token)
					this.$router.push('./home')
				} else {
					this.$notify.error({
						title: '错误',
						message: res.meta.msg,
					})
				}
			})
		},
	},
}
</script>

<style lang="scss" scoped>
.login {
	.login-card {
		width: 40%;
		height: 40vh;
		max-height: 300px;
		max-width: 450px;
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

@media screen and (max-width: 750px) {
	.login {
		.login-card {
			width: 95%;
		}
	}
}
</style>
