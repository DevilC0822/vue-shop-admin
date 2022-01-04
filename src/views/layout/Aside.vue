<template>
	<el-menu
		class="el-menu-vertical-demo"
		background-color="#334054"
		text-color="#bfcbd9"
		active-text-color="#409eff"
		@open="handleOpen"
		@close="handleClose"
		:collapse="isCollapse"
		unique-opened
		:collapse-transition="true"
		router
		:default-active="$route.path"
		v-if="asideNavInfo.length"
		@select="sendBreadcrumb"
	>
		<el-submenu
			:index="'/home/' + item.path"
			v-for="item in asideNavInfo"
			:key="item.id"
		>
			<template slot="title">
				<i :class="item.icon"></i>
				<span slot="title">{{ item.authName }}</span>
			</template>

			<el-menu-item
				:index="'/home/' + itemChild.path"
				v-for="itemChild in item.children"
				:key="itemChild.id"
			>
				<template slot="title">
					<i class="el-icon-menu"></i>
					<span slot="title">{{ itemChild.authName }}</span>
				</template>
			</el-menu-item>
		</el-submenu>
	</el-menu>
</template>

<script>
export default {
	name: 'Aside',
	data() {
		return {
			isCollapse: false,
			asideNavInfo: [],
			icon: {
				users: 'el-icon-user-solid',
				rights: 'el-icon-s-help',
				goods: 'el-icon-s-goods',
				orders: 'el-icon-s-order',
				reports: 'el-icon-s-marketing',
			},
		}
	},
	created() {
		this.getAsideNavInfo()
		this.$bus.$on('changeFold', (argument) => {
			// console.log(argument)
			this.isCollapse = !argument
		})
	},
	methods: {
		handleOpen(key, keyPath) {
			console.log(key, keyPath)
		},
		handleClose(key, keyPath) {
			console.log(key, keyPath)
		},
		sendBreadcrumb(key) {
			let asideNavInfo = this.asideNavInfo
			this.$bus.$emit('sendBreadcrumb', key, asideNavInfo)
		},
		async getAsideNavInfo() {
			const { data: res } = await this.$http({
				url: '/menus',
			})
			if (res.meta.status != 200) {
				return this.$message(res.meta.msg)
			}
			if (res.meta.status == 400) {
				window.sessionStorage.removeItem('token')
				this.$router.push('/login')
			}

			this.asideNavInfo = res.data
			// console.log(res)
			for (const key in this.icon) {
				for (const keyPath in this.asideNavInfo) {
					if (this.asideNavInfo[keyPath].path == key) {
						this.asideNavInfo[keyPath].icon = this.icon[key]
					}
				}
			}
			// console.log(this.asideNavInfo)
		},
	},
}
</script>

<style lang="scss" scoped>
.el-menu {
	border-right: none;
}

.el-submenu .el-menu-item {
	min-width: initial;
	padding: 0 40px;
}
::v-deep .el-menu-item,
::v-deep .el-submenu__title {
	padding-right: 60px;
}
</style>
