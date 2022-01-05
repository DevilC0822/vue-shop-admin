<template>
	<div class="roles-view">
		<el-card class="box-card">
			<el-button
				type="primary"
				icon="el-icon-circle-plus-outline"
				@click="addRolesDialog = true"
				>添加角色</el-button
			>

			<el-table :data="rightsRoles" border style="width: 100%">
				<el-table-column type="index" width="50"> </el-table-column>
				<el-table-column prop="roleName" label="角色名称"> </el-table-column>
				<el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
				<el-table-column fixed="right" label="操作" width="300">
					<template slot-scope="scope">
						<el-button @click="editRoles(scope.row.id)" type="text" size="small"
							>编辑</el-button
						>
						<el-button
							@click="deleteRoles(scope.row.id)"
							type="text"
							size="small"
							>删除</el-button
						><el-button @click="$message.info('gugugu~')" type="text" size="small"
							>分配权限</el-button
						>
					</template>
				</el-table-column>
			</el-table>
		</el-card>

		<!-- 添加角色弹出框 -->
		<el-dialog
			title="添加角色"
			:visible.sync="addRolesDialog"
			@close="addRolesClose"
		>
			<el-form :model="addRolesForm" :rules="addRolesRules" ref="addRolesRef">
				<el-form-item label="角色名称" prop="roleName">
					<el-input
						v-model="addRolesForm.roleName"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="角色描述" prop="roleDesc">
					<el-input
						v-model="addRolesForm.roleDesc"
						autocomplete="off"
					></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addRolesDialog = false">取 消</el-button>
				<el-button type="primary" @click="addRolesSubmit">确 定</el-button>
			</div>
		</el-dialog>

		<!-- 编辑角色弹出框 -->
		<el-dialog
			title="修改角色"
			:visible.sync="editRolesDialog"
			@close="editRolesClose"
		>
			<el-form
				:model="editRolesForm"
				:rules="editRolesRules"
				ref="editRolesRef"
			>
				<el-form-item label="角色名称" prop="roleName">
					<el-input
						v-model="editRolesForm.roleName"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item label="角色描述" prop="roleDesc">
					<el-input
						v-model="editRolesForm.roleDesc"
						autocomplete="off"
					></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editRolesDialog = false">取 消</el-button>
				<el-button type="primary" @click="editRolesSubmit">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'RightsRoles',
	data() {
		return {
			rightsRoles: [],
			addRolesForm: {
				roleName: '',
				roleDesc: '',
			},
			editRolesForm: {},
			addRolesRules: {
				roleName: [
					{ required: true, message: '用户名不能为空', trigger: 'blur' },
				],
				roleDesc: [
					{ required: true, message: '用户名不能为空', trigger: 'blur' },
				],
			},
			editRolesRules: {
				roleName: [
					{ required: true, message: '用户名不能为空', trigger: 'blur' },
				],
				roleDesc: [
					{ required: true, message: '用户名不能为空', trigger: 'blur' },
				],
			},
			addRolesDialog: false,
			editRolesDialog: false,
		}
	},
	methods: {
		async getRightsRoles() {
			const { data: res } = await this.$http({
				url: 'roles',
				method: 'GET',
			})
			this.rightsRoles = res.data
		},
		addRolesClose() {
			this.$refs.addRolesRef.resetFields()
		},
		editRolesClose() {
			this.$refs.editRolesRef.resetFields()
		},
		addRolesSubmit() {
			this.$refs.addRolesRef.validate(async (valid) => {
				if (!valid) return this.$message.error('表单预验证未通过')
				const { data: res } = await this.$http.post('roles', this.addRolesForm)
				if (res.meta.status !== 201) {
					return this.$message.error('角色添加失败了~')
				}
				this.addRolesDialog = false
				this.getRightsRoles()
				return this.$message.success('角色添加成功了~')
			})
		},
		async editRolesSubmit() {
			this.$refs.editRolesRef.validate(async (valid) => {
				if (!valid) return this.$message.error('表单预验证未通过')
				const { data: res } = await this.$http.put(
					'roles/' + this.editRolesForm.roleId,
					{
						roleName: this.editRolesForm.roleName,
						roleDesc: this.editRolesForm.roleDesc,
					}
				)
				if (res.meta.status !== 200) {
					return this.$message.error('角色编辑失败了~')
				}
				this.editRolesDialog = false
				this.getRightsRoles()
				return this.$message.success('角色编辑成功了~')
			})
		},

		async editRoles(id) {
			let { data: res } = await this.$http({
				url: `/roles/${id}`,
				method: 'get',
			})
			this.editRolesForm = res.data
			this.editRolesDialog = true
		},
		deleteRoles(id) {
			this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(async () => {
					const { data: res } = await this.$http({
						url: `/roles/${id}`,
						method: 'delete',
					})
					if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
					this.$message.success('删除角色成功!')
					this.getRightsRoles()
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除',
					})
				})
		},
	},
	created() {
		this.getRightsRoles()
	},
}
</script>

<style lang="scss" scoped>
.roles-view {
	padding: 15px;

	.el-table {
		margin-top: 15px;
	}

	.el-form-item ::v-deep .el-form-item__content {
		width: 75%;
		display: flex;
	}

	::v-deep .el-card__body {
		text-align: left;
	}
}
</style>
