/*
 * @Author: HuangQS
 * @Date: 2021-10-26 17:19:51
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-10-27 18:05:53
 * @Description: 广告组手动选择弹出框
 */



import React, { Component } from 'react';

import { Input, Form, DatePicker, Button, Table, Modal, Checkbox, Select, message, Image } from 'antd';
import moment from 'moment';
import '@/style/base.css';
import {
    requestAdRightKey,   //获取广告素材 获取右下角广告素材
    getScreen,getInfoGroup
} from 'api';

let { RangePicker } = DatePicker;
let { Option } = Select;

export default class adCreateModal extends Component {

    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.state = {
            table_box: {
                table_title: [],
                table_datas: [],
            },

            modal_box: {
                is_show: false,
                title: '',
            },
            adIndex: 1,
            searchWords: "",
            tagList: [], //父组件传过来的已经被选择的素材
            checkedList: []
        }
    }
    render() {
        let that = this;
        let { table_box, modal_box } = that.state;

        return (
            <div>
                {modal_box &&
                    <Modal visible={modal_box.is_show} title={modal_box.title} transitionName="" maskClosable={false}
                        width={1400} style={{ top: 20 }} onCancel={() => that.onModalCancelClick()}
                        footer={[
                            <Button onClick={() => that.onModalCancelClick()}>取消</Button>,
                            <Button onClick={() => that.onModalConfirmClick()}>选择</Button>
                        ]}>
                        <div className="everyBody" style={{ display: "flex", marginLeft: "20px", alignItems: 'center', marginBottom: "20px" }}>
                            <div style={{ width: "100px" }}>广告名称:</div>
                            <Input.Search key={this.state.searchWords} allowClear placeholder="请输入广告名称" style={{ width: "400px" }} defaultValue={this.state.searchWords}
                                onSearch={(val) => {
                                    this.setState({
                                        page: 1,
                                        searchWords: val
                                    }, () => {
                                        this.refreshList(this.state.adIndex, this.state.checkedList)
                                    })

                                }}
                            />
                        </div>
                        <Table columns={table_box.table_title} dataSource={table_box.table_datas} pagination={false} scroll={{ x: 1500, y: '70vh' }} />

                    </Modal>
                }
            </div>
        )
    }

    componentDidMount() {
        let that = this;
        that.props.onRef(that);
        console.log('初始化');
    }


    //弹出框取消按钮被点击
    onModalCancelClick() {
        let that = this;
        that.setState({
            modal_box: {
                is_show: false,
                title: '',
            }
        })
    }

    //弹出框确定按钮被点击
    onModalConfirmClick() {
        let that = this;
        // let arr = this.state.table_box.table_datas
        // let info = arr.filter(item => item.checked)
        this.props.onGetInfo(this.state.checkedList);
        that.setState({
            modal_box: {
                is_show: false,
                title: '',
            }
        })
    }

    //展示对话框
    showModal(data, adIndex, tagList) {
        let that = this;
        let { table_box, modal_box } = that.state;
        modal_box.is_show = true;
        modal_box.title = data.title;

        let table_title = [
            {
                title: '选择', dataIndex: 'choose', key: 'choose', width: 80,
                render: (rowValue, row, index) => {
                    return <Checkbox checked={row.checked} onChange={(e) => {
                        let check = e.target.checked;
                        let arr = this.state.checkedList
                        if (check) {
                            this.setState({
                                checkedList: [...arr, row]
                            })
                        } else {
                            this.setState({
                                checkedList: arr.filter(r => r.id != row.id && r.adId != row.id)
                            })
                        }
                        console.log(this.state.checkedList, "checkedList")
                        row.checked = check;
                        // that.forceUpdate();
                    }} />
                }
            },
            { title: '素材名称', dataIndex: 'name', key: 'name', width: 300, },
            {
                title: '类型', dataIndex: 'adType', key: 'adType', width: 200,
                render: (rowValue, row, index) => {
                    return (
                        <div>
                        {
                            adIndex == 1 
                            ?  
                            <div>{row.type == 0 ? "通用" : row.type == 1 ? "家庭号" : row.type == 2 ? "公众号登陆" : row.type == 3 ? "小程序登陆" : "未知"}</div>
                            :
                            <div>{rowValue == 1 ? "普通级别" : rowValue == 2 ? "宣传内容" : "未知"}</div>
                        }
                        </div>
                    )
                }
            },
            {
                title: '缩略图', dataIndex: 'iconPicUrl', key: 'iconPicUrl', width: 150,
                render: (rowValue, row, index) => {
                    return (<Image width={50} src={rowValue} />)
                }
            },
            {
                title: '背景图', dataIndex: 'picUrl', key: 'picUrl', width: 150,
                render: (rowValue, row, index) => {
                    return (<Image width={50} src={rowValue} />)
                }
            },
            {
                title: '时间', dataIndex: 'time', key: 'startTime',
                render: (rowValue, row, index) => {
                    let dateFormat = 'YYYY-MM-DD HH:mm:ss';
                    let time = [];
                    if (row.startTime && row.endTime) {
                        time = [moment(new Date(row.startTime)), moment(new Date(row.endTime)),]
                    }
                    return (
                        <RangePicker value={time} showTime format={dateFormat} disabled />
                    )
                }
            },
        ];

        table_box.table_title = table_title;
        that.setState({
            modal_box: modal_box,
            table_box: table_box,
            adIndex: adIndex,
            tagList: tagList,
            checkedList: tagList,
            searchWords: "",
        }, () => {
            that.forceUpdate();
            that.refreshList(adIndex, tagList);
        })

    }

    refreshList(index, tagList) {
        console.log(index,"---------")
        if (index == 1) {
            this.requestAdRightKey(tagList)
        } else if(index == 2){
            this.getScreen(tagList)
        } else if(index == 3){
            this.getInfoGroup(tagList)
        }
    }
    requestAdRightKey(tagList) {
        let that = this;
        let { table_box } = that.state;
        console.log(tagList, "tagList")
        let obj = {
            page: { currentPage: 1, pageSize: 10000 },
            name: this.state.searchWords
        };
        requestAdRightKey(obj).then(res => {
            table_box.table_datas = res.data.filter(r => r.status == 1);
            if (tagList.length > 0) {
                table_box.table_datas.forEach(r => {
                    tagList.forEach(l => {
                        if (l.adId == r.id || l.id == r.id) {
                            r.checked = true
                        }
                    })
                })
            }
            that.setState({
                table_box: table_box,
            })

            this.forceUpdate()
        })
    }
    getScreen(tagList) {
        let that = this;
        let { table_box } = that.state;

        let obj = {
            page: { currentPage: 1, pageSize: 10000 },
            name: this.state.searchWords
        };
        getScreen(obj).then(res => {

            table_box.table_datas = res.data.filter(r => r.status == 1);
            if (tagList.length > 0) {
                table_box.table_datas.forEach(r => {
                    tagList.forEach(l => {
                        if (l.adId == r.id) {
                            r.checked = true
                        }
                    })
                })
            }
            that.setState({
                table_box: table_box,
            })
        })
    }
    getInfoGroup(tagList) {
        let that = this;
        let { table_box } = that.state;

        let obj = {
            page: { currentPage: 1, pageSize: 10000 },
            name: this.state.searchWords
        };
        getInfoGroup(obj).then(res => {
            
            table_box.table_datas = res.data.filter(r => r.status == 1);
            if (tagList.length > 0) {
                table_box.table_datas.forEach(r => {
                    tagList.forEach(l => {
                        if (l.adId == r.id) {
                            r.checked = true
                        }
                    })
                })
            }
            that.setState({
                table_box: table_box,
            })
        })
    }



}