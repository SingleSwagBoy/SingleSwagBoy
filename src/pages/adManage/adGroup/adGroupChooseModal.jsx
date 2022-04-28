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
    getScreen, getInfoGroup, getCorner
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
            selectedRowKeys: [],
            modal_box: {
                is_show: false,
                title: '',
            },
            adIndex: 1,
            searchWords: "",
            tagList: [], //父组件传过来的已经被选择的素材
            checkedList: [],
            type: [
                { key: 1, value: '图片' },
                { key: 13, value: '图片（会员可投）' },
                { key: 2, value: '视频' },
                { key: 14, value: '视频（会员可投）' },
                { key: 3, value: '直播' },
                { key: 4, value: '支付' },
                { key: 5, value: '三方sdk' },
                { key: 6, value: '轮播推荐' },
                { key: 7, value: '轮播推荐(自动填充)' },
                { key: 8, value: '优惠券' },
                { key: 9, value: '家庭号' },
                { key: 10, value: '登录' },
                { key: 11, value: 'H5' },
                { key: 12, value: '小程序登录' }
            ],
        }
    }
    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys, this.state.table_box.table_datas);
        let arr = this.state.table_box.table_datas.filter(item => selectedRowKeys.some(l => l == item.id))
        this.setState({ selectedRowKeys, checkedList: arr });
    };
    render() {
        let that = this;
        let { table_box, modal_box, selectedRowKeys } = that.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
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
                                        this.refreshList(this.state.adIndex)
                                    })

                                }}
                            />
                        </div>
                        <Table columns={table_box.table_title} rowSelection={rowSelection} rowKey={item => item.id} dataSource={table_box.table_datas} pagination={false} scroll={{ x: 1500, y: '70vh' }} />

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
                                    adIndex == 2
                                        ?
                                        <div>{rowValue == 1 ? "普通级别" : rowValue == 2 ? "宣传内容" : "未知"}</div>
                                        :
                                        this.getType(row.type)
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
        console.log(adIndex, "adIndex")
        if (adIndex == 11) {
            let arr = table_title.filter(item => item.dataIndex != "iconPicUrl" && item.dataIndex != "picUrl")
            table_title = arr
        }

        table_box.table_title = table_title;
        let selectedRowKeys = []
        tagList.forEach(r => {
            selectedRowKeys.push(r.adId)
        })
        that.setState({
            modal_box: modal_box,
            table_box: table_box,
            adIndex: adIndex,
            tagList: tagList,
            checkedList: tagList,
            selectedRowKeys: selectedRowKeys,
            searchWords: "",
        }, () => {
            that.forceUpdate();
            that.refreshList(adIndex);
        })

    }
    getType(val) {
        let arr = this.state.type.filter(item => item.key == val)
        if (arr.length > 0) {
            return arr[0].value
        } else {
            return "未知"
        }

    }
    refreshList(index) {
        console.log(index, "---------")
        if (index == 1) {
            this.requestAdRightKey()
        } else if (index == 2) {
            this.getScreen()
        } else if (index == 11) {
            this.getInfoGroup()
        } else if (index == 4) {
            this.getCorner()
        }
    }
    requestAdRightKey() {
        let that = this;
        let { table_box } = that.state;
        let obj = {
            page: { currentPage: 1, pageSize: 10000 },
            name: this.state.searchWords
        };
        requestAdRightKey(obj).then(res => {
            table_box.table_datas = res.data.filter(r => r.status == 1);
            that.setState({
                table_box: table_box,
            })

            this.forceUpdate()
        })
    }
    getScreen() {
        let that = this;
        let { table_box } = that.state;

        let obj = {
            page: { currentPage: 1, pageSize: 10000 },
            name: this.state.searchWords
        };
        getScreen(obj).then(res => {
            table_box.table_datas = res.data.filter(r => r.status == 1);
            that.setState({
                table_box: table_box,
            })
        })
    }
    getInfoGroup() {
        let that = this;
        let { table_box } = that.state;

        let obj = {
            page: { currentPage: 1, pageSize: 10000 },
            name: this.state.searchWords
        };
        getInfoGroup(obj).then(res => {
            table_box.table_datas = res.data.filter(r => r.status == 1);
            that.setState({
                table_box: table_box,
            })
        })
    }
    getCorner() {
        let that = this;
        let { table_box } = that.state;

        let obj = {
            page: { currentPage: 1, pageSize: 10000 },
            name: this.state.searchWords
        };
        getCorner(obj).then(res => {
            table_box.table_datas = res.data.filter(r => r.status == 1);
            that.setState({
                table_box: table_box,
            })
        })
    }



}