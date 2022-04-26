import React, { Component } from 'react'
import { getGroup } from "api"
import { Tree } from 'antd';
import { } from '@ant-design/icons';
// import adminRoutes from '../../routes/adminRoutes.js'
import { } from 'react-router-dom'
import { } from 'react-redux'

class Address extends Component {
  constructor(props) {
    super(props)
    this.state = {
      treeData: [],
      defaultData: []
    }

  }
  componentDidMount() {
    //缓存如果有地址就不需要再次去请求
    this.getGroup()

  }
  render() {
    /* 
    onCheckAddress====》点击tree的回调方法
    checkedKeys=====》默认选中的数据
    treeData====》tree的初始数据
    */
    let { defaultData, treeData } = this.state
    let { defaultMarket } = this.props
    let arr = []
    let isArr = []
    let marketList = defaultMarket.filter(item=>!item.includes("#"))
    if(marketList.length>0){
      marketList.forEach(r=>{
        if(r.includes("-")){
          isArr.push(r.split("-")[0])
        }else{
          isArr.push(r)
        }
      })
    }
    console.log(isArr,"defaultMarket")
    if (treeData.length > 0) {
      treeData.forEach((r, i) => {
        r.children.forEach((l, index) => {
          let list = l.cp.filter(item=>isArr.some(h=>item.code == h))
          console.log(list,"list")
          if(list.length>0){
            list.forEach((b,j)=>{
              arr.push(b.marketId)
            })
          }
        })
      })
    }
    defaultData = arr
    console.log(defaultData,"defaultData")
    return (
      <>
        <Tree height={300} checkable
          onCheck={this.props.onCheckMarket}
          checkedKeys={defaultData}
          // onSelect={this.onSelectAddress.bind(this)}
          treeData={this.state.treeData}
        />
      </>
    )
  }
  // //获取国家地区
  getGroup() {
    let params = {
      page: { isPage: 9 }
    }
    // let {defaultData} = this.state
    // let {defaultMarket } = this.props
    // defaultData = defaultMarket
    getGroup(params).then(res => {
      let arr = Object.assign([], res.data)
      // let arr = address.filter(item=>item.parentCode === "CN")
      let list = []
      arr.forEach((r, i) => {
        r.title = r.name
        r.key = i + "#"
        r.children = []
        r.cp.forEach((h, index) => {
          r.children.push({ title: h.name, key: h.code + "-" + i + "-" + index })
          h.marketId = h.code + "-" + i + "-" + index
        })

      })
      let tree = [
        { title: "全选", key: "all", children: arr }
      ]
      this.setState({
        treeData: tree,
        // defaultData:list
      })
      // window.localStorage.setItem("address",JSON.stringify(tree))
    })
  }
}

export default Address