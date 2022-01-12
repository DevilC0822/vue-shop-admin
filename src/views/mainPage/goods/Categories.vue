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
        :page-sizes="[5, 10]" :page-size="goodsCategories.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="goodsCategories.total">
      </el-pagination>
    </el-card>


    <!-- 添加商品分类弹出框 -->
    <el-dialog title="添加分类" :visible.sync="addGoodsCategoriesDialog">
      <el-form :model="addGoodsCategoriesForm" ref="addGoodsCategoriesRef" :rules="addGoodsCategoriesRule">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addGoodsCategoriesForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>

        <!-- <el-form-item label="父级分类">
            <el-cascader v-model="value" :options="options" @change="handleChange"></el-cascader>
        </el-form-item> -->

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addGoodsCategoriesDialog = false">取 消</el-button>
        <el-button type="primary" @click="addGoodsCategoriesDialog = false">确 定</el-button>
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
        goodsCategories: {},

        addGoodsCategoriesDialog: false,
        editGoodsCategoriesDialog: false,

        addGoodsCategoriesForm: {},
        editGoodsCategoriesForm: {},
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
        }
      }
    },

    created() {
      this.getGoodsCategories()
    },

    methods: {
      async getGoodsCategories() {
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

      openAddGoodsCategoriesDialog() {
        this.addGoodsCategoriesDialog = true
      },

      openEditGoodsCategories(arg) {
        this.editGoodsCategoriesDialog = true
        this.currentId = arg.cat_id
        this.editGoodsCategoriesForm.cat_name = arg.cat_name
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

    ::v-deep .el-form-item__content {
      display: flex;
    }
  }
</style>