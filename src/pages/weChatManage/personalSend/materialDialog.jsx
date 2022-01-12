

import React, { Component } from 'react'
import {materialSend,wechatMaterialSend } from 'api'
import { Checkbox, Card, Button, message, Pagination, Modal, List, Select } from 'antd'
import { } from 'react-router-dom'
import { } from "@ant-design/icons"
import moment from 'moment';
import util from 'utils'
import "./style.css"
export default class EarnIncentiveTask extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            pageSize: 12,
            total: 0,
            loading: false,
            checkedItem: [],
            chooseMaterial: [],//选择素材的数组
            layout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            tailLayout: {
                wrapperCol: { offset: 20, span: 4 },
            },
            materialData: [],
            materialShow: false,
            materialType:null,
        }
    }
    render() {
        let {materialData,materialShow } = this.state;
        let { totalCount, } = this.props
        return (
            <div className="materialBox">
                <Modal title="图文素材列表" centered visible={materialShow} onCancel={() => { this.setState({materialShow:false}) }} footer={null} width={800}>
                    <Checkbox.Group defaultValue={this.state.checkedItem} key={this.state.checkedItem} style={{ width: '100%' }} onChange={(e) => {
                        console.log(e)
                        this.setState({
                            checkedItem: e
                        })
                    }}>
                        <List
                            grid={{ gutter: 16, column: 3 }}
                            dataSource={materialData}
                            renderItem={(item, index) => (
                                <List.Item key={index}>
                                    <Checkbox value={item.media_id} onClick={(e) => {
                                        let arr = this.state.chooseMaterial
                                        console.log(arr, "arr")
                                        if (e.target.checked) {
                                            let num = 0
                                            arr.forEach(r => {
                                                num = num + r.content.news_item.length
                                            })
                                            if (num + item.content.news_item.length > 6) {
                                                let info = this.state.checkedItem
                                                info.splice(info.length - 1, 1)
                                                this.setState({
                                                    checkedItem: info
                                                })
                                                console.log(info)
                                                return message.error("已超过6条素材,后续选中的素材都不生效")
                                            }
                                            arr.push(item)
                                        } else {
                                            console.log(arr,item)
                                            arr = arr.filter(r => r.media_id != item.media_id)
                                        }
                                        this.setState({
                                            chooseMaterial: arr
                                        })
                                    }}>
                                        {
                                            item.content.news_item && item.content.news_item.map((r, i) => {
                                                return (
                                                    <Card >
                                                        {
                                                            i == 0
                                                                ?
                                                                <div style={{ maxHeight: "300px", width: "100%", position: "relative" }} >
                                                                    <div ><img style={{ width: "100%", height: "100px" }} src={r.thumb_url} alt="" /></div>
                                                                    <div style={{ position: "absolute", "bottom": "0", "color": "#000", padding: "10px" }}>{r.title}</div>
                                                                </div>
                                                                :
                                                                <div style={{ display: "flex", "alignItems": "center", "justifyContent": 'space-between', padding: "10px" }} >
                                                                    <div>{r.title}</div>
                                                                    <div ><img style={{ width: "30px", height: "30px" }} src={r.thumb_url} alt="" /></div>
                                                                </div>
                                                        }
                                                    </Card>
                                                )
                                            })
                                        }
                                    </Checkbox>
                                </List.Item>
                            )}
                        />
                    </Checkbox.Group>
                    <div style={{ width: "100%", display: "flex", "alignItems": "center", justifyContent: "space-between" }}>
                        <div><Pagination defaultCurrent={1} pageSize={this.state.pageSize} total={totalCount} onChange={(page, pageSize) => this.changeSize(page, pageSize)} /></div>
                        <div>
                            <Button onClick={() => { this.setState({ materialShow: false }) }}>取消</Button>
                            <Button type="primary" style={{ margin: "0 20px" }} onClick={()=>{
                                this.props.onChooseInfo(this.state.chooseMaterial)
                            }}>
                                确定
                            </Button>
                        </div>
                    </div>

                </Modal>
            </div>
        )
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    openDialog(state, data,item,type) {
        console.log(state, data)
        this.setState({
            materialData: data,
            materialShow: state,
            chooseMaterial:[],
            checkedItem:[]
        },()=>{
            if(type){
                this.setState({materialType:type})
            }
            console.log(this.props.hasChooseMaterial,"Material=========>")
            if(item){
                console.log(item)
                data.forEach((r)=>{
                    let arr = this.props.hasChooseMaterial.filter(l=>l.media_id == r.media_id) 
                    let len = r.content.news_item.filter(l=>item.some(h=>h.thumb_media_id == l.thumb_media_id && h.url == l.url))
                    // console.log("arr,len=========>",arr,len)
                    if(arr.length>0 && len.length>0){
                        let checkedItem = this.state.checkedItem
                        let chooseMaterial = this.state.chooseMaterial
                        chooseMaterial.push(r)
                        checkedItem.push(r.media_id)
                        this.setState({
                            checkedItem:checkedItem, //被选中的key
                            chooseMaterial:chooseMaterial //已经选择的素材
                        })
                    }
                })
                
            }
        })
        
    }

    changeSize = (page, pageSize) => {   // 分页
        console.log(page, pageSize);
        this.setState({
            page: page - 1
        }, () => {
            if(this.state.materialType == 1){
                this.materialSend()
            }else{
                this.wechatMaterialSend()
            }
          
        })
    }
    materialSend(){
        let params={
            "type": "news",   //news 图文
            "count": this.state.pageSize,   // 数量
            "wxCode": this.props.wxCode,  // 公众号code
            "offset": (this.state.page) * this.state.pageSize  //偏移量
        }
        materialSend(params).then(res=>{
            console.log(res.data)
            this.setState({
                materialData:res.data.item
            })
        })
    }
    wechatMaterialSend() {
        let params = {
            "count": this.state.pageSize,   // 数量
            "wxCode": this.props.wxCode,  // 公众号code
            "offset": (this.state.page) * this.state.pageSize   //偏移量
        }
        wechatMaterialSend(params).then(res => {
            console.log(res.data)
            this.setState({
                materialData: res.data.item,
            })
        })
    }

}