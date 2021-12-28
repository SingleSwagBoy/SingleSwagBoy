/*
 * @Author: HuangQS
 * @Date: 2021-12-23 14:43:31
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-12-28 15:08:15
 * @Description: tv推荐配置
 */

import React, { Component } from 'react';
import { Alert, Button, Table, Row, Col, Select, Image, Pagination, message } from 'antd';
import moment from 'moment';
import '@/style/base.css';
import TvConfigModal from './tvRecommendConfigModal';
import './tvRecommendConfig.css'

import {
    requestChannelRecommendList,                            //频道管理-列表
    requestChannelRecommendCreate,                          //频道管理-新增
    requestChannelRecommendEdit,                            //频道管理-编辑
    requestChannelRecommendDelete,                          //频道管理-删除
    requestChannelRecommendChangeState,                     //频道管理-修改状态
} from 'api'
import { MySyncBtn } from '@/components/views.js';
let { Option } = Select;



export default class tvRecommendConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refTvConfigModal: null,
            dictState: [
                { key: 0, value: '无效' },
                { key: 1, value: '有效' },
            ],
            recommendBox: {
                title: [],
                data: [],
                page: undefined,
            },
        }
    }

    render() {
        let that = this;
        let { recommendBox } = that.state;
        return (
            <div>
                <Alert className="alert-box" message="配置TV频道" type="success" action={
                    <div>
                        <Button onClick={() => that.onCreateConfigClick(null)} type="primary" style={{ 'marginLeft': '10px' }} >新增配置</Button>
                        <MySyncBtn type={24} name='同步缓存' />
                    </div>
                } />

                <Table columns={recommendBox.title} dataSource={recommendBox.data} pagination={false} scroll={{ x: 1500, y: '75vh' }}
                    expandable={{
                        expandedRowRender: record =>
                            <div className='expandedWrapper'>
                                {record.content.map((item, index) => {
                                    return (
                                        <div className='expandedBox'>
                                            <div className='expandedBoxLine'>
                                                <div className='expandedBoxTitle' >类型:</div>
                                                <div className='expandedBoxContent'>{item.type == '10' ? '推荐视频' : '推荐频道'}</div>
                                            </div>
                                            <div className='expandedBoxLine'>
                                                <div className='expandedBoxTitle'>推荐渠道id:</div>
                                                <div className='expandedBoxContent'>{item.channelId}</div>
                                            </div>
                                            <div className='expandedBoxLine'>
                                                <div className='expandedBoxTitle'>推荐节目id:</div>
                                                <div className='expandedBoxContent'>{item.programId}</div>
                                            </div>
                                            <div className='expandedBoxLine'>
                                                <div className='expandedBoxTitle'>推荐列表id:</div>
                                                <div className='expandedBoxContent'>{item.tvCVId}</div>
                                            </div>
                                            <div className='expandedBoxLine'>
                                                <div className='expandedBoxTitle'>标题:</div>
                                                <div className='expandedBoxContent'>{item.title}</div>
                                            </div>
                                            <div className='expandedBoxLine'>
                                                <div className='expandedBoxTitle'>封面图:</div>
                                                <div className='expandedBoxContent'>
                                                    <Image width={60} src={item.cover} />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ,
                        rowExpandable: record => record.name !== 'Not Expandable',
                    }}
                />

                {
                    recommendBox.page &&
                    <div className="pagination-box">
                        <Pagination defaultCurrent={recommendBox.page.currentPage} total={recommendBox.page.totalCount} pageSize={recommendBox.page.pageSize} onChange={(page, pageSize) => that.onPageChange(page, pageSize)} />
                    </div>

                }


                <TvConfigModal onRef={(val) => { this.setState({ refTvConfigModal: val }) }} onResult={(obj) => { that.onModalResult(obj) }} />

            </div>
        )
    }

    componentDidMount() {
        let that = this;
        that.initData();
    }
    initData() {
        let that = this;
        let { recommendBox, dictState } = that.state;
        let title = [
            // { title: '列表id', dataIndex: 'id', key: 'id', width: 80, },
            // { title: '频道id', dataIndex: 'channelId', key: 'channelId', width: 100, },
            // { title: '用户标签', dataIndex: 'tagCode', key: 'tagCode', width: 100, },
            { title: '推荐标题', dataIndex: 'title', key: 'title', width: 100, },
            { title: '频道', dataIndex: 'channelId', key: 'channelId', width: 100, },
            {
                title: '关联频道视频', width: 100,
                render: (rowValue, row, index) => {
                    // return <div>请展开列表</div>

                    return (
                        row.content.map((item, index) => {
                            return (<div> {`${item.type == '10' ? '视频' : '频道'}:${item.type == '10' ? item.programId : item.channelId}`}  </div>)
                        })
                    )
                }
            },

            {
                title: '是否长期', dataIndex: 'isTimeless', key: 'isTimeless', width: 100,
                render: (rowValue, row, index) => {
                    return (<div>{rowValue == '1' ? '是' : '否'}</div>)
                }
            },
            {
                title: '有效时间', dataIndex: 'time', key: 'time', width: 100,
                render: (rowValue, row, index) => {
                    return (
                        <div>
                            <div>{that.converTimeByMoment(row.startAt)}</div>
                            <div>{that.converTimeByMoment(row.endAt)}</div>
                        </div>
                    )
                }
            },

            {
                title: '状态', dataIndex: 'state', key: 'state', width: 100,
                render: (rowValue, row, index) => {
                    return (
                        <Select value={rowValue} placeholder='请选择状态' onChange={(e) => { that.onItemStatusChange(e, row) }}>
                            {dictState.map((item, index) => {
                                return <Option key={index} value={item.key}>{item.value}</Option>
                            })}
                        </Select>
                    )
                }
            },

            {
                title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', width: 80,
                render: (rowValue, row, index) => {
                    return (
                        <div>
                            <Button size='small' type="primary" type="link" onClick={() => this.onTableItemEditClick(row)} >编辑</Button>
                            <Button size='small' type="primary" type="link" onClick={() => this.onTableItemDeleteClick(row)}>删除</Button>
                        </div>
                    )
                }
            },
        ];

        recommendBox.title = title;

        that.setState({
            recommendBox: recommendBox,
        }, () => {
            that.refreshChannelRecommendList();
        })

    }
    //刷新频道列表
    refreshChannelRecommendList() {
        let that = this;
        let { recommendBox } = that.state;

        recommendBox.data = [];

        that.setState({
            recommendBox: recommendBox,
        }, () => {
            //获取频道列表
            requestChannelRecommendList({})
                .then(res => {
                    let response = res.data;

                    //将content解析出来 
                    for (let i = 0, len = response.data.length; i < len; i++) {
                        let item = response.data[i];
                        item.content = item.content ? JSON.parse(item.content) : [];
                    }


                    recommendBox.data = response.data;
                    recommendBox.page = response.page;

                    that.setState({
                        recommendBox: recommendBox,
                    })
                })
        })


    }


    //状态变更
    onItemStatusChange(e, item) {
        let that = this;

        let obj = {
            ids: item.id,
        }

        requestChannelRecommendChangeState(obj).then(res => {
            that.refreshChannelRecommendList();
        })
    }




    //创建配置
    onCreateConfigClick(item) {
        let that = this;
        let { refTvConfigModal } = that.state;

        refTvConfigModal.refreshFromData(item);
    }


    //编辑配置
    onTableItemEditClick(item) {
        let that = this;
        that.onCreateConfigClick(item);
    }

    //删除配置
    onTableItemDeleteClick(item) {
        let that = this;

        let obj = {
            ids: item.id,
        }

        requestChannelRecommendDelete(obj).then(res => {
            that.refreshChannelRecommendList();
        })
    }
    //页面改变
    onPageChange(page, pageSize) {
        console.log('page:', page, 'size:', pageSize)
    }


    //弹出框回调
    onModalResult(obj) {
        let that = this;
        let { refTvConfigModal } = that.state;

        let id = obj.id;

        //编辑|创建
        (id ? requestChannelRecommendEdit(obj) : requestChannelRecommendCreate(obj)).then(res => {
            message.success('操作成功');
            that.refreshChannelRecommendList();

            refTvConfigModal.onCloseClick();   //关闭弹出框
        }).catch(res => {
            message.error('操作失败', res);
        })


        // requestChannelRecommendCreate,                          //频道管理-新增
        //     requestChannelRecommendEdit,                            //频道管理-编辑
    }

    //转换时间
    converTimeByMoment(time) {
        try {
            let dateFormat = 'YYYY-MM-DD HH:mm:ss';
            return moment(time).format(dateFormat)

        } catch (error) {

        }
        return '';
    }
}