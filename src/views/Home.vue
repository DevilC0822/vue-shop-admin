<template>
	<el-container class="home-container">
		<el-header>
      <h2>
      电商后台管理系统
      </h2>
    </el-header>
		<el-container>
			<el-aside width='initial'>
				<Aside></Aside>
			</el-aside>
			<el-container>
				<el-main>
					<Main>
            <router-view></router-view>
          </Main>
				</el-main>
			</el-container>
		</el-container>
	</el-container>
</template>

<script>
// @ is an alias to /src
import Aside from '@/views/layout/Aside.vue'
import Main from '@/views/layout/Main.vue'

export default {
	name: 'Home',
	components: {
		Aside,
		Main,
	},
	data() {
		const item = {
			date: '2016-05-02',
			name: '王小虎',
			address: '上海市普陀区金沙江路 1518 弄',
		}
		return {
			tableData: Array(20).fill(item),
		}
	},
}
</script>

<style lang="scss" scoped>
.home-container {
	height: 100vh;
	// min-width: 1024px;
}
.el-header {
	background-color: #b3c0d1;
	color: #333;
	line-height: 60px;
}
.el-main {
	padding: 0;
  background-color: #f5f5f5;
}

.el-aside {
	background-color: #334054;
	color: #bfcdb9;
	// width: initial !important;
}
</style>
