<template>
  <div class='categories-view'>
    <el-card class="box-card" style="text-align:left;">
      <el-button type="primary" @click="openAddGoodsCategoriesDialog">添加分类</el-button>

      <el-table :data="goodsCategories.result" border style="width: 100%" row-key="cat_id"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

        <el-table-column prop="cat_name" label="分类名称" width="300">
        </el-table-column>

        <el-table-column prop="cat_deleted" label="是否有效" width="250">
          <template slot-scope="scope">
            <el-tag v-if='!scope.row.cat_deleted' type="success">有效</el-tag>
            <el-tag v-else type="danger">无效</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="cat_level" label="排序" width="250">
          <template slot-scope="scope">
            <el-tag v-if='scope.row.cat_level === 0'>一级</el-tag>
            <el-tag v-else-if='scope.row.cat_level === 1' type="success">二级</el-tag>
            <el-tag v-else-if='scope.row.cat_level === 2' type="warning">三级</el-tag>
            <el-tag v-else type="danger">出错了</el-tag>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button @click="openEditGoodsCategories(scope.row)" type="text" size="small">编辑</el-button>
            <el-button type="text" size="small" @click="deleteGoodsCategories(scope.row.cat_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="1"
        :page-sizes="[1, 3, 5, 10]" :page-size="goodsCategories.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="goodsCategories.total">
      </el-pagination>
    </el-card>


    <!-- 添加商品分类弹出框 -->
    <el-dialog title="添加分类" :visible.sync="addGoodsCategoriesDialog" @close='addGoodsCategoriesDialogClosed'>
      <el-form :model="addGoodsCategoriesParams" ref="addGoodsCategoriesRef" :rules="addGoodsCategoriesRule">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addGoodsCategoriesParams.cat_name" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-alert title="不能为第三级添加分类" type="info" :closable='false' show-icon>
          </el-alert>
        </el-form-item>

        <el-form-item label=" 分类名称">
          <el-cascader v-model="categoriesOptions.cat_id" :options="categoriesOptions" clearable
            :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id',children:'children',checkStrictly:true }"
            @change="handleChange"></el-cascader>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addGoodsCategoriesDialog = false">取 消</el-button>
        <el-button type="primary" @click="addGoodsCategoriesSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑商品分类弹出框 -->
    <el-dialog title="编辑分类" :visible.sync="editGoodsCategoriesDialog">
      <el-form :model="editGoodsCategoriesForm" ref="editGoodsCategoriesRef" :rules="editGoodsCategoriesRule">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editGoodsCategoriesForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editGoodsCategoriesDialog = false">取 消</el-button>
        <el-button type="primary" @click="editGoodsCategoriesSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Categories',
    data() {
      return {
        getGoodsCategoriesParams: {
          type: '',
          pagenum: 1,
          pagesize: 5
        },
        addGoodsCategoriesParams: {
          cat_pid: 0,
          cat_name: '',
          cat_level: 0
        },
        goodsCategories: {},

        addGoodsCategoriesDialog: false,
        editGoodsCategoriesDialog: false,

        editGoodsCategoriesForm: {
          cat_name: ''
        },
        currentId: null,
        addGoodsCategoriesRule: {
          cat_name: [{
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }, ]
        },
        editGoodsCategoriesRule: {
          cat_name: [{
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }, ]
        },
        categoriesOptions: []
      }
    },

    created() {
      this.getGoodsCategories()
    },

    methods: {
      async getGoodsCategories() {
        this.getGoodsCategoriesParams.type = ''
        const {
          data: res
        } = await this.$http({
          url: '/categories',
          methd: 'get',
          params: this.getGoodsCategoriesParams
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        console.log(res)
        this.$message.success(res.meta.msg)
        this.goodsCategories = res.data
      },

      async openAddGoodsCategoriesDialog() {
        this.getGoodsCategoriesParams.type = 3
        const {
          data: res
        } = await this.$http({
          url: '/categories',
          methd: 'get',
          params: this.getGoodsCategoriesParams
        })
        // 进行数据改造给第三级添加disabled
        for (const item1 of res.data.result) {
          for (const item2 of item1.children) {
            if (item2.children) {
              for (const item3 of item2.children) {
                if (item3.cat_level === 2) {
                  item3.disabled = true
                }
              }
            }
          }
        }
        console.log(res.data.result)
        this.categoriesOptions = res.data.result
        this.addGoodsCategoriesDialog = true
      },

      handleChange(value) {
        console.log(value)
        if (value && value.length > 0) {
          this.addGoodsCategoriesParams.cat_pid = value[value.length - 1]
          this.addGoodsCategoriesParams.cat_level = value.length
        }
      },

      openEditGoodsCategories(arg) {
        this.editGoodsCategoriesDialog = true
        this.currentId = arg.cat_id
        this.editGoodsCategoriesForm.cat_name = arg.cat_name
      },

      async addGoodsCategoriesSubmit() {
        this.$refs.addGoodsCategoriesRef.validate(async (valid) => {
          if (valid) {
            const {
              data: res
            } = await this.$http({
              url: `/categories`,
              method: 'post',
              data: this.addGoodsCategoriesParams
            })
            console.log(res)
            if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
            this.$message.success(res.meta.msg)
            this.getGoodsCategories()
            this.addGoodsCategoriesDialog = false
          }
        })
      },

      async editGoodsCategoriesSubmit() {
        const {
          data: res
        } = await this.$http({
          url: `/categories/${this.currentId}`,
          method: 'put',
          data: {
            cat_name: this.editGoodsCategoriesForm.cat_name
          }
        })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getGoodsCategories()
        this.editGoodsCategoriesDialog = false
      },

      async deleteGoodsCategories(id) {
        this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
          .then(async () => {
            const {
              data: res
            } = await this.$http({
              url: `/categories/${id}`,
              method: 'delete'
            })
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.$message.success('删除商品分类成功!')
            if (this.goodsCategories.result.length === 1) {
              // 判断当前展示的用户数据是否只有一条
              this.getGoodsCategoriesParams.pagenum = 1 ?
                1 :
                this.getGoodsCategoriesParams.pagenum - 1 // 若是，则继续判断页码是否已经在第一页，若否，则-1，若是则保持在该页
            }
            this.getGoodsCategories()
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            })
          })
      },

      handleSizeChange(newSize) {
        this.getGoodsCategoriesParams.pagesize = newSize
        this.getGoodsCategories()

      },
      handleCurrentChange(newPage) {
        this.getGoodsCategoriesParams.pagenum = newPage
        this.getGoodsCategories()
      },
      addGoodsCategoriesDialogClosed() {
        this.$refs.addGoodsCategoriesRef.resetFields()
      }
    },
  }
</script>

<style lang="scss" scoped>
  .categories-view {
    padding: 15px;

    .el-table {
      margin-top: 15px;
    }

    .el-dialog__wrapper ::v-deep .el-form-item__label {
      width: 80px;
    }

    .el-form-item {
      display: flex;
    }

    .el-cascader {
      width: 100%;
    }

    ::v-deep .el-form-item__content {
      flex: 1;
    }
  }
</style>