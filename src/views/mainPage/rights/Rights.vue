<template>
	<div class="rights-view">
		<el-card class="box-card">
			<el-table :data="rightsList" border style="width: 100%">
				<el-table-column type="index" width="50"> </el-table-column>
				<el-table-column prop="authName" label="权限名称"> </el-table-column>
				<el-table-column prop="path" label="权限路径"> </el-table-column>
				<el-table-column prop="level" label="权限等级">
					<template slot-scope="scope">
						<el-tag v-if="scope.row.level == 0">一级</el-tag>
						<el-tag type="success" v-if="scope.row.level == 1">二级</el-tag>
						<el-tag type="warning" v-if="scope.row.level == 2">三级</el-tag>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
export default {
	name: 'RightsList',
	data() {
		return {
			rightsList: [],
		}
	},
	methods: {
		async getRightsList() {
			const { data: res } = await this.$http({
				url: `rights/list`,
				method: 'GET',
			})
			this.rightsList = res.data
		},
	},
	created() {
		this.getRightsList()
	},
}
</script>

<style lang="scss" scoped>
.rights-view {
	padding: 15px;
}
</style>
