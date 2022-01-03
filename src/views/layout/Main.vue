<template>
	<div class="main">
		<div class="main-header">
			<div>
				<!-- <i v-show="isFold" @click="changeFold" class="el-icon-s-fold"></i>
				<i v-show="!isFold" @click="changeFold" class="el-icon-s-unfold"></i> -->
			</div>
			<el-breadcrumb separator-class="el-icon-arrow-right" ref='breadcrumb' v-show='isShowHomeBreadcrumb'>
				<el-breadcrumb-item @click.native='goHome'>首页</el-breadcrumb-item>
				<el-breadcrumb-item v-for="(item,index) in breadcrumb" :key='index'>{{item}}</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<router-view></router-view>
	</div>
</template>

<script>
export default {
	name: 'Main',
	data() {
		return {
			isFold: true,
			breadcrumb: [],
      isShowHomeBreadcrumb:true
		}
	},
	methods: {
		changeFold() {
			this.isFold = this.isFold ? false : true
			this.$bus.$emit('changeFold', this.isFold)
		},
		find(str, arr) {
			for (const item of arr) {
        item.children
				if (item.children) {
					for (const itemChild of item.children) {
						if (itemChild.path == str) return {child:itemChild,parent:item}
					}
				}
			}
		},
    goHome() {
      this.$router.push('/home')
      this.breadcrumb.length = 0
      window.sessionStorage.setItem('breadcrumb',this.breadcrumb)
    }
	},
  created() {
    this.breadcrumb = window.sessionStorage.getItem('breadcrumb').split(',')
  },
	mounted() {
		this.$bus.$on('sendBreadcrumb', (key, asideNavInfo) => {
			let breadcrumb = []
			breadcrumb = key.trim().split('/')
			if (!breadcrumb[0]) {
				breadcrumb.shift()
			}
			let needCheck = breadcrumb.pop()
      let res = this.find(needCheck,asideNavInfo)
      this.breadcrumb.length = 0
      this.breadcrumb.push(res.parent.authName,res.child.authName)
      window.sessionStorage.setItem('breadcrumb',this.breadcrumb)
		})
	},
}
</script>

<style lang="scss" scoped>
.main {
  height:100%;
  overflow:hidden;

	.main-header {
		display: flex;
		align-items: center;
        padding: 15px 0 0 15px;
		i {
			font-size: 36px;
			margin-right: 18px;
			cursor: pointer;
			padding: 8px;
			&:hover {
				background-color: rgba(0, 0, 0, 0.025);
			}
		}

    .el-breadcrumb{
      font-size: 16px;
    }

    .el-breadcrumb .el-breadcrumb__item:first-child{
      cursor: pointer;
      font-weight: bold;
    }
	}
}
</style>
