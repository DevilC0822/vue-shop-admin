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
                <el-button @click="checkGoodsInfo(scope.row)" type="text" size="small">查看</el-button>
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

    <!-- 查看商品弹出框 -->
    <el-dialog title="查看商品信息" :visible.sync="checkGoodsListDialog" width="60%">
      <el-descriptions title="商品信息" :column='1'>
        <el-descriptions-item label="商品名称">{{checkUserForm.goods_name}}</el-descriptions-item>
        <el-descriptions-item label="商品价格">{{checkUserForm.goods_price}}</el-descriptions-item>
        <el-descriptions-item label="商品数量">{{checkUserForm.goods_number}}</el-descriptions-item>
        <el-descriptions-item label="商品重量">{{checkUserForm.goods_weight}}</el-descriptions-item>
      </el-descriptions>
      <div>
        <h3 class="goods_introduce_title">商品介绍</h3>
        <div v-html="checkUserForm.goods_introduce"></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="checkGoodsListDialog = false">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 编辑商品弹出框 -->
    <el-dialog title="修改用户" :visible.sync="editGoodsListDialog">
      <el-form :model="editUserForm" :rules="goodsInfoFromRules" ref="editGoodsListDialogRef">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editUserForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editUserForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editUserForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editUserForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editGoodsListDialog = false">取 消</el-button>
        <el-button type="primary" @click="editGoodsListSubmit">确 定</el-button>
      </div>
    </el-dialog>

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
        checkUserForm: {},
        checkGoodsListDialog: false,
        editUserForm: {},
        editGoodsListDialog: false,




        // 编辑商品表单验证规则
        goodsInfoFromRules: {
          goods_name: [{
              required: true,
              message: '请输入商品名称',
              trigger: 'blur'
            },
            {
              min: 2,
              max: 256,
              message: '长度在 2 到 256 个字符',
              trigger: 'blur'
            }
          ],
          goods_price: [{
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }],
          goods_number: [{
            required: true,
            message: '请输入商品数量',
            trigger: 'blur'
          }],
          goods_weight: [{
              required: true,
              message: '请输入商品重量',
              trigger: 'blur'
            },

          ],
        }
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

      async getGoodsInfo(id, type) {
        const {
          data: res
        } = await this.$http({
          url: `goods/${id}`,
          method: 'get',
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        console.log(res)
        if (type === 'edit') this.editUserForm = res.data
        if (type === 'check') this.checkUserForm = res.data
      },

      checkGoodsInfo(row) {
        this.getGoodsInfo(row.goods_id, 'check')
        this.checkGoodsListDialog = true
      },


      async editGoodsInfo(row) {
        this.editGoodsListDialog = true
        this.getGoodsInfo(row.goods_id, 'edit')
      },

      editGoodsListSubmit() {
        this.$refs.editGoodsListDialogRef.validate(async valid => {
          if (!valid) return this.$message.error('表单预验证未通过')
          const {
            data: res
          } = await this.$http({
            url: `goods/${this.editUserForm.goods_id}`,
            method: 'put',
            data: {
              goods_name: this.editUserForm.goods_name,
              goods_price: this.editUserForm.goods_price,
              goods_number: this.editUserForm.goods_number,
              goods_weight: this.editUserForm.goods_weight
            }
          })
          this.$message.error(`后端接口错误, ${res.meta.msg}`)
          this.editGoodsListDialog = false
        })
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

    .goods_introduce_title {
      color:#F56C6C;
      margin-bottom: 30px;
      font-size: 32px;
      font-weight: bold;
    }
  }
</style>