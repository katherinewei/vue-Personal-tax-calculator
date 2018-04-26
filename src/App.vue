<script src="../../../mini-pragram/pages/index/index.js"></script>
<template>
  <div id="app">
    <tab id="navWarp" v-model="currentTab" prevent-default @on-before-index-change="switchTabItem">
      <tab-item  :key="index"  v-for="(tab,index) in tabs" >{{tab.title}}</tab-item>
    </tab>
    <form v-model="rule"  ref="rule" @submit.prevent="formSubmit">
    <div>

        <div v-if="currentTab == 0">
          <x-input title="工资"  v-model="rule.salary" class="weui-vcode"  placeholder='输入您的工资金额'>
            <x-switch  v-model="rule.state" slot="right" title="" @on-change="onChange" />
          </x-input>
          <x-input title="社保"  v-model="rule.security" class="weui-vcode"  placeholder='输入您的社保金额'>
          </x-input>
          <checker
            v-model="rule.isDomestic"
            default-item-class="demo5-item"
            selected-item-class="demo5-item-selected"
          >
            <checker-item v-for="item of radio_items" :key="item.name" :value="item.name">{{item.value}}</checker-item>
          </checker>
        </div>
        <div v-if="currentTab == 1">
          <x-input title="年终奖"  v-model="rule.yearEnd" class="weui-vcode"  placeholder='输入您的年终奖' />
        </div>
        <div v-if="currentTab == 2">
          <popup-picker title="收入类型" :data="incomeType" v-model="rule.incomeTypeIndex" @on-show="onShow" @on-hide="onHide" @on-change="onChangePick" placeholder="请选择"></popup-picker>
          <x-input title="收入金额"  v-model="rule.income" class="weui-vcode"  placeholder='输入您的收入金额' />
        </div>
    </div>
    <div class="btnGroup">
      <input type="submit" value="查询">
      <input type="reset" value="重置">

    </div>
    </form>
    <x-dialog v-model="showDialog" class="dialog-demo" hide-on-blur>
      <div class="dialog-container ">
        <p>应纳税所得额：￥{{tax.price1}}</p>
        <p>适用税率：{{tax.price2}}%</p>
        <p>速算扣除数：￥{{tax.price3}}</p>
        <p>应缴税款：￥{{tax.price4}}</p>
        <p>税{{is_after ? '后' :'前'}}收入：￥{{tax.price5}}</p>
      </div>
    </x-dialog>
  </div>
</template>

<script>
  import { Tab, TabItem, Flexbox, FlexboxItem, XSwitch, XInput, XButton, PopupPicker, Checker, CheckerItem, XDialog } from 'vux'
  export default {
    components: {
      Tab, TabItem, Flexbox, FlexboxItem, XSwitch, XInput, XButton, PopupPicker, Checker, CheckerItem, XDialog
    },
    data () {
      return {
        tabs: [
          { title: '工资、薪金所得' },
          { title: '年终奖' },
          { title: '其他' }
        ],
        currentTab: 0,
        radio_items: [
          { name: '3500', value: '国内：3500' },
          { name: '4800', value: '外籍：4800' }
        ],
        incomeType: [['劳务报酬所得', '个体工商户生产、经营所得', '对企事业单位的承包、承租经营所得', '稿酬所得', '特许权使用费所得', '财产租赁所得', '财产转让所得', '利息、股息、红利所得', '偶然所得']],

        tax: { price1: 0, price2: 0, price3: 0, price4: 0, price5: 0 },
        showDialog: false,
        is_after: false,
        rule: [{
//          salary: '',
//          state: '',
//          security: '',
//            isDomestic: 0,
//          yearEnd: '',
//          income: '',
//          incomeTypeIndex: 0
        }]
      }
    },
    computed: {

    },

    methods: {
      switchTabItem (index) {
        this.currentTab = index
      },
      formSubmit () {
        const value = this.rule
        let total = 0
        const { currentTab } = this
        const { salary, state, security, yearEnd, isDomestic } = value
        this.is_after = state
        let amount = 0
        let tax = 0
        let rateK = 0
        let rateItem = 0
        const rates = [
          { 1500: [0, 0.03] },
          { 4500: [105, 0.1] },
          { 9000: [555, 0.2] },
          { 35000: [1005, 0.25] },
          { 55000: [2755, 0.3] },
          { 80000: [5505, 0.35] },
          { 80001: [13505, 0.45] }
        ]
        switch (currentTab) {
          case 0:
            amount = salary - security - isDomestic
            if (state) {   // 税前工资计算税后
              const { taxes, k, item } = this.calculate(amount, rates)
              tax = taxes
              rateK = k
              rateItem = item
              total = salary - security - taxes
            } else {
              amount = salary - isDomestic
              const ratesAfter = [
                { 1455: [0, 0.03] },
                { 4155: [105, 0.1] },
                { 7755: [555, 0.2] },
                { 27255: [1005, 0.25] },
                { 41255: [2755, 0.3] },
                { 57505: [5505, 0.35] },
                { 57506: [13505, 0.45] }
              ]
              const kAfter = this.calculate(amount, ratesAfter).k
              const itemAfter = this.calculate(amount, ratesAfter).item
              amount = (amount - itemAfter) / (1 - kAfter)
              let { taxes, k, item } = this.calculate(amount, rates)
              tax = taxes
              rateK = k
              rateItem = item
              total = parseFloat(salary) + parseFloat(security) + parseFloat(tax)
            }
            break
          case 1:
            amount = yearEnd
            const { taxes, k, item } = this.calculate(amount, rates, amount / 12)
            tax = taxes
            rateK = k
            rateItem = item
            total = amount - tax
            break
          case 2:
            let incomeType = 0
            this.incomeType[0].map((item, i) => {
              if (item === value.incomeTypeIndex) {
                incomeType = i
              }
            })
            const { income } = value
            const gtgsRate = [{ 15000: [0, 0.05] }, { 30000: [750, 0.1] }, { 60000: [3750, 0.2] }, { 100000: [9750, 0.3] }, { 100001: [14750, 0.35] }] // 个体工商
            switch (incomeType) {
              case 0:
                const lwRate = [{ 20000: [0, 0.2] }, { 50000: [2000, 0.3] }, { 50001: [7000, 0.4] }] // 劳务
                amount = income > 4000 ? income * 0.8 : income - 800
                const { taxes, k, item } = this.calculate(amount, lwRate)
                tax = taxes
                rateK = k
                rateItem = item
                break
              case 1:
                amount = income
                const res = this.calculate(amount, gtgsRate)
                tax = res.taxes
                rateK = res.k
                rateItem = res.item
                break
              case 2:
                amount = income - (3500 * 12)
                const res2 = this.calculate(amount, gtgsRate)
                tax = res2.taxes
                rateK = res2.k
                rateItem = res2.item
                break
              case 3:
                amount = income > 4000 ? income * 0.8 : income - 800
                tax = amount * 0.14
                break
              case 4:
              case 5:
                amount = income > 4000 ? income * 0.8 : income - 800
                tax = amount * 0.2
                break
              case 6:
              case 7:
              case 8:
                amount = income
                tax = amount * 0.2
                break
              default:
                break
            }
            total = income - tax
            break
          default:
            break
        }
        const data = { price1: amount, price2: rateK * 100, price3: rateItem, price4: tax, price5: total }
        if (amount > 0) {
          this.showDialog = true
        }
        this.tax = data
        console.log(data)
        //   })
      },
      calculate (amount, rates, amoutAvg) {
        let taxes = 0
        let k = 0
        let item = 0
        if (amount <= 0) {
          this.$vux.toast.show({
            type: 'text',
            text: '无需交税'
          })
        } else {
          for (let rate of rates) {
            const key = Object.keys(rate)
            const last = rates[rates.length - 1]
            const lastKey = Object.keys(last)
            let flag = amoutAvg
            if (!flag) {
              flag = amount
            }
           // const flag = amoutAvg ? amoutAvg : amount
            if (parseInt(flag) <= parseInt(key)) {
              taxes = amount * rate[key][1] - rate[key][0]
              k = rate[key][1]
              item = rate[key][0]
              break
            }
            if (parseInt(flag) > parseInt(lastKey)) {
              k = last[lastKey][1]
              item = last[lastKey][0]
              taxes = amount * k - item
              break
            }
          }
        }
        return ({ taxes, k, item })
      },
      closeModal () {
        this.showDialog = true
      },
      onShow () {
        console.log('on show')
      },
      onHide (type) {
        console.log('on hide', type)
      },
      onChangePick () {

      },
      onChange (value) {
       // const {value} = event.detail;
        console.log(value)

        this.$vux.toast.show({
          type: 'text',
          text: value ? '计算税后工资' : '计算税前工资',
          position: 'top'
        })
      }
    },
    created () {

    },
    mounted () {
//      window.setTimeout(() => {
//        document.documentElement.scrollTop = 0
//        document.body.scrollTop = 0
//      }, 250)
    }
  }
</script>

<style lang="less">
  .btnGroup{
    width: 90%;
    margin: 50px auto
  }
  .demo5-item {
    width: 100px;
    height: 26px;
    line-height: 26px;
    text-align: center;
    border-radius: 3px;
    border: 1px solid #ccc;
    background-color: #fff;
    margin-right: 6px;
  }
  .demo5-item-selected {
    background: #ffffff url(assets/active.png) no-repeat right bottom;
    border-color: #ff4a00;
  }
  .btnGroup input{
    width:90%;
    display: block;
    margin: 0 auto 10px;
    color: #fff;
    background-color: #64b357;
    border:1px solid #64b357;
    outline: none;
    line-height: 30px;
  }
  .btnGroup input[type=reset]{
    color: #64b357;
    background-color: #fff;
  }
  .dialog-container {
    padding: 10px 0
  }
  .dialog-container p{
      font-size: 16px;
      display: block;
      text-align: center;
      line-height: 26px;
      color: #666
    }


</style>
