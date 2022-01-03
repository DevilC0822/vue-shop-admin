<template>
	<div class="users-view">
		<!-- 添加用户行 -->
		<el-row :gutter="20">
			<el-col :span="12"
				><div class="grid-content bg-purple">
					<div style="margin-top: 15px">
						<el-input
							placeholder="请输入查找内容"
							v-model="getUsersParams.query"
							class="input-with-select"
							clearable
							@clear="getUserInfo"
							@keyup.enter.native="getUserInfo"
						>
							<el-button
								slot="append"
								icon="el-icon-search"
								@click="getUserInfo"
							></el-button>
						</el-input>
					</div></div
			></el-col>
			<el-col :span="3"
				><div class="grid-content bg-purple">
					<el-button
						type="primary"
						icon="el-icon-circle-plus-outline"
						@click="addUserDialog = true"
						>添加用户</el-button
					>
				</div></el-col
			>
		</el-row>

		<!-- 表格数据 -->

		<el-table :data="usersInfo" border style="width: 100%">
			<el-table-column type="index" width="50" align="center">
			</el-table-column>
			<el-table-column prop="username" label="姓名" width="150">
			</el-table-column>
			<el-table-column prop="email" label="邮箱" width="250"> </el-table-column>
			<el-table-column prop="mobile" label="电话" width="150">
			</el-table-column>
			<el-table-column prop="role_name" label="角色" width="150">
			</el-table-column>
			<el-table-column fixed="right" label="状态" width="100" align="center">
				<template slot-scope="scope">
					<el-switch
						v-model="scope.row.mg_state"
						active-color="#13ce66"
						inactive-color="#ff4949"
						@change="changeStatus(scope.row)"
					>
					</el-switch>
				</template>
			</el-table-column>
			<el-table-column
				fixed="right"
				label="操作"
				align="center"
				max-width="250"
				min-width="150"
			>
				<template slot-scope="scope">
					<el-button @click="handleClick(scope.row)" type="text" size="small"
						>修改</el-button
					>
					<el-button type="text" size="small">删除</el-button>
					<el-button type="text" size="small">分配角色</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="getUsersParams.pagenum"
			:page-sizes="[1, 2, 5, 10]"
			:page-size="getUsersParams.pagesize"
			layout="total, sizes, prev, pager, next, jumper"
			:total="usersTotal"
		>
		</el-pagination>

		<!-- 添加用户弹出框 -->
		<el-dialog
			title="添加用户"
			:visible.sync="addUserDialog"
			:close-on-click-modal="false"
			@close="addUserFromClose"
		>
			<el-form
				:model="addUserDialogFrom"
				:rules="addUserRules"
				ref="addUserFrom"
			>
				<el-form-item label="用户名" label-width="70px" prop="username">
					<el-input
						v-model="addUserDialogFrom.username"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="密码" label-width="70px" prop="password">
					<el-input
						v-model="addUserDialogFrom.password"
						autocomplete="off"
						type="password"
						show-password
					></el-input>
				</el-form-item>
				<el-form-item label="手机号" label-width="70px" prop="mobile">
					<el-input
						v-model="addUserDialogFrom.mobile"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="邮箱" label-width="70px" prop="email">
					<el-input
						v-model="addUserDialogFrom.email"
						autocomplete="off"
					></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addUserDialog = false">取 消</el-button>
				<el-button type="primary" @click="addUserDialogSubmit">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'Users',
	created() {
		this.getUserInfo()
	},
	data() {
		let checkMobil = (rule, value, callback) => {
			// if(!value) return callback(new Error('手机号不能为空'))
			const regMobile =
				/^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
			if (!regMobile.test(value)) return callback(new Error('手机号不合法'))
			return callback()
		}

		let checkEmail = (rule, value, callback) => {
			// if(!value) callback(new Error('邮箱不能为空'))
			const regEmail =
				/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
			if (!regEmail.test(value)) return callback(new Error('邮箱不合法'))
			return callback()
		}
		return {
			getUsersParams: {
				query: '',
				pagenum: 1,
				pagesize: 5,
			},
			userSearch: '',

			usersInfo: [],
			usersTotal: 0,
			addUserDialogFrom: {
				username: '',
				password: '',
				mobile: '',
				email: '@qq.com',
			},
			addUserDialog: false,

			addUserRules: {
				username: [
					{ required: true, message: '用户名不能为空', trigger: 'blur' },
					{ min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' },
				],
				password: [
					{ required: true, message: '密码不能为空', trigger: 'blur' },
					{
						min: 6,
						max: 15,
						message: '长度在 6 到 15 个字符',
						trigger: 'blur',
					},
				],
				mobile: [
					{ required: true, message: '手机号不能为空', trigger: 'blur' },
					{ validator: checkMobil, trigger: 'blur' },
				],
				email: [
					{ required: true, message: '邮箱不能为空', trigger: 'blur' },
					{ validator: checkEmail, trigger: 'blur' },
				],
			},
		}
	},
	methods: {
		async getUserInfo() {
			let { data: res } = await this.$http({
				url: '/users',
				params: this.getUsersParams,
			})
			console.log(res)
			if (res.meta.status != 200) return this.$message.error(this.meta.msg)
			this.usersInfo = res.data.users
			this.usersTotal = res.data.total
		},
		async changeStatus(user) {
			let { data: res } = await this.$http({
				url: `users/${user.id}/state/${user.mg_state}`,
				method: 'PUT',
			})
			console.log(res)
			if (res.meta.status != 200) {
				user.mg_state = !user.mg_state
				this.$message.error(this.meta.msg)
			}
			this.$message.success(res.meta.msg)
		},
		handleClick(argument) {
			console.log(argument)
		},
		// addUserDialogSubmit() {
		// 	this.$refs.addUserFrom.validate(async (valid) => {
		// 		if (valid) {
    //       console.log(this.addUserDialogFrom)
		// 			let {data:res} = await this.$http({
		// 				url: 'users',
		// 				method: 'post',
    //         // 直接传入this.addUserDialogFrom 提示用户名为空, 参数写死 仍然如此
		// 				params: {
    //           username:'Devil',
    //           password:'DevilC11',
    //           email:'',
    //           mobile:''
    //         }
		// 			})
		// 			console.log(res)
		// 			this.addUserDialog = false
    //       this.getUserInfo()
		// 		} else {
		// 			this.$message.error('表单预验证未通过')
		// 		}
		// 	})
		// },
        addUserDialogSubmit() {
      this.$refs.addUserFrom.validate(async valid => {
        console.log(valid)
        if (!valid) return this.$message.error('表单预验证未通过')
        // 可以发起添加用户请求
        const { data: res } = await this.$http.post('users', this.addUserDialogFrom)
        if (res.meta.status !== 201) {
          return this.$message.error('用户添加失败了~')
        }
        // 隐藏添加用户的对话框
        this.addUserDialog = false
        // 添加成后重新获取用户数据,不需要用户手动刷新
        this.getUserInfo()
        return this.$message.success('用户添加成功了~')
      })
    },

		// page-size改变
		handleSizeChange(newSize) {
			this.getUsersParams.pagesize = newSize
			this.getUserInfo()
		},

		// 页码值改变
		handleCurrentChange(newPage) {
			this.getUsersParams.pagenum = newPage
			this.getUserInfo()
		},

		//
		addUserFromClose() {
			this.$refs.addUserFrom.resetFields()
			// console.log(this.$refs)
		},
	},
}
</script>

<style lang="scss" scoped>
.users-view {
	background-color: #fff;
	margin: 15px;
	height: 100%;
	padding: 15px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.el-pagination {
	text-align: left;
}
.el-table--border {
	margin-top: 15px;
}
.grid-content div {
	margin: 0 !important;
}
</style>
