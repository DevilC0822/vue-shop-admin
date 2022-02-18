<template>
  <div class='Reports-view'>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <span>选择数据表格类型:</span>
          <el-select v-model="selectVal" @change="selectChange" placeholder="请选择">
            <el-option label="折线图总览" value="all_line"></el-option>
            <el-option label="饼状图总览" value="all_pie"></el-option>
            <el-option label="各地区折线图" value="single_line"></el-option>
            <el-option label="各地区柱状图" value="single_bar"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <div id="container">

      </div>
    </el-card>
  </div>
</template>

<script>
  import * as echarts from 'echarts';

  export default {
    name: 'Reports',
    data() {
      return {
        echartsData: {},
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        selectVal: 'all_line'
      }
    },
    created() {
      this.getReports()
    },

    methods: {
      async getReports() {
        const {
          data: res
        } = await this.$http({
          url: 'reports/type/1',
          method: 'get'
        })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.echartsData = res.data
        this.all_line()
      },
      all_line() {
        document.querySelector('#container').innerHTML = ''
        let str = 'all_line'
        let echartsData_all_line = {}
        echartsData_all_line.title = {
          text: '用户来源'
        }
        echartsData_all_line.legend = this.echartsData.legend
        echartsData_all_line.xAxis = this.echartsData.xAxis[0]
        echartsData_all_line.yAxis = this.echartsData.yAxis[0]
        echartsData_all_line.series = this.echartsData.series
        echartsData_all_line.series.forEach(item => {
          item.type = 'line'
        })
        echartsData_all_line.tooltip = this.tooltip
        this.createdDiv(str)
        var myChart = echarts.init(document.getElementById(`main-${str}`));
        console.log(echartsData_all_line)
        myChart.setOption(echartsData_all_line)
      },

      all_pie() {
        document.querySelector('#container').innerHTML = ''
        let str = 'all_pie'
        let echartsData_all_pie = {}
        echartsData_all_pie.title = {
          text: '用户来源'
        }
        echartsData_all_pie.series = [{
          type: 'pie',
          data: []
        }]
        this.echartsData.series.forEach(item => {
          item.type = 'pie'
          let obj = {}
          obj.name = item.name
          obj.value = item.data.reduce((prev, next) => prev + next)
          echartsData_all_pie.series[0].data.push(obj)
        })

        // echartsData_all_pie.tooltip = this.tooltip
        this.createdDiv(str)
        var myChart = echarts.init(document.getElementById(`main-${str}`));
        console.log(echartsData_all_pie)
        myChart.setOption(echartsData_all_pie)
      },



      single_line() {
        document.querySelector('#container').innerHTML = ''
        let count = 1
        this.echartsData.legend.data.forEach(item => {
          let echartsData_single_line = {}
          echartsData_single_line.title = {
            text: item
          }
          echartsData_single_line.xAxis = this.echartsData.xAxis[0]
          echartsData_single_line.yAxis = this.echartsData.yAxis[0]
          echartsData_single_line.series = this.echartsData.series[count - 1]
          echartsData_single_line.series.type = 'line'
          echartsData_single_line.tooltip = this.tooltip
          this.createdDiv(count)
          let myChart = echarts.init(document.getElementById(`main-${count}`));
          myChart.setOption(echartsData_single_line)
          count++
        })
      },

      single_bar() {
        document.querySelector('#container').innerHTML = ''
        let count = 1
        this.echartsData.legend.data.forEach(item => {

          let echartsData_single_bar = {}
          echartsData_single_bar.title = {
            text: item
          }
          echartsData_single_bar.xAxis = this.echartsData.xAxis[0]
          echartsData_single_bar.yAxis = this.echartsData.yAxis[0]
          echartsData_single_bar.series = this.echartsData.series[count - 1]
          echartsData_single_bar.series.type = 'bar'
          echartsData_single_bar.tooltip = this.tooltip
          this.createdDiv(count)
          let myChart = echarts.init(document.getElementById(`main-${count}`));
          myChart.setOption(echartsData_single_bar)
          count++
        })

      },

      createdDiv(id) {
        let para = document.createElement("div");
        let parent = document.querySelector('#container')
        para.setAttribute('id', `main-${id}`)
        para.setAttribute('class', 'echarts-container')
        parent.appendChild(para)
      },



      selectChange(val) {
        console.log(val)
        switch (val) {
          case 'all_line':
            this.all_line()
            break
          case 'all_pie':
            this.all_pie()
            break
          case 'single_line':
            this.single_line()
            break
          case 'single_bar':
            this.single_bar()
            break

        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .Reports-view {
    .box-card {
      margin: 15px;
    }

    .el-select {
      margin-left: 8px;
    }

    #container {
      margin-top: 50px;
    }

    ::v-deep .echarts-container {
      height: 400px;
      width: 1000px;
      margin-top: 30px;
    }
  }
</style>