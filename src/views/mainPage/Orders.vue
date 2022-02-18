<template>
  <div class='orders-view'>
    <el-card class="box-card">
      <el-row>
        <el-col :span='6'>
          <el-input placeholder="请输入订单关键字" v-model="getOrdersListParams.query" @keyup.enter.native="getOrdersList" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click='getOrdersList'></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-row style="margin-top:15px;">
        <el-col>
          <el-table :data="ordersListDate" border style="width: 100%">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="order_number" label="订单编号" width="300">
            </el-table-column>
            <el-table-column prop="order_price" label="订单价格" width="100">
            </el-table-column>
            <el-table-column prop="pay_status" label="是否支付" width="100">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.pay_status == 1" type="success">已支付</el-tag>
                <el-tag v-else type="danger">未支付</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="is_send" label="是否发货" width="100">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.is_send === '是'" type="success">已发货</el-tag>
                <el-tag v-else type="danger">未发货</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="下单时间" min-width="180">
              <template slot-scope="scope">
                {{new Date(scope.row.create_time).toLocaleString()}}
              </template>
            </el-table-column>
            <el-table-column label="更新时间" min-width="180">
              <template slot-scope="scope">
                {{new Date(scope.row.update_time).toLocaleString()}}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" min-width="180">
              <template slot-scope="scope">
                <el-button @click="editOrdersInfo(scope.row)" type="text" size="small">编辑</el-button>
                <el-button @click="editLocation(scope.row)" type="text" size="small">修改地址</el-button>
                <el-button @click="checkLocationInfo(scope.row)" type="text" size="small">查看物流</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="getOrdersListParams.pagenum" :page-sizes="[5, 10, 20, 100]" :page-size="getOrdersListParams.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="ordersTotal">
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>

    <!-- 编辑订单弹出框 -->
    <el-dialog title="修改用户" :visible.sync="editOrdersListDialog">
      <el-form :model="editOrdersForm" :rules="ordersInfoFromRules" ref="editOrdersListDialogRef">

        <el-form-item label="支付状态(0: 未付款, 1: 已付款)" prop="pay_status">
          <el-input v-model="editOrdersForm.pay_status"></el-input>
        </el-form-item>
        <el-form-item label="订单支付(0: 未支付, 1: 支付宝, 2: 微信, 3: 银行卡)" prop="order_pay">
          <el-input v-model="editOrdersForm.order_pay"></el-input>
        </el-form-item>
        <el-form-item label="订单是否发货(1:已经发货, 0:未发货)" prop="is_send">
          <el-input v-model="editOrdersForm.is_send"></el-input>
        </el-form-item>
        <!-- <el-form-item label="支付及发货" prop="order_pay">
          <template v-slot="scoped">
            <el-cascader v-model="value" :options="options" @change="handleChange"></el-cascader>
          </template>
        </el-form-item> -->
        <el-form-item label="订单价格" prop="order_price">
          <el-input v-model.number="editOrdersForm.order_price"></el-input>
        </el-form-item>
        <!-- <el-form-item label="订单数量" prop="order_number">
          <el-input v-model="editOrdersForm.order_number"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editOrdersListDialog = false">取 消</el-button>
        <el-button type="primary" @click="editOrdersSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改地址弹出框 -->
    <el-dialog title="修改用户" :visible.sync="editLocationDialog">
      <el-form>
        <el-form-item label="省/市" label-width="80px">
          <el-cascader v-model="cityOptions.value" :options="cityOptions" :props="{
							expandTrigger: 'hover',
							label: 'label',
							value: 'value',
							children: 'children',
						}" @change="changeProvince"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" label-width="80px">
          <el-input></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editLocationDialog = false">取 消</el-button>
        <el-button type="primary" @click="editLocationDialog">确 定</el-button>
      </div>
    </el-dialog>

    <!--    显示物流进度的对话框-->
    <el-dialog title="物流进度" :visible.sync="progressDialogVisible" width="50%">
      <el-timeline :reverse="false">
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.ftime">
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>

  </div>
</template>

<script>
  import cityOptions from '@/assets/js/city_data2017_element.js'

  export default {
    name: 'Orders',
    data() {

      let check_is_send = (rule, value, callback) => {
        if (value == 0 || value == 1) {

        } else {
          callback(new Error('是否发货必须为0或1, 1:已经发货，0:未发货'))
        }
        return callback()
      }

      let check_pay_status = (rule, value, callback) => {
        if (value == 0 || value == 1) {

        } else {
          callback(new Error('订单状态必须为0或1, 订单状态： 0 未付款、1 已付款'))
        }
        return callback()
      }

      let check_order_pay = (rule, value, callback) => {
        if (value == 0 || value == 1 || value == 2 || value == 3) {

        } else {
          callback(new Error('订单支付必须为0,1,2或者3'))
        }
        return callback()
      }

      let check_order_price = (rule, value, callback) => {
        if (typeof(value + 0) !== 'number') {
          callback(new Error('商品价格必须是数字'))
        }
        return callback()
      }





      return {
        cityOptions: cityOptions,
        ordersListDate: [],
        ordersTotal: null,
        getOrdersListParams: {
          query: '',
          pagenum: 1,
          pagesize: 5,
        },
        editOrdersForm: {

        },
        editOrdersListDialog: false,
        editLocationDialog: false,
        progressDialogVisible: false,
        progressInfo: [],


        // 编辑订单表单验证规则
        ordersInfoFromRules: {
          is_send: [{
              required: false,
              trigger: 'blur'
            },
            {
              validator: check_is_send,
              trigger: 'blur'
            },
          ],
          pay_status: [{
              required: false,
              trigger: 'blur'
            },
            {
              validator: check_pay_status,
              trigger: 'blur'
            },
          ],
          order_pay: [{
              required: false,
              trigger: 'blur'
            },
            {
              validator: check_order_pay,
              trigger: 'blur'
            },
          ],
          order_price: [{
            validator: check_order_price,
            trigger: 'blur'
          }, ],
        }
      }
    },
    created() {
      this.getOrdersList()
    },

    methods: {
      async getOrdersList() {
        const {
          data: res
        } = await this.$http({
          url: 'orders',
          method: 'get',
          params: this.getOrdersListParams
        })
        console.log('获取订单列表')
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        res.data.goods.forEach(item => {
          item.create_time += 1000 * 60 * 60 * 24 * 365 * (Math.random() * (51.999 - 51.888) + 51.888)
          item.pay_status != 0 ? item.update_time += 1000 * 60 * 60 * 24 * 365 * (Math.random() * (52.1111 - 51.9999) + 51.9999) : item.update_time = item.create_time
          item.is_send === '否' ? item.is_send == 0 : item.is_send == 1
        })
        this.ordersListDate = res.data.goods
        this.ordersTotal = res.data.total
        // this.currentPagenum = res.data.pagenum
      },

      editOrdersInfo(row) {
        console.log(row)
        this.editOrdersForm = row
        this.editOrdersListDialog = true
      },
      async checkOrdersInfo(row) {
        console.log(row)
        const {
          data: res
        } = await this.$http({
          url: `orders/${row.order_id}}`,
          method: 'get'
        })
        console.log('获取订单详情')
        console.log(res)

      },
      async editOrdersSubmit() {
        console.log(this.editOrdersForm)
        const res = await this.$http({
          url: `orders/${this.editOrdersForm.order_id}`,
          method: 'put',
          data: {
            is_send: this.editOrdersForm.is_send,
            order_pay: this.editOrdersForm.order_pay,
            order_price: this.editOrdersForm.order_price,
            pay_status: this.editOrdersForm.pay_status
          }
        })
        console.log('提交编辑订单')
        console.log(res)
        // if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.getOrdersList()
        this.editOrdersListDialog = false
      },

      editLocation() {
        this.editLocationDialog = true
      },

      changeProvince(value) {
        console.log(value)
      },

      async checkLocationInfo() {
        let id = 1106975712662
        const {
          data: res
        } = await this.$http({
          url: `/kuaidi/${id}`
        })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('获取物流进度失败！')
        this.progressInfo = res.data
        this.progressDialogVisible = true
      },

      // page-size改变
      handleSizeChange(newSize) {
        this.getOrdersListParams.pagesize = newSize
        this.getOrdersList()
      },

      // 页码值改变
      handleCurrentChange(newPage) {
        this.getOrdersListParams.pagenum = newPage
        this.getOrdersList()
      },
    }
  }
</script>

<style lang="scss" scoped>
  .orders-view {
    .box-card {
      margin: 15px;
    }

    .el-pagination {
      text-align: left;
      margin-top: 15px;
    }

    .el-cascader {
      width: 100%;
    }
  }
</style>