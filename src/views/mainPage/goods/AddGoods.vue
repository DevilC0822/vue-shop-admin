<template>
  <div class='add-goods-view'>
    <el-breadcrumb separator-class="el-icon-arrow-right" ref='breadcrumb'>
      <el-breadcrumb-item @click.native='$router.push("/home")'>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" style="margin-top:15px;">
      <el-row>
        <el-col style="text-align:left;">
          <el-button type='primary' @click="$router.push('/home/goods')">返回商品列表</el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top:15px;">
        <el-col>
          <el-alert title="添加商品信息" type="info" show-icon center :closable='false'>
          </el-alert>
        </el-col>
      </el-row>
      <el-row style="margin-top:15px;">
        <el-col :span="3">
          <el-steps direction="vertical" :active="active">
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
          </el-steps>
        </el-col>
        <el-col :span="21">
          <div class="firstStep" v-show="active === 0">
            <el-form :model="goodsInfoFrom" :rules="goodsInfoFromRules" ref="goodsInfoFromRef" label-width="100px" class="demo-ruleForm">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="goodsInfoFrom.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model="goodsInfoFrom.goods_price"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="goodsInfoFrom.goods_number"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="goodsInfoFrom.goods_weight"></el-input>
              </el-form-item>
              <el-form-item label="商品分类" prop="goods_cat">
                <el-cascader v-model="goodsCategories.cat_id" :options="goodsCategories" clearable :props="{
							expandTrigger: 'hover',
							label: 'cat_name',
							value: 'cat_id',
							children: 'children',
						}" @change="handleChange"></el-cascader>
              </el-form-item>
            </el-form>
          </div>
          <div class="secondStep" v-show="active === 1">
            2
          </div>
          <div class="threeStep" v-show="active === 2">
            3
          </div>
          <div class="fourStep" v-show="active === 3">
            4
          </div>
          <div class="fiveStep" v-show="active === 4">
            5
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top:15px;text-align:right;">
        <el-col>
          <el-button style="margin-top: 12px;" v-show='active' @click="active--">上一步</el-button>
          <el-button style="margin-top: 12px;" @click="next" ref="submitBtn">下一步</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'AddGoods',

    created() {
      this.$parent.$refs.breadcrumb.$el.style.display = 'none';
      this.getGoodsCategoriesParams()
    },

    beforeDestroy() {
      this.$parent.$refs.breadcrumb.$el.style.display = 'block';
    },

    data() {
      return {
        active: 0,
        goodsInfoFrom: {
          goods_name: '',
          goods_price: '',
          goods_number: '',
          goods_weight: '',
          goods_cat: ''
        },
        goodsCategories: [],
        // 添加商品表单验证规则
        goodsInfoFromRules: {
          goods_name: [{
              required: true,
              message: '请输入商品名称',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 16,
              message: '长度在 1 到 16 个字符',
              trigger: 'blur'
            }
          ],
          goods_price: [{
              required: true,
              message: '请输入商品价格',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 9,
              message: '请输入合适的价格',
              trigger: 'blur'
            }
          ],
          goods_number: [{
              required: true,
              message: '请输入商品个数',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 8,
              message: '请输入合适的商品数量',
              trigger: 'blur'
            }
          ],
          goods_weight: [{
              required: true,
              message: '请输入商品重量',
              trigger: 'blur'
            },
            {
              min: 1,
              max: 10,
              message: '请输入合适的商品重量',
              trigger: 'blur'
            }
          ],
          goods_cat: [{
            required: true,
            message: '请选择商品分类',
            trigger: 'blur'
          }],
        }
      }
    },

    methods: {

      async getGoodsCategoriesParams() {
        const {
          data: res
        } = await this.$http({
          url: '/categories',
          method: 'get',
        })
        console.log('获取商品分类')
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.goodsCategories = res.data
        console.log(this.goodsCategories)
      },

      async handleChange(value) {
        this.goodsInfoFrom.goods_cat = value.toString()
      },

      async addGoodsSubmit() {
        const {
          data: res
        } = await this.$http({
          url: '/goods',
          method: 'post',
          data: this.goodsInfoFrom
        })
        console.log('添加商品')
        console.log(res)
        if (res.meta.status !== 201) {
          this.active--
          this.$refs.submitBtn.$el.innerHTML = '下一步'
          return this.$message.error(res.meta.msg)
        }
        this.$router.push('/home/goods')
      },

      next() {
        this.$refs.submitBtn.$el.innerHTML = '下一步'
        if (this.active === 0) {
          this.$refs.goodsInfoFromRef.validate(valid => {
            if (!valid) return this.$message.error('表单预验证未通过')
            this.active++
          })
        } else {
          this.active++
        }
        if (this.active === 4) {
          this.$refs.submitBtn.$el.innerHTML = '提交'
        }
        if (this.active === 5) {
          this.addGoodsSubmit()
        }
      }
    }

  }
</script>

<style lang="scss" scoped>
  .add-goods-view {
    padding: 0 0 0 15px;

    .el-breadcrumb {
      font-size: 16px;
    }

    .el-breadcrumb .el-breadcrumb__item:first-child {
      cursor: pointer;
      font-weight: bold;
    }

    .el-step {
      ::v-deep .el-step__head {
        height: 100px;
      }
    }

    .el-form {
      .el-form-item {
        &:last-child {
          text-align: left;

          .el-cascader {
            width: 30%;
          }
        }
      }
    }
  }
</style>