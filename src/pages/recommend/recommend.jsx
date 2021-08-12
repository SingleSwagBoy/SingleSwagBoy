// 节目推荐
import RecommendModal from "./recommend-modal"
import moment from 'moment';
import React, { Component } from 'react';
import {
    requestQrcodeTypes,                 //二维码类型
    requestJumpTypes,                   //获取跳转类型
    requestJumpMenuTypes,               //获取跳转目录类型
    requestGoodLookTypes,               //获取好看类型
    requestProductList,                 //套餐分类
    requestDeliveryTypes,               //投放类型
    requestTvTringAdList,               //广告-列表
    requestTvTringAdResetRatio,         //广告-重设比例
    requestTvTringAdChangeState,        //广告-修改状态
    requestTvTringAdDuplicate,          //广告-拷贝一行
    requestTvTringAdCreate,             //广告-新增
    requestTvTringAdEdit,               //广告-编辑
    requestTvTringAdDeleteItem,         //广告-删除
    requestTvTringAdConfigRatio,        //广告-配置节目单比例
    requestTvTringAdConfigDuration,     //广告-配置节目单持续时间
    requestTvTringAdSyncCache,          //广告-数据同步-生成前台缓存
} from 'api';
import { Input, DatePicker, Button, Tooltip, Table, Pagination, Switch, Modal, Image, Select, Alert, notification } from 'antd';
import './style.css'
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;



export default class Teast extends Component {
    constructor(props) {
        super(props);
        this.state = {
            qrcode_types: [],       //二维码类型
            jump_types: [],         //跳转类型
            jump_menu_types: [],    //跳转目录类型
            good_look_types: [],    //好看类型
            product_list: [],       //套餐分类
            delivery_types: [],     //投放类型

            teast_box: {
                table_datas: [
                    {
                        key: '1',
                        name: '这是广告名字',
                        date: '7月13日',
                        id: 1,
                        rate: "2",
                    },
                ],
                table_title: [
                    { title: 'id', dataIndex: 'id', key: 'id', width: 80, },
                    { title: '名称', dataIndex: 'name', key: 'name', width: 200, },
                    {
                        title: '预览', dataIndex: 'picUrl', key: 'pre', width: 100,
                        render: (rowValue, row, index) => {
                            return (<Image width={50} src={row.picUrl} />)
                        }
                    },
                    {
                        title: '开始时间 - 结束时间', dataIndex: 'date', key: 'date', width: 400,
                        render: (rowValue, row, index) => {
                            let dateFormat = 'YYYY/MM/DD HH:mm:ss';
                            let open_time = moment(row.startTime).format(dateFormat)
                            let stop_time = moment(row.endTime).format(dateFormat)

                            return (
                                <RangePicker showTime defaultValue={[moment(open_time, dateFormat), moment(stop_time, dateFormat)]} format={dateFormat} />
                            )
                        }
                    },
                    { title: '比例 (展示概率)', dataIndex: 'rate', key: 'rate', width: 200, },
                    { title: '展示时长', dataIndex: 'duration', key: 'time', width: 100, },
                    // { title: '地域', dataIndex: 'area', key: 'area', width: 100, },
                    // { title: '渠道', dataIndex: 'market', key: 'market', width: 100, },
                    // { title: '标签', dataIndex: 'tags', key: 'tags', width: 100, },
                    // { title: '跳转频道', dataIndex: 'jumpChannelCode', key: 'jumpChannelCode', width: 100, },
                    { title: '投放类型', dataIndex: 'deliveryType', key: 'deliveryType', width: 100, },
                    { title: '二维码套餐', dataIndex: 'pCode', key: 'pCode', width: 200, },
                    { title: '跳转菜单类型', dataIndex: 'jumpMenuType', key: 'jumpMenuType', width: 200, },
                    { title: '跳转参数', dataIndex: 'jumpParam', key: 'jumpParam', width: 300, },
                    { title: '广告跳转类型', dataIndex: 'jumpType', key: 'jumpType', width: 200, },
                    { title: '好看分类', dataIndex: 'goodLookType', key: 'goodLookType', width: 100, },
                    {
                        title: '二维码地址', dataIndex: 'qrCodeUrl', key: 'qrCodeUrl', width: 300,
                        render: (rowValue, row, index) => {
                            return (
                                <div>
                                    <Image width={50} src={row.qrCodeUrl} />
                                    <div>{row.qrCodeUrl}</div>
                                </div>
                            )
                        }
                    },
                    { title: '比例', dataIndex: 'ratio', key: 'ratio', width: 100, },
                    { title: '二维码颜色', dataIndex: 'qrColor', key: 'qrColor', width: 200, },
                    {
                        title: '状态', dataIndex: 'status', key: 'status', width: 80, fixed: 'right',
                        render: () => {
                            return (
                                <Switch checkedChildren="有效" unCheckedChildren="无效"></Switch>
                            )
                        }
                    },
                    {
                        title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', width: 180,
                        render: (rowValue, row, index) => {
                            return (
                                <div>
                                    <Button size='small' type="primary" type="link" onClick={() => this.onTableItemCopyClick(row)}>复制</Button>
                                    <Button size='small' type="primary" type="link" onClick={() => this.onTableItemEditClick(row)} >编辑</Button>
                                    <Button size='small' type="primary" type="link" onClick={() => this.onTableItemDeleteClick(row)}>删除</Button>
                                </div>
                            )
                        }
                    },
                ],
                table_pages: {
                    currentPage: 0,
                    pageSize: 0,
                    totalCount: 0,
                },
            },
            modal_box: {
                is_show: false,
                select_item: null,
            },

            screen: {
                page_input: { width: 300, marginLeft: 10 },
            }
        }
    }

    render() {
        const { screen, teast_box, modal_box, qrcode_types, jump_types, jump_menu_types, good_look_types } = this.state;
        return (
            <div>
                <div>广告管理</div>

                <div className="teast-wrapper">
                    <div className="input-wrapper">
                        <div className="title">频道与广告的比例:</div>
                        <Input className="input" placeholder="请输入比例" />
                        <Button className="btn" type="primary" size='small'>保存</Button>
                    </div>
                    <div className="input-wrapper">
                        <div className="title">频道展示时长:</div>
                        <Input className="input" placeholder="请输入展示时长" suffix="秒" />
                        <Button className="btn" type="primary" size='small'>保存</Button>
                    </div>


                    <div className="input-wrapper">
                        <div className="title">广告时间选择:</div>
                        <Tooltip title='请选择开始时间' placement="top" >
                            <RangePicker className="date-picker" showTime />
                        </Tooltip>
                    </div>
                    <div className="input-wrapper">
                        <div className="title">搜索频道名称:</div>
                        <Tooltip title='筛选搜索频道名称' placement="top" >
                            <Input className="input" placeholder="请输入搜索频道名称" />
                        </Tooltip>
                        <Button className="btn" type="primary" size='small'>搜索</Button>
                    </div>

                </div>
                <Alert className="alert-box" message="配置详情列表" type="success" action={
                    <div>
                        <Button onClick={() => this.showModalToCreate()} type="primary" style={{ 'marginLeft': '10px' }} >新增</Button>
                        <Tooltip title='重新调整比例:所有比例重置为1，只对有效的重新计算。' placement="top"  >
                            <Button onClick={() => this.onRestRatioClick()} type="primary" style={{ 'marginLeft': '10px' }} >调整比例</Button>
                        </Tooltip>
                        <Button onClick={() => this.onSynchrodataClick()} type="primary" style={{ 'marginLeft': '10px' }}>数据同步</Button>
                    </div>
                }>
                </Alert>
                <Table columns={teast_box.table_title} dataSource={teast_box.table_datas} pagination={false} scroll={{ x: 1300 }} />
                {
                    teast_box.table_pages.totalCount !== 0 &&
                    <div className="pagination-box">
                        <Pagination current={teast_box.table_pages.currentPage} total={teast_box.table_pages.totalCount} pageSize={teast_box.table_pages.pageSize} />
                    </div>
                }

                <RecommendModal visible={modal_box.is_show} modal_box={modal_box} qrcode_types={qrcode_types} jump_types={jump_types} jump_menu_types={jump_menu_types} good_look_types={good_look_types} onOk={this.onModalConfirm.bind(this)} onCancel={this.onModalCancel.bind(this)} />

            </div>
        )
    }
    componentDidMount() {
        this.initList();
    }
    initList() {

        let that = this;
        //获取二维码类型
        requestQrcodeTypes().then(res => {
            that.setState({
                qrcode_types: res,
            })
        });
        //获取跳转类型
        requestJumpTypes().then(res => {
            that.setState({
                jump_types: res,
            })
        });
        //获取跳转目录类型
        requestJumpMenuTypes().then(res => {
            that.setState({
                jump_menu_types: res,
            })
        });
        //获取好看类型
        requestGoodLookTypes().then(res => {
            that.setState({
                good_look_types: res,
            })
        });

        //投放类型
        requestDeliveryTypes().then(res => {
            that.setState({
                delivery_types: res,
            })
        });

        //获取套餐列表
        requestProductList().then(res => {
            let errCode = res.data.errCode;
            if (errCode === 0) {
                let product_list = res.data.data;
                this.setState({
                    product_list: product_list,
                })
            }
        });



        let obj = {}
        // let obj = {
        //     "name": "123", // 名称
        //     "startTime": 1612853591000, // 开始时间，单位毫秒
        //     "endTime": 1835366340000  // 结束时间，单位毫秒
        // }
        requestTvTringAdList(obj).then(res => {
            let that = this;
            let errCode = res.data.errCode;
            if (errCode === 0) {
                let result = res.data.data;
                that.state.teast_box.table_datas = result.data;
                that.state.teast_box.table_pages = result.page;

                that.setState({
                    teast_box: that.state.teast_box
                })
            }
        })
    }


    //重设比例
    onResetRatioClick() {
        // requestTvTringAdResetRatio
    }

    //数据同步被点击
    onSynchrodataClick() {
        let that = this;


    }
    //表格内 复制 按钮被点击
    onTableItemCopyClick(row) {
        let that = this;
        Modal.confirm({
            title: '复制数据',
            content: `复制[${row.id}：${row.name}]这一条数据？`,
            okText: '复制',
            cancelText: '取消',
            onOk() {
                let obj = {
                    id: parseInt(row.id),
                };
                requestTvTringAdDuplicate(obj).then(res => {
                    that.initList();
                });
            }
        });
    }

    //表格内 编辑 按钮被点击
    onTableItemEditClick(row) {
        let that = this;
        that.setState({
            modal_box: {
                is_show: true,
                select_item: row,
            }
        })


    }
    //表格内 删除 按钮被点击
    onTableItemDeleteClick(row) {
        let that = this;
        Modal.confirm({
            title: '删除数据',
            content: `删除[${row.id}：${row.name}]这一条数据？`,
            okText: '删除',
            cancelText: '取消',
            onOk() {
                let obj = {
                    ids: parseInt(row.id),
                };
                requestTvTringAdDeleteItem(obj).then(res => {
                    that.initList();
                })
            }
        });
    }

    //展示弹出框 新增数据
    showModalToCreate() {
        this.setState({
            modal_box: {
                is_show: true,
                select_item: null,
            }
        })
    }
    onModalConfirm(item) {
        console.log('-----------')
        console.log(item);
        let that = this;
        let id = item.id;

        //id存在时为编辑类型 不存在时为创建类型
        (id ? requestTvTringAdEdit(item) : requestTvTringAdCreate(item)).then(res => {
            let errCode = res.data.errCode;
            //成功
            if (errCode === 0) {
                that.setState({
                    modal_box: {
                        is_show: false,
                    }
                })
                that.initList();

                notification['success']({ message: `${id ? '编辑' : '创建'}成功`, });
            }
            //失败
            else {
                notification['error']({ message: `${id ? '编辑' : '创建'}失 败`, description: res.data.msg });

            }
        })


    }
    onModalCancel() {
        this.setState({
            modal_box: {
                is_show: false,
            }
        })
        console.log('cancel')

    }

}


