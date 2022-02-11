<template>
  <div class="goods-params-view">
    <el-card class="box-card">
      <el-alert title="注意: 只允许为第三级分类设置相关参数!" type="info" show-icon>
      </el-alert>
      <el-row style="margin-top: 20px; text-align: left">
        <el-col>
          <span>选择商品分类: </span>
          <el-cascader v-model="goodsCategories.cat_id" :options="goodsCategories" clearable :props="{
							expandTrigger: 'hover',
							label: 'cat_name',
							value: 'cat_id',
							children: 'children',
						}" @change="handleChange"></el-cascader>
        </el-col>
      </el-row>

      <el-row>
        <el-col style="text-align:left;margin-top:10px;display:flex;">
          <el-button type="primary" :disabled="!currentCategoryId || !currentCategoryParamsKind" @click="addParams">添加参数</el-button>
          <el-alert style="margin-left:10px;" v-show="!currentCategoryId || !currentCategoryParamsKind" @click="addParams" title="请先选择三级分类与参数类型" type="info">
          </el-alert>

        </el-col>
      </el-row>

      <el-tooltip :content="currentCategoryId == null ? '请先选择三级分类' : `已选择${currentCategoryName}`" placement="top-start" effect="light">
        <el-tabs type="border-card" @tab-click="changeTab" style="margin-top: 20px">
          <el-tab-pane :disabled="currentCategoryId == null" label="动态参数" name="many">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column type="expand">
                <template slot-scope='scope'>
                  <div v-show="scope.row.attr_vals">
                    <el-tag v-for="tag in scope.row.attr_vals.split(',')" v-show="scope.row.attr_vals" :key="tag" 
                    :closable='false' type="success">
                      {{tag}}
                    </el-tag>
                  </div>

                </template> </el-table-column>
              <el-table-column type="index"> </el-table-column>
              <el-table-column label="参数名称" prop="attr_name"> </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button @click="editParams(scope.row)" type="text" size="small">编辑</el-button>
                  <el-button type="text" size="small" @click='deleteParams(scope.row)'>删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>


          <el-tab-pane :disabled="currentCategoryId == null" label="静态描述" name="only">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column type="expand">
                <template slot-scope='scope'>
                  <el-tag v-for="tag in scope.row.attr_vals.split(',')" :key="tag" :closable='false' type="success">
                    {{tag}}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column type="index"> </el-table-column>
              <el-table-column label="参数名称" prop="attr_name"> </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button @click="editParams(scope.row)" type="text" size="small">编辑</el-button>
                  <el-button type="text" size="small" @click='deleteParams(scope.row)'>删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-tooltip>

    </el-card>


    <el-dialog title="添加参数" :visible.sync="addParamsDialog" width="50%">
      <el-form :model="addParamsForm" :rules="addRules" ref="addParamsFormRef" label-width="100px">
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitAddParams">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="editParamsDialog" width="50%">
      <el-form :model="editParamsForm" :rules="editRules" ref="editParamsFormRef" label-width="100px">
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
        <el-form-item label="子参数">
          <el-input v-model="editParamsForm.attr_vals"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitEditParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'GoodsParamsView',
    data() {
      return {
        goodsCategories: [],
        currentCategoryId: null,
        currentCategoryName: '',

        // 动态属性或者静态参数
        currentCategoryParamsKind: '',
        tableData: [],
        editParamsDialog: false,
        addParamsDialog: false,
        editParamsForm: {},
        addParamsForm: {
          attr_name: '',
          attr_vals: ''
        },

        //表单验证规则
        addRules: {
          attr_name: [{
              required: true,
              message: '用户名不能为空',
              trigger: 'blur'
            },
            {
              min: 2,
              max: 8,
              message: '长度在 2 到 8 个字符',
              trigger: 'blur'
            },
          ],
        },
        editRules: {
          attr_name: [{
              required: true,
              message: '用户名不能为空',
              trigger: 'blur'
            },
            {
              min: 2,
              max: 8,
              message: '长度在 2 到 8 个字符',
              trigger: 'blur'
            },
          ],
        }
      }
    },
    computed: {},
    methods: {
      async getGoodsCategoriesParams() {
        const {
          data: res
        } = await this.$http({
          url: '/categories',
          method: 'get',
        })
        this.goodsCategories = res.data
        console.log('获取商品分类')
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
      },
      async handleChange(value) {
        console.log('级联选择框变换的值')
        console.log(value)
        this.currentCategoryId = null
        this.currentCategoryId = value.length === 3 ? value[2] : null
        if (this.currentCategoryParamsKind) {
          this.getCategory()
        }

        // 根据商品分类id获取分类名
        const {
          data: res
        } = await this.$http({
          url: `categories/${this.currentCategoryId}`,
          method: 'get',
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.currentCategoryName = res.data.cat_name
      },
      changeTab(value) {
        this.currentCategoryParamsKind = value.paneName
        this.getCategory()
      },
      async getCategory() {
        const {
          data: res
        } = await this.$http({
          url: `categories/${this.currentCategoryId}/attributes`,
          method: 'get',
          params: {
            sel: this.currentCategoryParamsKind,
          },
        })
        console.log('获取参数输出')
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.tableData = res.data
      },
      addParams() {
        this.addParamsDialog = true
      },
      async submitAddParams() {
        const {
          data: res
        } = await this.$http({
          url: `categories/${this.currentCategoryId}/attributes`,
          method: 'post',
          data: {
            attr_name: this.addParamsForm.attr_name,
            attr_vals: this.editParamsForm.attr_vals,
            attr_sel: this.currentCategoryParamsKind,
          },
        })
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.addParamsDialog = false
        this.getCategory()
      },

      editParams(arg) {
        this.editParamsDialog = true
        this.editParamsForm = arg
      },
      async submitEditParams() {
        const {
          data: res
        } = await this.$http({
          url: `categories/${this.currentCategoryId}/attributes/${this.editParamsForm.attr_id}`,
          method: 'put',
          data: {
            attr_name: this.editParamsForm.attr_name,
            attr_sel: this.currentCategoryParamsKind,
            attr_vals: this.editParamsForm.attr_vals,
          },
        })
        console.log('编辑提交输出')
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.editParamsDialog = false
        this.getCategory()
      },

      deleteParams(arg) {

        this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          })
          .then(async () => {
            const {
              data: res
            } = await this.$http({
              url: `categories/${arg.cat_id}/attributes/${arg.attr_id}`,
              method: 'delete',
            })
            console.log('删除输出')
            console.log(res)
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.$message.success('删除参数成功!')
            this.getCategory()
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            })
          })
      }
    },

    created() {
      this.getGoodsCategoriesParams()
    },

  }
</script>

<style lang="scss" scoped>
  .goods-params-view {
    padding: 15px;

    .el-tag {
      margin: 0 10px;

      &:first-child {
        margin-left: 0;
      }
    }
  }
</style>