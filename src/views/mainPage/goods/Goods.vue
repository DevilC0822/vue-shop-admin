<template>
  <div class='goods-view'>
    <el-card class="box-card">
      <el-row>
        <el-col :span='6'>
          <el-input placeholder="请输入商品关键字" v-model="getGoodsListParams.query" @keyup.enter.native="getGoodsList" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click='getGoodsList'></el-button>
          </el-input>
        </el-col>
        <el-col :span='2' style="margin-left:15px;">
          <el-button type='primary' @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <el-row style="margin-top:15px;">
        <el-col>
          <el-table :data="goodsListDate" border style="width: 100%">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="goods_name" label="商品名称">
            </el-table-column>
            <el-table-column prop="goods_price" label="商品价格" width="100">
            </el-table-column>
            <el-table-column prop="goods_weight" label="商品重量" width="100">
            </el-table-column>
            <el-table-column label="创建时间">
              <template slot-scope="scope">
                {{new Date(scope.row.add_time).toLocaleString()}}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="250">
              <template slot-scope="scope">
                <el-button @click="editGoodsInfo(scope.row)" type="text" size="small">编辑</el-button>
                <el-button type="text" size="small" @click="deleteGoods(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="getGoodsListParams.pagenum" :page-sizes="[5, 10, 20, 100]" :page-size="getGoodsListParams.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="goodsTotal">
          </el-pagination>
        </el-col>
      </el-row>






    </el-card>
  
  </div>
</template>

<script>
  export default {
    name: 'Goods',
    data() {
      return {
        getGoodsListParams: {
          query: '',
          pagenum: 1,
          pagesize: 5
        },
        currentPagenum: null,
        searchGoodsKeyword: '',
        goodsListDate: [],
        goodsTotal: null,
      }
    },
    created() {
      this.getGoodsList()
    },
    methods: {
      async getGoodsList() {
        const {
          data: res
        } = await this.$http({
          url: 'goods',
          method: 'get',
          params: this.getGoodsListParams
        })
        console.log('获取商品列表')
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.goodsListDate = res.data.goods
        this.goodsTotal = res.data.total
        this.currentPagenum = res.data.pagenum
      },
      addGoods() {
        this.$router.push('/home/add-goods')
      },

      editGoodsInfo() {

      },

      async deleteGoods(arg) {
        this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
          .then(async () => {
            const {
              data: res
            } = await this.$http({
              url: `goods/${arg.goods_id}`,
              method: 'delete',
            })
            console.log('删除输出')
            console.log(res)
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.$message.success('删除参数成功!')
            // 判断当前展示的用户数据是否只有一条
            if (this.goodsListDate.length === 1) {
              this.getGoodsListParams.pagenum === 1 ?
                1 :
                this.getGoodsListParams.pagenum-- // 若是，则继续判断页码是否已经在第一页，若否，则-1，若是则保持在该页
            }
            this.getGoodsList()
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            })
          })
      },

      // page-size改变
      handleSizeChange(newSize) {
        this.getGoodsListParams.pagesize = newSize
        this.getGoodsList()
      },

      // 页码值改变
      handleCurrentChange(newPage) {
        this.getGoodsListParams.pagenum = newPage
        this.getGoodsList()
      },
    }
  }
</script>

<style lang="scss" scoped>
  .goods-view {
    .box-card {
      margin: 15px;
    }

    .el-pagination {
      text-align: left;
      margin-top: 15px;
    }
  }
</style>