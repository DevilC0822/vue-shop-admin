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
					<el-button @click="editUser(scope.row.id)" type="text" size="small"
						>修改</el-button
					>

					<template>
						<el-button
							type="text"
							size="small"
							@click="deleteUser(scope.row.id)"
							>删除</el-button
						>
					</template>
					<el-button @click="changeRole(scope.row)" type="text" size="small">分配角色</el-button>
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
			@close="addUserFormClose"
		>
			<el-form
				:model="addUserDialogForm"
				:rules="addUserRules"
				ref="addUserForm"
			>
				<el-form-item label="用户名" label-width="70px" prop="username">
					<el-input
						v-model="addUserDialogForm.username"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="密码" label-width="70px" prop="password">
					<el-input
						v-model="addUserDialogForm.password"
						autocomplete="off"
						type="password"
						show-password
					></el-input>
				</el-form-item>
				<el-form-item label="手机号" label-width="70px" prop="mobile">
					<el-input
						v-model="addUserDialogForm.mobile"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="邮箱" label-width="70px" prop="email">
					<el-input
						v-model="addUserDialogForm.email"
						autocomplete="off"
					></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addUserDialog = false">取 消</el-button>
				<el-button type="primary" @click="addUserDialogSubmit">确 定</el-button>
			</div>
		</el-dialog>

		<!-- 修改用户弹出框 -->
		<el-dialog
			title="修改用户"
			:visible.sync="editUserFormDialog"
			@close="editUserFormDialogClose"
		>
			<el-form :model="editUserForm" :rules="editUserRules" ref="editUserForm">
				<el-form-item label="用户名">
					<el-input
						v-model="editUserForm.username"
						autocomplete="off"
						disabled
					></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model="editUserForm.mobile" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="editUserForm.email" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editUserFormDialog = false">取 消</el-button>
				<el-button type="primary" @click="editUserDialogSubmit"
					>确 定</el-button
				>
			</div>
		</el-dialog>

    <!-- 分配角色弹出框 -->
    <el-dialog
  title="分配角色"
  :visible.sync="changeRoleDialog"
  :center="false"
  >
  <p>当前的用户:{{currentUser.username}}</p>
  <p>当前的角色:{{currentUser.role_name}}</p>

  <span>分配新角色:</span><el-select v-model="value" placeholder="请选择">
    <el-option
      v-for="item in rightsRoles"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>

  <span slot="footer" class="dialog-footer">
    <el-button @click="changeRoleDialog = false">取 消</el-button>
    <el-button type="primary" @click="changeRoleDialogSubmit">确 定</el-button>
  </span>
</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'Users',
	created() {
		this.getUserInfo()
    this.getRightsRoles()
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
      rightsRoles:{},
			usersInfo: [],
			usersTotal: 0,
			addUserDialogForm: {
				username: 'user',
				password: 'user',
				mobile: '1345327891',
				email: '1345327891@qq.com',
			},
			editUserForm: {},
			addUserDialog: false,
			editUserFormDialog: false,
      changeRoleDialog:false,
      currentUser: {},
      value:'',

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
			editUserRules: {
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
    		async getRightsRoles() {
			const { data: res } = await this.$http({
				url: 'roles',
				method: 'GET',
			})
			this.rightsRoles = res.data
      console.log(this.rightsRoles)
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
		async editUser(id) {
			console.log(id)
			// 传入id, 通过id获取用户信息
			let { data: res } = await this.$http({
				url: `/users/${id}`,
				method: 'get',
			})
			this.editUserForm = res.data

			this.editUserFormDialog = true
		},
		addUserDialogSubmit() {
			this.$refs.addUserForm.validate(async (valid) => {
				if (valid) {
		      console.log(this.addUserDialogForm)
					let {data:res} = await this.$http({
						url: 'users',
						method: 'post',
		        // 直接传入this.addUserDialogForm 提示用户名为空, 参数写死 仍然如此
						data: this.addUserDialogForm
					})
          console.log(res)
					if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
		      this.getUserInfo()
					this.addUserDialog = false
          this.$message.success('添加用户成功!')
				} else {
					this.$message.error('表单预验证未通过')
				}
			})
		},
		editUserDialogSubmit() {
			this.$refs.editUserForm.validate(async (valid) => {
		    if(valid) {
		      console.log(this.editUserForm)
		      const { data: res } = await this.$http({
		        url:`/users/${this.editUserForm.id}`,
		        method:'put',
		        data:{
		          mobile: this.editUserForm.mobile,
		          email:this.editUserForm.email
		        }
		      })
		      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
		      this.editUserFormDialog = false
		      this.getUserInfo()
          this.$message.success('更新用户信息成功!')
		    }
			})
		},


		async deleteUser(id) {
			this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					const { data: res } = await this.$http({
						url: `/users/${id}`,
						method: 'delete',
					})
					if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
					this.$message.success('删除用户成功!')

					if (this.usersInfo.length === 1) {
						// 判断当前展示的用户数据是否只有一条
						this.getUsersParams.pagenum = 1
							? 1
							: this.getUsersParams.pagenum - 1 // 若是，则继续判断页码是否已经在第一页，若否，则-1，若是则保持在该页
					}
					this.getUserInfo()
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					})
				})
		},

    changeRole(arg){
      console.log(arg)
      this.currentUser = arg
      this.value = ''
      this.changeRoleDialog = true
    },
    async changeRoleDialogSubmit(){

      if(!this.value) return this.$message.info('请选择新的角色')
      const { data: res } = await this.$http({
        url:`users/${this.currentUser.id}/role`,
        method:'put',
        data:{
          rid:this.value
        }
      })
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getUserInfo()
      this.changeRoleDialog = false
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
		addUserFormClose() {
			this.$refs.addUserForm.resetFields()
		},
		editUserFormDialogClose() {
			this.$refs.editUserForm.resetFields()
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
::v-deep .el-dialog {
  text-align: left;
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
