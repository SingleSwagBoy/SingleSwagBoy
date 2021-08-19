import React, { Component } from 'react'
import {getDict} from "api"
import { Checkbox,Row,Col } from 'antd';
import {} from '@ant-design/icons';
// import adminRoutes from '../../routes/adminRoutes.js'
import {  } from 'react-router-dom'
import {  } from 'react-redux'
const CheckboxGroup = Checkbox.Group;

class Market extends Component {
  constructor(props){
    super(props)
    this.state = {
      dictList:[],
      checkData:[],
      onlyValue:[],//全选值
    }
    
  }
  componentDidMount(){
    this.getDict()
  }
  render() {
    /* 
    场景：
        平铺的checkBox
    参数：
        checkData：默认选中的数据 数组//多加了一个判断，
    回调函数：
        getMarketReturn：选中后的数据回调
    */
    return (
      <>
        <Checkbox defaultChecked={this.state.dictList.length === (this.props.checkData?this.props.checkData.length:0)}
          key={new Date().getTime()*6}
          onChange={(val)=>{
            if(val.target.checked){
              // let arr = []
              // this.state.dictList.forEach(r=>{
              //   arr.push(r.value)
              // })
              this.props.getMarketReturn(this.state.onlyValue)
            }else{
              this.props.getMarketReturn([])
            }
        }}>
          全选
        </Checkbox>
        <CheckboxGroup onChange={(val)=>{
          this.props.getMarketReturn(val)
        }}
        key={new Date().getTime()}
        defaultValue={Array.isArray(this.props.checkData)?this.props.checkData:this.props.checkData?this.props.checkData.split(","):[]}
        >
          <Row>
            {
            this.state.dictList.map(r=>{
              return(
                <Col span={6} style={{margin:"0 0 10px 0"}}>
                  <Checkbox value={r.value}>{r.label}</Checkbox>
                </Col>
              )
            })
          }
          </Row>
        </CheckboxGroup>
      </>
      
    )
  }
  getDict(){ //获取产品线
    let params={
      page:{isPage:9},
      prodType:1
    }
    getDict(params).then(res=>{
      let arr = res.data.data
      let list = []
      let onlyValue = []
      arr.forEach(r=>{
        list.push({label:r.name,value:r.code})
        onlyValue.push(r.code)
      })
      this.setState({
        dictList:list,
        onlyValue:onlyValue
      })
    })
  }
}

export default Market