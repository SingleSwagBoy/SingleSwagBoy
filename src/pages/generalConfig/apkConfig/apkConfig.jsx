/*
 * @Author: HuangQS
 * @Date: 2022-03-14 16:22:05
 * @LastEditors: HuangQS
 * @LastEditTime: 2022-03-14 18:27:17
 * @Description: 
 */

import React, { useState, useEffect, useCallback, useReducer } from 'react'
import { requestApkConfigAdd, requestApkConfigDelete, requestApkConfigList } from 'api'
import { Alert, Button, Table, Modal, Form, Input } from 'antd'
import { MySyncBtn } from "@/components/views.js"
import "./index.css"


function AppConfig(props) {
    const [formRef] = Form.useForm();
    const [forceUpdateId, forceUpdate] = useReducer(() => [], []);
    const [apkList, setApkList] = useState([]);
    const [isShowModal, setModal] = useState(false);


    const tableTitles = [
        { title: 'id', dataIndex: 'id', key: 'id', width: 100, },
        { title: '来源', dataIndex: 'from', key: 'from', width: 100, },
        { title: '备注', dataIndex: 'desc', key: 'desc', width: 100, },
        { title: 'key', dataIndex: 'key', key: 'key', width: 100, },
        {
            title: '操作', dataIndex: 'action', key: 'action', width: 100,
            render: (rowValue, row, index) => {
                return (
                    <Button size='small' onClick={() => onItemDeleteClick(row)}>删除</Button>
                )
            }
        },

    ];

    useEffect(() => {
        console.log('forceUpdateId')

        const fetchData = async () => {
            requestApkConfigList().then(res => {
                console.log('res', res.data);
                setApkList(res.data)
            })
        }
        fetchData();
    }, [forceUpdateId])

    const submitFinish = (e) => {
        requestApkConfigAdd(e).then(res => {
            setModal(false)
            forceUpdate();
        })
    }


    return (
        <div>
            <Alert className="alert-box" message="Apk配置管理" type="success" action={
                <div>
                    <Button style={{ marginLeft: 5 }} onClick={() => onCreateApkConfigClick()} >新增配置</Button>
                    <MySyncBtn type={33} name='同步缓存' />
                </div>
            } />
            <Table columns={tableTitles} dataSource={apkList} pagination={false} scroll={{ x: "80vw", y: '75vh' }} />

            <Modal visible={isShowModal} footer={null} closable={false} width={800}>
                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} form={formRef} onFinish={(e) => submitFinish(e)}>
                    <Form.Item label='来源' name='from' rules={[{ required: true }]}>
                        <Input className="base-input-wrapper" placeholder="请输入配置来源" />
                    </Form.Item>
                    <Form.Item label='备注' name='desc' rules={[{ required: true }]}>
                        <Input className="base-input-wrapper" placeholder="请输入配置备注" />
                    </Form.Item>
                    <Form.Item label='key' name='key' rules={[{ required: true }]}>
                        <Input className="base-input-wrapper" placeholder="请输入配置Key" />
                    </Form.Item>



                    <Form.Item>
                        <Button onClick={() => { setModal(false) }}>取消</Button>
                        <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                            确定
                        </Button>
                    </Form.Item>
                </Form>

            </Modal>

        </div>
    )


    //新增配置
    function onCreateApkConfigClick() {
        formRef.resetFields()
        setModal(true);
    }

    //删除item按钮被点击
    function onItemDeleteClick(item) {
        Modal.confirm({
            title: '删除',
            content: '确定删除这条配置吗？',
            onOk: () => {
                let params = {
                    id: item.id
                }
                requestApkConfigDelete(params).then(res => {
                    forceUpdate();
                })
            }
        })
    }

}

export default AppConfig
