import React, { Component } from 'react'
import {getPlace} from "api"
import { Tree } from 'antd';
import {} from '@ant-design/icons';
// import adminRoutes from '../../routes/adminRoutes.js'
import {  } from 'react-router-dom'
import {  } from 'react-redux'

class Address extends Component {
  constructor(props){
    super(props)
    this.state = {
      treeData:[]
    }
    
  }
  componentDidMount(){
    //缓存如果有地址就不需要再次去请求
    if(window.localStorage.getItem("address")){
      this.setState({
        treeData:JSON.parse(window.localStorage.getItem("address"))
      })
    }else{
      this.getPlace()
    }
   
  }
  render() {
    /* 
    onCheckAddress====》点击tree的回调方法
    checkedKeys=====》默认选中的数据
    treeData====》tree的初始数据
    */
    return (
      <>
         <Tree height={300} checkable
            onCheck={this.props.onCheckAddress}
            checkedKeys={this.props.defaultAddress}
            // onSelect={this.onSelectAddress.bind(this)}
            treeData={this.state.treeData}
          />
      </>
    )
  }
  // //获取国家地区
  getPlace(){
    let params={
      page:{isPage:9}
    }
    getPlace(params).then(res=>{
      let address = Object.assign([],res.data.data)
      let arr = address.filter(item=>item.parentCode === "CN")
      arr.forEach(r=>{
        r.title = r.name
        r.key = r.code + "-"
        r.children =[]
        address.forEach(h=>{
          if(r.code === h.parentCode){
            r.children.push({title:h.name,key:h.code})
          }
        })
      })
      let tree =[
        {title:"全选",key:"all",children:arr}
      ]
      this.setState({
        treeData:tree
      })
      window.localStorage.setItem("address",JSON.stringify(tree))
    })
  }
}

export default Address