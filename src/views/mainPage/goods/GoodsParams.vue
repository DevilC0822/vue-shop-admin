<template>
	<div class="goods-params-view">
		<el-card class="box-card">
			<el-alert
				title="注意: 只允许为第三级分类设置相关参数!"
				type="info"
				show-icon
			>
			</el-alert>
			<el-row style="margin-top: 20px; text-align: left">
				<el-col>
					<span>选择商品分类: </span>
					<el-cascader
						v-model="goodsCategories.cat_id"
						:options="goodsCategories"
						clearable
						:props="{
							expandTrigger: 'hover',
							label: 'cat_name',
							value: 'cat_id',
							children: 'children',
						}"
						@change="handleChange"
					></el-cascader>
				</el-col>
			</el-row>

			<el-tabs
				type="border-card"
				@tab-click="changeTab"
				style="margin-top: 20px"
			>
				<el-tab-pane
					:disabled="currentCategoryId == null"
					label="动态参数"
					name="many"
				>
					<el-table :data="tableData" style="width: 100%">
						<el-table-column type="expand"> </el-table-column>
						<el-table-column type="index"> </el-table-column>
						<el-table-column label="参数名称" prop="attr_name"> </el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button
									@click="handleClick(scope.row)"
									type="text"
									size="small"
									>查看</el-button
								>
								<el-button type="text" size="small">编辑</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<el-tab-pane
					:disabled="currentCategoryId == null"
					label="静态描述"
					name="only"
					><el-table :data="tableData" style="width: 100%">
						<el-table-column type="expand"> </el-table-column>
						<el-table-column type="index"> </el-table-column>
						<el-table-column label="参数名称" prop="attr_name"> </el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button
									@click="handleClick(scope.row)"
									type="text"
									size="small"
									>编辑</el-button
								>
								<el-button type="text" size="small">删除</el-button>
							</template>
						</el-table-column>
					</el-table></el-tab-pane
				>
			</el-tabs>
		</el-card>
	</div>
</template>

<script>
export default {
	name: 'GoodsParamsView',
	data() {
		return {
			goodsCategories: [],
			currentCategoryId: null,
			currentCategoryKind: '',
      tableData:[]
		}
	},
	computed: {},
	methods: {
		async getGoodsCategoriesParams() {
			const { data: res } = await this.$http({
				url: '/categories',
				method: 'get',
			})
			this.goodsCategories = res.data
			console.log(res)
		},
		handleChange(value) {
			console.log(value)
			this.currentCategoryId = null
			this.currentCategoryId = value.length === 3 ? value[2] : null
			console.log(this.currentCategoryId)
			if (this.currentCategoryKind) {
				this.getCategory()
			}
		},
		changeTab(value) {
			this.currentCategoryKind = value.paneName
			this.getCategory()
		},
		async getCategory() {
			const { data: res } = await this.$http({
				url: `categories/${this.currentCategoryId}/attributes`,
				method: 'get',
				params: {
					sel: this.currentCategoryKind,
				},
			})
			console.log(res)
      this.tableData = res.data
		},
	},

	created() {
		this.getGoodsCategoriesParams()
	},

}
</script>

<style lang="scss" scoped>
.goods-params-view {
	padding: 15px;
}
</style>
