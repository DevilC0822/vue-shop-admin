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
				<el-table-column type="expand">
					<template slot-scope="scope">
						<el-row
							v-for="item in scope.row.children"
							:key="item.id"
							:class="{
								topBorder: scope.row.children.indexOf(item) == 0,
								bottomBorder: true,
							}"
						>
							<el-col :span="6">
								<el-tag
									closable
									@close="deleteSingleRight(scope.row, item.id)"
									>{{ item.authName }}</el-tag
								>
							</el-col>
							<el-col :span="18">
								<el-row v-for="item2 in item.children" :key="item2.id" :class="{
								topBorder: item.children.indexOf(item2) !== 0,
								bottomBorder: false,
							}">
									<el-col :span="8">
										<el-tag  closable type="success" @close="deleteSingleRight(scope.row, item2.id)">{{
											item2.authName
										}}</el-tag>
									</el-col>
									<el-col :span="16">
										<el-row v-for="item3 in item2.children" :key="item3.id">
											<el-col :span="12">
												<el-tag closable type="warning" @close="deleteSingleRight(scope.row, item3.id)">{{
													item3.authName
												}}</el-tag>
											</el-col>
										</el-row>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<el-table-column type="index" width="50" label="序号"> </el-table-column>
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
						>
						<el-button @click="assign(scope.row)" type="text" size="small"
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

		<!-- 分配权限弹出框 -->
		<el-dialog title="分配权限" :visible.sync="assignDialog">
			<el-tree
				v-if="rightsTree.length > 0"
				:data="rightsTree"
				show-checkbox
				node-key="id"
				default-expand-all
				:default-checked-keys="defaultChecked"
				ref="rightsTreeRef"
				:props="defaultProps"
			>
			</el-tree>

			<div slot="footer" class="dialog-footer">
				<el-button @click="assignDialog = false">取 消</el-button>
				<el-button type="primary" @click="assignSubmit">确 定</el-button>
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
			rightsTree: [],

			addRolesForm: {
				roleName: '',
				roleDesc: '',
			},
			editRolesForm: {},
			addRolesRules: {
				roleName: [
					{
						required: true,
						message: '用户名不能为空',
						trigger: 'blur',
					},
				],
				roleDesc: [
					{
						required: true,
						message: '用户名不能为空',
						trigger: 'blur',
					},
				],
			},
			editRolesRules: {
				roleName: [
					{
						required: true,
						message: '用户名不能为空',
						trigger: 'blur',
					},
				],
				roleDesc: [
					{
						required: true,
						message: '用户名不能为空',
						trigger: 'blur',
					},
				],
			},
			addRolesDialog: false,
			editRolesDialog: false,
			assignDialog: false,
			defaultProps: {
				children: 'children',
				label: 'authName',
			},
			defaultChecked: [],
			currentRolesId: null,
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
		async getRightsTree() {
			const { data: res } = await this.$http({
				url: `rights/tree`,
				method: 'GET',
			})
			if (res.meta.status !== 200)
				return this.$message.error('获取树形节点失败')
			this.rightsTree = res.data
			console.log(this.rightsTree)
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
		async deleteSingleRight(roles, rightId) {
			console.log(roles, rightId)

			const confirmResult = await this.$confirm(
				'此操作将永久删除该文件, 是否继续?',
				'提示',
				{
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}
			).catch((err) => err)
			if (confirmResult !== 'confirm') {
				return this.$message.info('取消了删除!')
			}
			const { data: res } = await this.$http.delete(
				`roles/${roles.id}/rights/${rightId}`
			)
			if (res.meta.status !== 200) {
				return this.$message.error('删除权限失败!')
			}
			// this.getRolesList()
			// 直接调用获取用户的方法会导致展开栏的关闭,这样体验不好
			// 可以直接把返回的最新数据直接赋值
			roles.children = res.data
		},
		assign(arg) {
			console.log(arg)
			this.getRightsTree()
			this.defaultChecked.length = 0
			for (const iterator1 of arg.children) {
				for (const iterator2 of iterator1.children) {
					for (const iterator3 of iterator2.children) {
						this.defaultChecked.push(iterator3.id)
					}
				}
			}
			this.currentRolesId = arg.id
			console.log(this.currentRolesId)

			this.assignDialog = true
		},
		async assignSubmit() {
			console.log(this.$refs.rightsTreeRef)
			let key = []
			for (const item of this.$refs.rightsTreeRef.getHalfCheckedKeys()) {
				key.push(item)
			}
			for (const item of this.$refs.rightsTreeRef.getCheckedKeys()) {
				key.push(item)
			}
			let strKey = key.join(',')
			// const { data: res } = await this.$http({
			// 	url: `roles/${this.currentRolesId}/rights`,
			// 	method: 'post',
			// 	params: {
			// 		rids: strKey,
			// 	},
			// })
			const { data: res } = await this.$http.post(
				`roles/${this.currentRolesId}/rights`,
				{ rids: strKey }
			)
			this.assignDialog = false
			if (res.meta.status !== 200)
				return this.$message.error('更新角色权限失败')

			this.getRightsRoles()
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

	.topBorder {
		border-top: 1px solid #f5f5f5;
	}

	.bottomBorder {
		border-bottom: 1px solid #f5f5f5;
	}

	.el-table {
		margin-top: 15px;
	}

	.el-col-6 {
		text-align: center;
	}

	.el-row {
		display: flex;
		align-items: center;
		padding: 3px 0;
	}

	.el-tag {
		margin: 5px 0;
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
