/*
 * @Author: HuangQS
 * @Date: 2022-03-14 16:22:05
 * @LastEditors: HuangQS
 * @LastEditTime: 2022-03-15 13:52:25
 * @Description: 
 */

import React, { useState, useEffect, useCallback, useReducer } from 'react'
import { requestApkConfigAdd, requestApkConfigDelete, requestApkConfigList ,requestApkConfigupdate} from 'api'
import { Alert, Button, Table, Modal, Form, Input,Switch, message,Pagination } from 'antd'
import { MySyncBtn,MyImageUpload } from "@/components/views.js"
import "./index.css"


function AppConfig(props) {
    const [forceUpdatePage, forceUpdatePages] = useReducer(() => [], []);
    const [formRef] = Form.useForm();
    const [forceUpdateId, forceUpdate] = useReducer(() => [], []);
    const [apkList, setApkList] = useState([]);
    const [apkPage, setApkPage] = useState({ currentPage: 1, pageSize: 100, totalCount: 0 });
    const [isShowModal, setModal] = useState(false);
    const [source, setSource] = useState("")   //  add / edit
    const [currentItem, setCurrent] = useState({})
    const [tailLayout] = useState({ wrapperCol: { offset: 16, span: 48 } })


    const tableTitles = [
        { title: 'id', dataIndex: 'id', key: 'id', width: 100, },
        { title: '来源', dataIndex: 'from', key: 'from', width: 200, },
        { title: '备注', dataIndex: 'desc', key: 'desc', width: 200, },
        { title: 'key', dataIndex: 'key', key: 'key', width: 200, },
        { title: '访问量', dataIndex: 'num', key: 'num', width: 100, },
        {
            title: "状态",
            dataIndex: "status",
            key: "status",
            render: (rowValue, row, index) => {
                return (
                    <div>{<Switch
                    checkedChildren="有效"
                    unCheckedChildren="无效"
                    defaultChecked={rowValue == 1 ? true : false}
                    onChange={(val) => {
                        let info = JSON.parse(JSON.stringify(row))
                        info.status = val ? 1 : 2
                        console.log(info, "info.status")
                        requestApkConfigupdate(info).then(res=>{
                            message.success("更新成功")
                            setModal(false)
                            forceUpdate();
                        })
                    }}
                    />}</div>
                )
            }
        },
        {
            title: '操作', dataIndex: 'action', key: 'action', width: 240,
            render: (rowValue, row, index) => {
                return (
                    <>
                        <Button size='small' type="primary" onClick={() => {
                            row.status = row.status == 1 ? true : false
                            setCurrent(row)
                            formRef.setFieldsValue(row)
                            setModal(true)
                            setSource("edit")
                        }}>编辑</Button>
                        <Button size='small' style={{marginLeft:"10px"}} onClick={() => onItemDeleteClick(row)}>删除</Button>
                    </>
                )
            }
        },

    ];

    useEffect(() => {
        console.log('forceUpdateId')
        setApkList([])
        const fetchData = async () => {
            requestApkConfigList().then(res => {
                console.log('res', res.page);
                setApkList(res.data);
                setApkPage(res.page);
            })
        }
        fetchData();
    }, [forceUpdateId])

    const submitFinish = (e) => {
        if(source == "add"){   //新增商品
            let params={
                ...e,
                status: e.status ? 1 : 2
            }
            requestApkConfigAdd(params).then(res => {
                message.success("新增成功")
                setModal(false)
                forceUpdate();
            })
        }else if(source == "edit"){    // 编辑商品
            let params={
                ...currentItem,
                ...e,
                status: e.status ? 1 : 2
            }
            requestApkConfigupdate(params).then(res=>{
                message.success("更新成功")
                setModal(false)
                forceUpdate();
            })
        }
        
    }
    //获取上传文件图片地址 
    const getUploadFileImageUrlByType = (type) => {
        let image_url = formRef.getFieldValue(type);
        return image_url ? image_url : '';
    }
    //获取上传文件
    const getUploadFileUrl = (type, file, newItem) => {
        let image_url = newItem.fileUrl;
        let obj = {};
        obj[type] = image_url;
        formRef.setFieldsValue(obj);
        forceUpdatePages()
    }


    return (
        <div>
            <Alert className="alert-box" message="第三方授权管理" type="success" action={
                <div>
                    <Button style={{ marginLeft: 5 }} onClick={() => onCreateApkConfigClick()} >新增配置</Button>
                    <MySyncBtn type={33} name='同步缓存' />
                </div>
            } />
            <Table columns={tableTitles} rowKey={item=>item.id} dataSource={apkList} pagination={false} scroll={{ x: "80vw", y: '75vh' }} />

            {/* {
                apkPage &&
                <div className="pagination-box">
                    <Pagination current={apkPage.currentPage} pageSize={apkPage.pageSize} onChange={(page, pageSize) => onPageChange(page, pageSize)} total={apkPage.totalCount} />
                </div>
            } */}



            <Modal title={source=='add'?"新增":source=='edit'?"编辑":""} visible={isShowModal} footer={null} closable={false} width={800}>
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
                    <Form.Item label="状态" name="status" valuePropName="checked">
                        <Switch checkedChildren="有效" unCheckedChildren="无效" ></Switch>
                    </Form.Item>
                    <Form.Item label="授权" name="authorization">
                        <MyImageUpload
                        getUploadFileUrl={(file, newItem) => { getUploadFileUrl('authorization', file, newItem) }}
                        imageUrl={getUploadFileImageUrlByType('authorization')} />
                    </Form.Item>
                    <Form.Item label="营业执照" name="businessLicense">
                        <MyImageUpload
                        getUploadFileUrl={(file, newItem) => { getUploadFileUrl('businessLicense', file, newItem) }}
                        imageUrl={getUploadFileImageUrlByType('businessLicense')} />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
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
        setSource("add")
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

    //刷新页码
    function onPageChange(page, pageSize) {
        forceUpdate();
    }

}

export default AppConfig
