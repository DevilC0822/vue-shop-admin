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
		<el-dialog title="添加用户" :visible.sync="addUserDialog">
			<el-form :model="addUserDialogFrom">
				<el-form-item label="用户名" label-width="70px">
					<el-input
						v-model="addUserDialogFrom.username"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="密码" label-width="70px">
					<el-input
						v-model="addUserDialogFrom.password"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="密码" label-width="70px">
					<el-input
						v-model="addUserDialogFrom.mobile"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="密码" label-width="70px">
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
				email: '',
			},
			addUserDialog: false,
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
		addUserDialogSubmit() {
			console.log('submit')
			this.addUserDialog = false
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
