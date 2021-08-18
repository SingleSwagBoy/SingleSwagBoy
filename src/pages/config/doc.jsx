import React, { Component } from 'react';
import { Breadcrumb, Input, DatePicker, Button, Tooltip, Table, Pagination, Modal, Image, Select, Alert, notification, message, Divider } from 'antd';
import {
    requestConfigAddDoc,                //配置列表-添加配置
    requestConfigDocList,               //配置列表-配置列表
    requestConfigDeleteDoc,             //配置列表-删除配置
    requestConfigUpdateDoc,             //配置列表-更新配置
    requestConfigDocKeyList,            //配置列表-配置文件Key列表
} from 'api'
import './doc_style.css'

export default class Doc extends Component {
    constructor(props) {
        super(props);
        this.state = {
            table_box: {
                table_layer: [],                //表格层级 根据层级更新表格title
                table_datas: [],
                table_title: [],
                table_pages: {
                    currentPage: 0,
                    pageSize: 0,
                    totalCount: 0,
                },
            }

        }
    }

    render() {
        let { table_box } = this.state;

        return (
            <div>
                <Breadcrumb>
                    <Breadcrumb.Item>所有</Breadcrumb.Item>
                    {table_box.table_layer.map((item,index)=>{
                        return <Breadcrumb.Item key={index}>{item.name}</Breadcrumb.Item>
                    })}
                </Breadcrumb>

                <Divider orientation="left">文案列表</Divider>
                <Alert className="alert-box" message="配置详情列表" type="success" action={
                    <div>
                        <Tooltip title='仅仅只是刷新当前列表最新的数据' placement="top"  >
                            <Button onClick={() => { }} type="primary" style={{ 'marginLeft': '10px' }} >刷新</Button>
                        </Tooltip>
                        {
                            table_box.table_layer.length > 0 &&
                            <Tooltip title='返回上一层数据列表' placement="top"  >
                                <Button onClick={() => { }} type="primary" style={{ 'marginLeft': '10px' }} >返回</Button>
                            </Tooltip>
                        }

                        <Tooltip title='新增文案数据' placement="top"  >
                            <Button onClick={() => { }} type="primary" style={{ 'marginLeft': '10px' }} >新增</Button>
                        </Tooltip>
                    </div>
                }>
                </Alert>
                <div>{JSON.stringify(table_box.table_layer)}</div>

                <Table columns={table_box.table_title} dataSource={table_box.table_datas} pagination={false} scroll={{ x: 1300 }} />

                {
                    table_box.table_pages.totalCount !== 0 &&
                    <div className="pagination-box">
                        <Pagination current={table_box.table_pages.currentPage} total={table_box.table_pages.totalCount} pageSize={table_box.table_pages.pageSize} />
                    </div>
                }
            </div>
        )
    }

    componentDidMount() {
        this.initData();
        this.refreshList([], { page: { isPage: 9 } })
    }

    initData() {
        let that = this;


    }

    /**
     * 请求数据列表
     * @param {*} table_layer       当前列表层级 
     * @param {*} request_params    请求附带参数
     */
    refreshList(table_layer, request_params) {
        let that = this;

        let table_box = that.state.table_box;
        table_box.table_layer = table_layer;  //更新表格层级

        let titles = [];
        titles.push({ title: 'id', dataIndex: 'id', key: 'id', width: 80, });
        titles.push({ title: '文案名称', dataIndex: 'name', key: 'name', width: 200, });
        let layer_count = table_layer.length;


        if (layer_count === 0 || layer_count === 1) {
            titles.push({ title: '文案编码', dataIndex: 'code', key: 'code', width: 200, });
            if (layer_count === 1) {
                titles.push({ title: '类型', dataIndex: 'type', key: 'type', width: 200, });
            }

            titles.push({ title: '状态', dataIndex: 'status', key: 'status', width: 200, });
            titles.push({
                title: 'key值管理', dataIndex: 'keys', key: 'keys', width: 200,
                render: (rowValue, row, index) => {
                    return (
                        <Button size='small' type="primary" type="link" onClick={() => this.onKeyConfigManagerClick(row)}>
                            {layer_count === 0 ? `共${row.keyCount}条Key配置` : layer_count === 1 ? `共${row.valueCount}条Value配置` : ''}
                        </Button>
                    )
                }
            });
        }


        titles.push({
            title: '操作', dataIndex: 'action', key: 'action', width: 200,
            render: (rowValue, row, index) => {
                return (
                    <div>
                        <Button size='small' type="primary" type="link" onClick={() => { }}>复制</Button>
                        <Button size='small' type="primary" type="link" onClick={() => { }}>编辑</Button>
                        <Button size='small' type="primary" type="link" onClick={() => { }}>删除</Button>
                    </div>
                )
            }
        });

        table_box.table_title = titles;
        that.setState({ table_box: table_box, })

        request_params.pageSize = 10;

        requestConfigDocList(layer_count, request_params).then(res => {
            let errCode = res.data.errCode;
            if (errCode === 0) {

                table_box.table_datas = res.data.data;
                table_box.table_pages = {
                    currentPage: res.data.currentPage,
                    pageSize: res.data.pageSize,
                    totalCount: res.data.totalCount,
                };

                that.setState({
                    table_box: table_box,
                })

            }
        })

    }


    //key值配置管理被点击
    onKeyConfigManagerClick(item) {
        console.log(item)
        let that = this;
        let table_box = that.state.table_box;

        let table_layer = table_box.table_layer;



        let layer_count = table_layer.length;

        let request_params = {}
        //跳往去key层
        if (layer_count === 0) {
            request_params.docId = item.id;
        }
        //跳往去value层
        else if (layer_count === 1) {
            request_params.docKeyId = item.id;
        }
        let layer = {
            id: item.id,
            name: item.name,
        }
        table_layer.push(layer);

        this.refreshList(table_layer, request_params)
    }


}