import React, { Component } from 'react'

import { Input, InputNumber, DatePicker, Image, Button, Modal, Form, Select, Space, Divider, Alert, Table, message } from 'antd';
import moment from 'moment';
import { MyImageUpload, MyTagTypes } from '@/components/views.js';
import { MinusCircleOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons"


import {
    getChannel,                         //频道推荐-展示频道
    requestChannelRecommendSearchChannel,                   //频道管理-下拉搜索频道
    requestChannelRecommendSearchProgram,                   //频道管理-下拉搜索视频
} from "api";


let { RangePicker } = DatePicker;
let { Option } = Select;
let privateData = {
    inputTimeOutVal: null
};
export default class recommendModal extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();

        this.state = {
            refTagTypes: null,
            format: 'YYYY-MM-DD HH:mm',
            searchChannel: [],      //频道类型 搜索到频道
            searchProgram: [],      //节目类型 搜索到视频                    

            modalBox: {
                isShow: false,
                isLoading: false,
            },
            //关联类型
            dictType: [
                { key: 10, value: '推荐视频' },
                { key: 20, value: '推荐频道' },
            ],
            //是否有效
            dictState: [
                { key: 0, value: '无效' },
                { key: 1, value: '有效' },
            ],
            // 是否长期
            dictIsTimeless: [
                { key: 0, value: '否' },
                { key: 1, value: '是' },
            ],


            //content中的数据
            contentBox: {
                title: [],
                data: [],
            },
            //渠道搜索
            selectProps: {
                optionFilterProp: "children",
                filterOption(input, option) {
                    return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                },
                showSearch() {
                    console.log('onSearch')
                }
            },

            //渠道搜索
            searchChannelBox:[],
        }
    }

    componentDidMount() {
        let that = this;
        that.props.onRef(this);
    }



    render() {
        let that = this;
        let { format, modalBox, contentBox, searchProgram, searchChannel, selectProps, searchChannelBox,
            dictType, dictIsTimeless, dictState } = that.state;

        return (
            <div>
                <Modal className="modal-box" visible={modalBox.isShow} title="配置管理" width={1200} transitionName="" onCancel={() => { that.onCloseClick() }} forceRender={true}
                    footer={[
                        <Button onClick={() => { that.onCloseClick() }}>取消</Button>
                        ,
                        <Button type="primary" loading={modalBox.isLoading} onClick={() => that.onConfirmClick()}>确定</Button>,
                    ]}>

                    <Form name='form' labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} ref={that.formRef}>
                        {
                            that.formRef.current &&
                            <div>
                                {
                                    that.formRef.current.getFieldValue("id") &&
                                    <Form.Item label="id" name='id' rules={[{ required: true }]}>
                                        <Input disabled className="base-input-wrapper" />
                                    </Form.Item>
                                }

                                <Form.Item label="推荐标题" name='title' rules={[{ required: true, message: '请输入推荐标题' }]}>
                                    <Input className="base-input-wrapper" placeholder='请输入标题' />
                                </Form.Item>
                                <Form.Item label="频道" name='channelId' rules={[{ required: true }]} >

                                    <Select className="base-input-wrapper" allowClear {...selectProps} placeholder="请输入关键字搜索[频道]信息" 
                                    onSearch={(searchKey) => {
                                        if (privateData.inputTimeOutVal) {
                                            clearTimeout(privateData.inputTimeOutVal);
                                            privateData.inputTimeOutVal = null;
                                        }
                                        privateData.inputTimeOutVal = setTimeout(() => {
                                            if (!privateData.inputTimeOutVal) return;
                                            that.onChannelSearch(searchKey)
                                        }, 800)
                                       
                                    }} >
                                        {
                                            searchChannel.map((item, index) => {
                                                return <Option value={item.code} key={item.id}>{item.name + "----" + item.code}</Option>
                                            })
                                        }
                                    </Select>

                                </Form.Item>

                                <Form.Item label="有效时间" name='time'>
                                    <RangePicker className="base-input-wrapper" format={format} showTime placeholder={['上线时间', '下线时间']} />
                                </Form.Item>

                                <Form.Item label="状态" name='state'>
                                    <Select placeholder='请选择状态' className="base-input-wrapper">
                                        {dictState.map((item, index) => {
                                            return <Option key={index} value={item.key}>{item.value}</Option>
                                        })}
                                    </Select>
                                </Form.Item>

                                <Form.Item label="排序" name='sortOrder'>
                                    <Input className="base-input-wrapper" placeholder='请输入排序号' type='number' />
                                </Form.Item>

                                {/* <Form.Item label="是否长期" name='isTimeless'>
                                    <Select placeholder='请选择是否长期' className="base-input-wrapper">
                                        {dictIsTimeless.map((item, index) => {
                                            return <Option key={index} value={item.key}>{item.value}</Option>
                                        })}
                                    </Select>
                                </Form.Item> */}

                                <Form.List name='content'>
                                    {(fields, { add, remove }) => {
                                        let widthStyle = { 'width': 270 };

                                        let form;
                                        try {
                                            form = that.formRef.current.getFieldValue("content");
                                        } catch (error) {

                                        }

                                        return <Form.Item label="推荐关联" >
                                            {
                                                fields.map((field, index) => (
                                                    <div>
                                                        <Space key={field.key}>

                                                            <Form.Item   {...field} name={[field.name, 'type']}>
                                                                <Select style={{ 'width': 120 }} placeholder='请选择类型' onChange={() => that.forceUpdate()}>
                                                                    {dictType.map((item, index) => {
                                                                        return <Option key={index} value={item.key}>{item.value}</Option>
                                                                    })}
                                                                </Select>
                                                            </Form.Item>
                                                            {/*
                                                            {key: 10, value: '推荐视频' },
                                                            {key: 20, value: '推荐频道' }, */}

                                                            {
                                                                // 推荐视频
                                                                form[index] && form[index].type === 10 && searchProgram &&
                                                                <div>
                                                                    <Form.Item name={[field.name, 'programId']} >
                                                                        <Select style={widthStyle} showSearch placeholder='请选择推荐视频'
                                                                            filterOption={(input, option) => {
                                                                                if (!input) return true;
                                                                                let children = option.children;
                                                                                if (children) {
                                                                                    let key = children[2];
                                                                                    let isFind = false;
                                                                                    isFind = `${key}`.toLowerCase().indexOf(`${input}`.toLowerCase()) >= 0;
                                                                                    if (!isFind) {
                                                                                        let code = children[0];
                                                                                        isFind = `${code}`.toLowerCase().indexOf(`${input}`.toLowerCase()) >= 0;
                                                                                    }
                                                                                    return isFind;
                                                                                }
                                                                            }}
                                                                            onChange={(e,i)=>{
                                                                                console.log(e,i)
                                                                                let arr = searchProgram.filter(item=>item.programId == e && i["data-channelid"] == item.channelId)
                                                                                if(arr.length>0){
                                                                                    form[index].cover = arr[0].programPic
                                                                                    form[index].title = arr[0].programName
                                                                                    form[index].programId = arr[0].programId
                                                                                    this.formRef.current.setFieldsValue({content:form})
                                                                                    this.forceUpdate()
                                                                                }
                                                                            }}
                                                                            >
                                                                            {searchProgram.map((item, index) => {
                                                                                return <Option key={index} value={item.programId} data-channelid={item.channelId}>{item.programName}-{item.channelId}</Option>
                                                                            })}
                                                                        </Select>
                                                                        {/* <Input /> */}
                                                                    </Form.Item>
                                                                </div>
                                                            }

                                                            {
                                                                // 推荐频道
                                                                form[index] && form[index].type === 20 && searchChannel &&
                                                                <Form.Item name={[field.name, 'channelId']}>
                                                                    <Select style={widthStyle} showSearch placeholder='请选择推荐频道'
                                                                        filterOption={(input, option) => {
                                                                            if (!input) return true;
                                                                            let children = option.children;
                                                                            if (children) {
                                                                                let key = children[2];
                                                                                let isFind = false;
                                                                                isFind = `${key}`.toLowerCase().indexOf(`${input}`.toLowerCase()) >= 0;
                                                                                if (!isFind) {
                                                                                    let code = children[0];
                                                                                    isFind = `${code}`.toLowerCase().indexOf(`${input}`.toLowerCase()) >= 0;
                                                                                }

                                                                                return isFind;
                                                                            }
                                                                        }}
                                                                        onSearch={(searchKey) => {
                                                                            if (privateData.inputTimeOutVal) {
                                                                                clearTimeout(privateData.inputTimeOutVal);
                                                                                privateData.inputTimeOutVal = null;
                                                                            }
                                                                            privateData.inputTimeOutVal = setTimeout(() => {
                                                                                if (!privateData.inputTimeOutVal) return;
                                                                                that.onChannelSearch(searchKey)
                                                                            }, 800)
                                                                           
                                                                        }}
                                                                        onChange={(e)=>{
                                                                            console.log(e,searchChannel)
                                                                            let arr = searchChannel.filter(item=>item.code == e)
                                                                            console.log(arr)
                                                                            if(arr.length>0){
                                                                                form[index].cover = arr[0].posterUrl
                                                                                form[index].title = arr[0].name
                                                                                form[index].channelId = arr[0].code
                                                                                this.formRef.current.setFieldsValue({content:form})
                                                                                this.forceUpdate()
                                                                            }
                                                                        }}
                                                                        >
                                                                        {searchChannel.map((item, index) => {
                                                                            return <Option key={index} value={item.code}>{item.name}-{item.code}</Option>
                                                                        })}
                                                                    </Select>
                                                                </Form.Item>
                                                            }

                                                            {/* <Image width={200} height={50} src={'http://test.cdn.mydianshijia.com/static/ad/3b020cdfbadda3e1e97a0b4beadfbb5b.png'}></Image> */}


                                                            <Form.Item name={[field.name, 'cover']}>
                                                                <MyImageUpload
                                                                    getUploadFileUrl={(file, newItem) => {
                                                                        if (form && form[index]) {
                                                                            form[index].cover = newItem.fileUrl
                                                                            that.forceUpdate()
                                                                        } else {
                                                                            that.forceUpdate();
                                                                        }
                                                                    }}
                                                                    imageUrl={form[index] ? form[index].cover : ''} />
                                                            </Form.Item>
                                                            <Form.Item name={[field.name, 'title']}  fieldKey={[field.fieldKey, 'title']}>
                                                                <Input placeholder='请输入关联标题' />
                                                            </Form.Item>

                                                            <Form.Item name={[field.name, 'sort']}>
                                                                <InputNumber min={1} placeholder='请输入排序' />
                                                            </Form.Item>

                                                            <MinusCircleOutlined onClick={() => remove(field.name)} />



                                                            {/* 
                                                            <Form.Item name={[field.name, 'relevance']}>
                                                                <div>
                                                                    {
                                                                        // 推荐视频
                                                                        form[index] && form[index].type === 10 &&
                                                                        <Select style={widthStyle} placeholder='请选择推荐频道'>
                                                                            {searchProgram.map((item, index) => {
                                                                                return <Option key={index} value={item.programId}>{item.programName}</Option>
                                                                            })}
                                                                        </Select>
                                                                    }
                                                                    {
                                                                        // 推荐节目 推荐频道
                                                                        form[index] && form[index].type === 20 &&
                                                                        <Select style={widthStyle} placeholder='请选择推荐视频'>
                                                                            {searchChannel.map((item, index) => {
                                                                                return <Option key={index} value={item.channelId}>{item.channelName}</Option>
                                                                            })}
                                                                        </Select>
                                                                    }
                                                                </div>
                                                            </Form.Item> */}
                                                        </Space>
                                                    </div>
                                                ))
                                            }

                                            <Form.Item>
                                                <Button type="dashed" onClick={() => add({ cover: '', sort: 1 })} block icon={<PlusOutlined />}>
                                                    新建推荐关联
                                                </Button>
                                            </Form.Item>
                                        </Form.Item>
                                    }

                                    }

                                </Form.List>

                            </div>
                        }
                    </Form>

                    <MyTagTypes is_old_tag_resouce={false} tag_name='tagCode' onRef={(ref) => that.onTagTypesRefCallback(ref)} />

                </Modal>

            </div>
        )
    }

    initData() {
        let that = this;
        let { dictType, contentBox, searchProgram, searchChannel } = that.state;

        let title = [
            {
                title: '类型', dataIndex: 'type', key: 'type', width: 150,
                render: (rowValue, row, index) => {
                    return (
                        <Select value={rowValue} style={{ 'width': 120 }} placeholder='请选择类型' onChange={(e) => { that.onItemStatusChange(index, 'type', e) }}>
                            {dictType.map((item, index) => {
                                return <Option key={index} value={item.key}>{item.value}</Option>
                            })}
                        </Select>
                    )
                }
            },
            {
                title: '关联', dataIndex: 'relevance', key: 'relevance', width: 300,
                render: (rowValue, row, index) => {
                    let widthStyle = { 'width': 270 };
                    return (
                        <div>
                            {
                                // 推荐视频
                                row.type === 10 &&
                                <Select value={row.programId} style={widthStyle} placeholder='请选择推荐频道' onChange={(e) => { that.onItemStatusChange(index, 'programId', e) }}>
                                    {searchProgram.map((item, index) => {
                                        return <Option key={index} value={item.programId}>{item.programName}</Option>
                                    })}
                                </Select>
                            }
                            {
                                // 推荐节目 推荐频道
                                row.type === 20 &&
                                <Select value={row.channelId} style={widthStyle} placeholder='请选择推荐视频' onChange={(e) => { that.onItemStatusChange(index, 'channelId', e) }}>
                                    {searchChannel.map((item, index) => {
                                        return <Option key={index} value={item.code}>{item.name}</Option>
                                    })}
                                </Select>
                            }
                        </div>

                    )
                }
            },
            {
                title: '自定义封面图', dataIndex: 'cover', key: 'cover', width: 200,
                render: (rowValue, row, index) => {
                    return (
                        <div key={row} >
                            {JSON.stringify(row.cover)}

                            <Image width={200} src='http://test.cdn.mydianshijia.com/static/ad/3b020cdfbadda3e1e97a0b4beadfbb5b.png' />

                            <MyImageUpload
                                getUploadFileUrl={(file, newItem) => { that.getUploadFileUrl(row, 'cover', file, newItem) }}
                                imageUrl={that.getUploadFileImageUrlByType(row, 'cover', index)} />
                        </div>

                    )
                }

            },
            {
                title: '自定义标题', dataIndex: 'title', key: 'title',
                render: (rowValue, row, index) => {
                    return (
                        <Input defaultValue={rowValue} onBlur={(e) => { that.onInputBlur(index, 'title', e) }} />
                    )
                }
            },
            {
                title: '排序', dataIndex: 'sort', key: 'sort', width: 120,
                render: (rowValue, row, index) => {
                    return (
                        <InputNumber defaultValue={rowValue} min={1} onBlur={(e) => { that.onInputBlur(index, 'sort', e) }} />
                    )
                }
            },
            {
                title: '操作', dataIndex: 'action', key: 'action', fixed: 'right', width: 80,
                render: (rowValue, row, index) => {
                    return (
                        <div>
                            <Button size='small' type="primary" type="link" onClick={() => this.onTableItemDeleteClick(row, index)}>删除</Button>
                        </div>
                    )
                }
            },
        ]
        contentBox.title = title;
        that.setState({
            contentBox: contentBox,
        })
    }

    /**
     * 刷新频道列表
     * 
     * @param {*} currSearchKey     当前搜索的关键字
     */
    onChannelSearch(currSearchKey) {
        if (!currSearchKey) return;
        let obj = {
            keywords: currSearchKey,
        };
        getChannel(obj).then(res => {
            let errCode = res.data.errCode;
            if (errCode === 0 && res.data.data) {
                this.setState({
                    searchChannel: res.data.data,
                })
            }
        })



    }


    //外部请求更新页面数据
    refreshFromData(data, searchChannel, searchProgram) {
        let that = this;
        let { modalBox, contentBox, refTagTypes, } = that.state;
        modalBox.isShow = true;

        let obj = {};
        let content = [];
        //存在数据 当前是编辑
        if (data) {
            obj = Object.assign({}, data);
            content = data.content;

            let open = data.startAt && data.startAt > 0 ? moment(data.startAt) : "";
            let stop = data.endAt && data.endAt > 0 ? moment(data.endAt) : "";

            //有效时间
            obj.time = [open, stop]

            that.formRef.current.setFieldsValue(obj);

            console.log('编辑配置obj', obj)
            console.log('编辑配置content', content)
        }

        that.formRef.current.setFieldsValue(obj);
        contentBox.data = content;

        refTagTypes.pushData(obj);      //更新用户标签组件

        that.setState({
            modalBox: modalBox,
            contentBox: contentBox,
            searchChannel: searchChannel,
            searchProgram: searchProgram,
        })
    }

    //确认被点击
    onConfirmClick() {
        let that = this;
        let { refTagTypes, contentBox, searchProgram } = that.state;
        let formRef = that.formRef;
        let value = formRef.current.getFieldsValue();

        //获取到数据
       
        let obj = Object.assign({}, value, refTagTypes.loadData());
        console.log(obj)
        if (!obj.title) {
            message.error("请选择推荐标题");
            return;
        }
        if (!obj.channelId) {
            message.error("请选择推荐频道");
            return;
        }

        // if (!obj.tagCode) {
        //     message.error("请选择用户标签");
        //     return;
        // }
        // if (obj.tagCode.constructor === Array) {
        //     obj.tagCode = obj.tagCode.join(',');
        // }
        obj.tagCode = Array.isArray(obj.tagCode)?obj.tagCode.join(","):obj.tagCode

        // if (!obj.time) {
        //     message.error("请选择时间范围")
        //     return;
        // } else {
        try {
            obj.startAt = obj.time[0].valueOf();
            obj.endAt = obj.time[1].valueOf();
            delete obj.time;
        } catch (error) {
        }
        // }

        let contentData = obj.content || [];
        if (contentData.length <= 0) {
            message.error("请新建推荐关联");
            return;
        }




        for (let i = 0, ilen = contentData.length; i < ilen; i++) {
            let item = contentData[i];
            if (!item.type) {
                message.error(`请修改第${i + 1}条推荐关联数据的[类型]`);
                return;
            }
            if (item.type === 10 && !item.programId) {
                message.error(`请修改第${i + 1}条推荐关联数据的[推荐视频]`);
                return;
            }
            if (item.type === 20 && !item.channelId) {
                message.error(`请修改第${i + 1}条推荐关联数据的[推荐频道]`);
                return;
            }
            // if (!item.cover) {
            //     message.error(`请修改第${i + 1}条推荐关联数据的[封面图]`);
            //     return;
            // }
            // if (!item.title) {
            //     message.error(`请修改第${i + 1}条推荐关联数据的[标题]`);
            //     return;
            // }
            //重排序
            if (!item.sort) item.sort = 1
        }


        //筛选出[推荐视频]类型 对programId筛选出对应的channelId
        for (let i = 0, ilen = contentData.length; i < ilen; i++) {
            let item = contentData[i];
            if (item.type == 10) {
                let selectProgramId = item.programId;
                searchProgram.map((currItem) => {
                    if (currItem.programId === selectProgramId) {
                        item.channelId = currItem.channelId;
                    }
                })
            }
        }
        console.log('获取到content:', contentData);
        //整合关联关系
        obj.content = JSON.stringify(contentData);

        obj.sortOrder = Number(obj.sortOrder)
        for (let key in obj) {
            let item = obj[key]
            if (!item) delete obj[key];
        }


        //返回数据
        if (that.props.onResult) {
            console.log('即将返回----------->', obj)
            that.props.onResult(obj)
        }
    }

    //取消被点击 关闭按钮被点击 弹出框被关闭
    onCloseClick() {
        let that = this;
        let { modalBox } = that.state;
        modalBox.isShow = false;
        that.formRef.current.resetFields()

        that.setState({
            modalBox: modalBox,
        })
    }


    //删除按钮被点击
    onTableItemDeleteClick(item, index) {
        let that = this;
        let { contentBox } = that.state;

        contentBox.data.splice(index, 1);
        // contentBox.data = contentBox.data;

        that.setState({
            contentBox: contentBox,
        })
    }

    //状态改变
    onItemStatusChange(index, targetKey, e) {
        let that = this;
        let { contentBox } = that.state;
        contentBox.data[index][targetKey] = e;

        that.setState({
            contentBox: contentBox,
        })
    }

    //输入改变
    onInputBlur(index, targetKey, e) {
        let that = this;
        let { contentBox } = that.state;
        let value = e.target.value;
        contentBox.data[index][targetKey] = value;

        that.setState({
            contentBox: contentBox,
        })
    }

    //创建新的关联数据
    onCreteNewContentClick() {
        let that = this;
        let { contentBox } = that.state;

        if (!contentBox.data) {
            contentBox.data = [];
        }

        let obj = {
            type: '',
            channelId: '',
            // tvCVId: '',      //不传 后台固定为0
            programId: '',
            cover: '',
            title: '',
            sort: 1,
        }

        contentBox.data.push(obj);

        that.setState({
            contentBox: contentBox,
        })
    }

    onTagTypesRefCallback(ref) {

        console.log('---------->?onTagTypesRefCallbackonTagTypesRefCallback')

        let that = this;
        that.setState({
            refTagTypes: ref,
        })
    }

    //获取上传文件
    getUploadFileUrl(row, type, file, newItem) {
        let that = this;
        let image_url = newItem.fileUrl;
        row[type] = image_url;

        that.forceUpdate();
    }
    //获取上传文件图片地址 
    getUploadFileImageUrlByType(row, type, index) {
        let that = this;

        let imageUrl = row[type];
        return imageUrl ? imageUrl : '';
    }

}