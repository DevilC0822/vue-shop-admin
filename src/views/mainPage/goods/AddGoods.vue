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
            <div style='padding-left: 15px;'>
              <el-alert title="可省略" type="info" show-icon>
              </el-alert>
              <div style='padding-top: 20px;'>

                <el-form :model="goodsInfoFrom.attrs[0]" label-width="100px" class="demo-ruleForm">
                  <el-form-item label="动态参数id">
                    <el-input v-model="goodsInfoFrom.attrs[0].attr_id"></el-input>
                  </el-form-item>
                  <el-form-item label="动态参数">
                    <el-input v-model="goodsInfoFrom.attrs[0].attr_value"></el-input>
                  </el-form-item>
                </el-form>

              </div>

            </div>
          </div>
          <div class="threeStep" v-show="active === 2">
            <div style='padding-left: 15px;'>
              <el-alert title="可省略" type="info" show-icon>
              </el-alert>
              <div style='padding-top: 20px;'>
                <el-form :model="goodsInfoFrom.attrs[1]" label-width="100px" class="demo-ruleForm">
                  <el-form-item label="静态属性id">
                    <el-input v-model="goodsInfoFrom.attrs[1].attr_id"></el-input>
                  </el-form-item>
                  <el-form-item label="静态属性">
                    <el-input v-model="goodsInfoFrom.attrs[1].attr_value"></el-input>
                  </el-form-item>
                </el-form>
              </div>

            </div>
          </div>
          <div class="fourStep" v-show="active === 3">

            <div style='padding-left: 15px;'>
              <el-alert title="可省略" type="info" show-icon>
              </el-alert>
              <!--
              action 表示图片要上传到的后台API地址
              handlePreview 点击预览触发
              handleRemove 删除图片触发
              fileList 指定文件列表
              list-type 指定预览组件的呈现方式
            -->
              <el-upload class="upload-demo" :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headersObj" :on-success="handleSuccess">
                <el-button size="small" type="primary" style="margin-top: 20px;">点击上传</el-button>
              </el-upload>
            </div>

          </div>
          <div class="fiveStep" v-show="active === 4">
            <div style='padding-left: 15px;'>
              <el-alert title="可省略" type="info" show-icon>
              </el-alert>
              <el-input style="padding-top: 20px;" type="textarea" rows="3" placeholder="请输入内容" v-model="goodsInfoFrom.goods_introduce">
              </el-input>
            </div>

          </div>


        </el-col>
        <div class='ctrl-container'>
          <el-button style="margin-top: 12px;" v-show='active' @click="prev">上一步</el-button>
          <el-button style="margin-top: 12px;" @click="next" ref="submitBtn">下一步</el-button>
        </div>
      </el-row>
    </el-card>



    <!--    图片预览-->
    <el-dialog title="图片预览" :visible.sync="previewDialogVisible" width="50%">
      <img :src="previewPath" alt="" class="perviewImg" />
    </el-dialog>
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
          goods_cat: '',
          // 图片的数组
          pics: [{
            pic: ''
          }],
          // 商品的详情描述
          goods_introduce: '',
          attrs: [
            // 动态参数
            {
              "attr_id": 15,
              "attr_value": 'ddd'
            },
            // 静态属性
            {
              "attr_id": 15,
              "attr_value": 'eee'
            }
          ],
        },
        goodsCategories: [],

        

        // 上传图片的URL地址
        uploadURL: 'http://175.24.198.84:2999/api/private/v1/upload',
        headersObj: {
          Authorization: window.sessionStorage.getItem('token')
        },
        // 预览图片的路径
        previewPath: '',
        // 图片预览的对话框
        previewDialogVisible: false,

        // 添加商品表单验证规则
        goodsInfoFromRules: {
          goods_name: [{
              required: true,
              message: '请输入商品名称',
              trigger: 'blur'
            },
            {
              min: 2,
              max: 16,
              message: '长度在 2 到 16 个字符',
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
        console.log(this.goodsInfoFrom)
        // 未知原因, pic有值时导致后台api瘫痪
        this.goodsInfoFrom.pics[0].pic = ''
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
        this.$message.success(res.meta.msg)
        this.$router.push('/home/goods')
      },
      prev() {
        this.active--
        if (this.active !== 4) {
          this.$refs.submitBtn.$el.innerHTML = '下一步'
        }
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
      },


     

      // 点击图片预览时触发
      handlePreview(file) {
        this.previewPath = file.response.data.url
        this.previewDialogVisible = true
        console.log('预览图片', file)
      },
      // 处理移除图片的操作
      handleRemove(file) {
        // 1. 获取将要删除的图片的临时路径
        const filePath = file.response.data.tmp_path
        // 2. 从 pics 数组中找到这个图片的对应的索引值
        const index = this.goodsInfoFrom.pics.findIndex(x => x.pic === filePath)
        // 3. 调用数组的splice方法,把图片信息对象,从pics数组中移除
        this.goodsInfoFrom.pics.splice(index, 1)
        console.log('移除图片', file, this.goodsInfoFrom)
      },
      // 监听图片上传成功的事件
      handleSuccess(resposne) {
        this.goodsInfoFrom.pics[0].pic = resposne.data.tmp_path
        console.log(resposne)
        console.log(this.goodsInfoFrom)
      },

    }

  }
</script>

<style lang="scss" scoped>
  .add-goods-view {
    padding: 0 0 0 15px;

    .ctrl-container {
      position: absolute;
      bottom: 5vw;
      right: 0;
    }

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