import React, { Component } from 'react'

import { baseUrl, searchVideo, getMyProduct, updateChannelTopic, addChannelTopic, Getchannels, requestAdTagList, listProgramByChannelId, ChannelTopic } from 'api'
import { Breadcrumb, Card, DatePicker, Button, Tooltip, Modal, message, Input, Form, Select, InputNumber, Upload } from 'antd'
import { } from 'react-router-dom'
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"
import ImageUpload from "../../../components/ImageUpload/index" //图片组件
import Address from "../../../components/address/index" //地域组件
import { Link } from 'react-router-dom'
import util from 'utils'
import "./style.css"
import '@/style/base.css';
import moment from 'moment';
let { Option } = Select;
let { RangePicker } = DatePicker;


const normFile = (e) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
};

export default class SportsProgram extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            //专题状态
            dict_status: [
                { key: 1, value: '有效' },
                { key: 2, value: '无效' },
            ],

            page: 1,
            pageSize: 10,
            total: 0,
            data: [],
            loading: false,
            isAdd: false,
            searchWords: "",
            lists: [
            ],
            currentItem: "",//编辑行的id
            newData: {},
            layout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            tailLayout: {
                wrapperCol: { offset: 4, span: 20 },
            },
            headerImage: "",
            dataSource: [],
            defaultAddress: [],
            visible: false,
            parentId: "",
            channelId: "",
            channelNameId: "",
            tagList: [],
            tagOptions: [],
            channelOptions: [],
            setprogromList: [],
            productList: [],
            videoLists: [],
            channelList: [],
            channelName: "",
            currentObj: "",
            backImage: "",
            updateProps: {
                name: "file",
                listType: "picture-card",
                className: "avatar-uploader",
                showUploadList: false,
                action: `${baseUrl}/mms/file/upload?dir=ad`,
                headers: {
                    authorization: JSON.parse(localStorage.getItem("user")).authorization,
                },
            },
        }
    }
    componentDidMount() {
        // console.log(this.props.match)
        if (this.props.match.params && this.props.match.params.id == "add") {
            this.setState({
                parentId: "",
                isAdd: true
            })
        } else if (this.props.match.params && this.props.match.params.id != "add") {
            this.ChannelTopic();
            this.setState({
                parentId: this.props.match.params.id,
                isAdd: false
            }, () => {
                this.getDetail()
            })
        }
        this.getInfo()
    }
    onCheckAddress(val) {
        let postAddress = val.filter(item => item !== "all")
        let arr = []
        postAddress.forEach(r => {
            if (r.indexOf("-") !== -1) {
                arr.push(r.replace("-", ""))
            } else {
                arr.push(r)
            }
        })
        this.setState({
            defaultAddress: arr
        })
    }
    getInfo() {
        requestAdTagList().then(res => {
            let _list = res.data.map(item => {  //  this.tagOptions 
                return { label: item.name, value: item.code }
            })
            this.setState({
                tagList: res.data,
                tagOptions: _list
            })
        })
        Getchannels().then((res) => {
            if (res.data.errCode == 0 && res.data.data != null) {
                //this.channelList = res.data.data
                let _list = res.data.data.map(item => {
                    return { label: item.name, value: item.channelId }
                })
                this.setState({
                    channelList: res.data.data,
                    channelOptions: _list
                }, () => {
                })
            }
        });
        getMyProduct().then(res => {
            let params = {
                page: { isPage: 9 },
                prodType: 1
            }
            getMyProduct(params).then(res => {
                this.setState({
                    productList: res.data.data
                })
            })
        })
        searchVideo({ word: '' }).then((res) => {
            if (res.data.errCode === 0) {
                this.setState({
                    videoLists: res.data.data
                })
            }
        });
    }
    getDetail(id) {
        let params = {
            channelId: id
        }
        listProgramByChannelId(params).then(res => {
            if (res.data.errCode == 0) {
                let _arr = [];
                let _list = Object.entries(res.data.data);
                //console.log(_list)
                for (const [key, value] of _list) {
                    _arr.push({ label: util.formatDateTwo(value.start_time, "M-D H:I", false) + " " + value.name, value: key })
                }

                this.setState({
                    setprogromList: _arr
                })
            }
        })
    }
    ChannelTopic() {
        let params = {
            // name:keyWord || ""
        }
        ChannelTopic(params).then(res => {
            if (res.data.errCode === 0) {
                this.setState({
                    lists: res.data.data.dataList
                })
                for (let i = 0; i < res.data.data.dataList.length; i++) {
                    if (res.data.data.dataList[i].ID == this.state.parentId) {
                        let _obj = res.data.data.dataList[i];
                        if (_obj.tags != '') {
                            _obj.tags = _obj.tags.split(",")
                        } else {
                            _obj.tags = []
                        }

                        //时间配置
                        if (_obj.startTime === 0 && _obj.endTime === 0) {
                            _obj.time = []
                        } else {
                            _obj.time = [moment(new Date(_obj.startTime)), moment(new Date(_obj.endTime)),]
                        }


                        this.formRef.current.setFieldsValue(_obj)
                        this.getDetail(res.data.data.dataList[i].channelId)
                        this.setState({
                            currentObj: res.data.data.dataList[i],
                            currentItem: res.data.data.dataList[i],
                            defaultAddress: (res.data.data.dataList[i].area && res.data.data.dataList[i].area.includes(",")) ? res.data.data.dataList[i].area.split(",") : res.data.data.dataList[i].area,
                            backImage: res.data.data.dataList[i].backImage,
                            headerImage: res.data.data.dataList[i].headerImage
                        }, () => {
                            console.log(this.state.defaultAddress)
                        })
                    }
                }
            }
        })
    }
    getUploadFileUrl(fill) {
        let _img = this.formRef.current.getFieldValue("backImage")
        //arr[index].avtor = file
        this.formRef.current.setFieldsValue({ "backImage": fill });
        this.setState({
            backImage: fill
        })
    }
    getUploadFileUrlHeader(fill) {
        let _img = this.formRef.current.getFieldValue("headerImage")
        //arr[index].avtor = file
        this.formRef.current.setFieldsValue({ "headerImage": fill });
        this.setState({
            headerImage: fill
        })
    }
    deleteHeaderImage() {  // 删除tab文字图片
        this.setState({
            headerImage: ""
        })
    }
    submitForm(obj) {
        if (obj.whiteList == undefined) {
            obj.whiteList = ""
        }
        let _tages = obj.tags;
        if (_tages == "") {
            _tages = ""
        } else if (_tages != "" && _tages != undefined) {
            if (_tages[0] == ",") {
                _tages = _tages.slice(1, _tages.length);
            }
            if (JSON.stringify(_tages).includes("[")) {
                _tages = _tages.join(",")
            }
        } else if (_tages == undefined) {
            _tages = ""
        }
        // if(whiteList==undefined){
        //     whiteList=""
        // }
        let params = {
            ...this.state.currentItem,
            ...obj,
            area: this.state.defaultAddress ? this.state.defaultAddress.join(",") : "",
            tags: _tages,
            //whiteList:obj.whiteList!=""?obj.whiteList.join(","):"",
            backImage: this.state.backImage,
            headerImage: this.state.headerImage,
            //channelName:this.state.channelName,
            ID: this.state.parentId * 1 || 0
        }
        //更新时间
        let time = params.time;
        if (time && time.length == 2) {
            params.startTime = time[0].valueOf();
            params.endTime = time[1].valueOf();
        } else {
            delete params.startTime;
            delete params.endTime;
        }
        delete params.time;

        if (this.state.isAdd == true) {  // 新增
            addChannelTopic(params).then(res => {
                if (res.data.errCode == 0) {
                    message.success("添加成功")
                    setTimeout(() => {
                        this.props.history.go(-1)
                    }, 1000)
                } else {
                    message.error(res.data.msg)
                }
            })
        } else {
            updateChannelTopic(params).then(res => {
                if (res.data.errCode == 0) {
                    message.success("修改成功")
                    setTimeout(() => {
                        this.props.history.go(-1)
                    }, 1000)
                } else {
                    message.error(res.data.msg)
                }
            })
        }

    }
    render() {
        let { loading, dict_status } = this.state;
        let uploadButton = (
            <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <div>
                <Card title={
                    <div>
                        <Breadcrumb>
                            <Breadcrumb.Item>
                                <Link to="/mms/channelManage/channelSubject">频道专题</Link>
                            </Breadcrumb.Item>
                            {
                                this.state.isAdd == true &&
                                <Breadcrumb.Item>新增专题</Breadcrumb.Item> ||
                                <Breadcrumb.Item>修改专题</Breadcrumb.Item>
                            }

                        </Breadcrumb>

                    </div>
                }>

                    <Form name="subjectForm" ref={this.formRef}  {...this.state.layout} onFinish={this.submitForm.bind(this)}>
                        <Form.Item label="专题名称" name="title" rules={[{ required: true, message: '请填写标题' }]}>
                            <Input className="base-input-wrapper" laceholder="请填写标题" />
                        </Form.Item>
                        <Form.Item label="tab文字图片" name="headerImage" valuePropName="fileList"
                            // 如果没有下面这一句会报错
                            getValueFromEvent={normFile}
                        >
                            <div className='upload-delete'>
                                <ImageUpload getUploadFileUrl={this.getUploadFileUrlHeader.bind(this)}
                                    imageUrl={this.state.headerImage}
                                />
                                {/* <Button type="primary" style={{margin:"0 20px"}}>删除</Button> */}
                                {
                                    this.state.headerImage != '' &&
                                    <div className='button-form-div'>
                                        <Button type="primary" onClick={this.deleteHeaderImage.bind(this)}>删除</Button>
                                    </div>
                                }

                            </div>
                        </Form.Item>

                        <Form.Item label="排序" name="column" rules={[{ required: true, message: '请填写排序' }]}>
                            <InputNumber min={1} className="base-input-wrapper" />
                        </Form.Item>


                        <Form.Item label="专题状态" name="status" rules={[{ required: true, message: '请填写专题状态' }]}>
                            <Select className="base-input-wrapper" showSearch placeholder='请选择状态'>
                                {dict_status.map((item, index) => {
                                    return <Option key={index} value={item.key}>{item.value}</Option>
                                })}
                            </Select>
                        </Form.Item>

                        <Tooltip title='如果不选择时间，表示该专题为永久展示' placement="top" color={'blue'}>
                            <Form.Item label="有效时间" name="time" >
                                <RangePicker className="base-input-wrapper" showTime allowClear />
                            </Form.Item>
                        </Tooltip>


                        <Form.Item label="关联h5地址" name="h5Url" rules={[{ required: true, message: '请填写地址' }]}>
                            <Input className="base-input-wrapper" placeholder="请填写H5地址" />
                        </Form.Item>
                        <Form.Item label="背景色" name="bgColor" rules={[{ required: true, message: '请填写背景色' }]}>
                            <Input className="base-input-wrapper" placeholder="请填写背景色" />
                        </Form.Item>
                        <Form.Item label="专题编码(拼音)" name="IdKey" rules={[{ required: true, message: '请填写专题编码' }]}>
                            {
                                this.state.isAdd == true &&
                                <Input className="base-input-wrapper" placeholder="请填写专题编码" /> ||
                                <Input className="base-input-wrapper" placeholder="请填写专题编码" disabled />
                            }
                        </Form.Item>

                        <Form.Item label="背景图" name="backImage" valuePropName="fileList"
                            // 如果没有下面这一句会报错
                            getValueFromEvent={normFile}
                        >
                            <ImageUpload getUploadFileUrl={this.getUploadFileUrl.bind(this)}
                                imageUrl={this.state.backImage}
                            // this.formRef.current ? this.formRef.current.getFieldValue("backImage") : ""
                            />
                        </Form.Item>
                        <Form.Item label="预告片" name="svIds" rules={[{ required: true, message: '请填写预告片ID' }]}>
                            {/* <Select placeholder="请选择视频">
                                {this.state.videoLists.map((item, index) => {
                                    return <Option value={item.value} key={index}> {item.value}</Option>
                                })}
                            </Select> */}
                            <Input className="base-input-wrapper" placeholder="请填写预告片ID" />
                        </Form.Item>

                        <Form.Item label="预告片标题" name="svName" rules={[{ required: true, message: '请填写预告片标题' }]}>
                            <Input className="base-input-wrapper" placeholder="请填写预告片标题" />
                        </Form.Item>


                        <Form.Item label="用户分群" name="tags" >
                            <Select className="base-input-wrapper" placeholder="请选择用户分群" mode="multiple" allowClear>
                                {
                                    this.state.tagList.map(r => {
                                        return (
                                            <Option value={r.code.toString()} key={r.code}>{r.name}</Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>

                        {/* <Form.Item label="频道" name="channelId" >
                            <Select placeholder="请选择频道" allowClear onChange={(val,name)=>{
                                console.log('---------',name.children)
                                this.setState({
                                    channelName:name.children
                                })
                                this.getDetail(val)
                            }}>
                                {
                                    this.state.channelList.map(r => {
                                        return (
                                        <Option value={r.channelId} key={r.name}>{r.name}</Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item label="节目" name="esIndexId" >
                            <Select placeholder="请选择节目" allowClear>
                                {
                                    this.state.setprogromList.map(r => {
                                        return (
                                            <Option value={r.value} key={r.value}>{r.label}</Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item> */}

                        <Form.Item label="地域" name="area">
                            <Address defaultAddress={this.state.defaultAddress} onCheckAddress={this.onCheckAddress.bind(this)} />
                        </Form.Item>

                        <Form.Item label="白名单" name="whiteList">
                            <Input className="base-input-wrapper" placeholder="请填写白名单" />
                            {/* <Select placeholder="请选择白名单" mode="multiple" allowClear>
                            {
                                this.state.productList.map(r => {
                                    return (
                                        <Option value={r.appid} key={r.appid}>{r.name}</Option>
                                    )
                                })
                            }
                            </Select> */}
                        </Form.Item>

                        <Form.Item {...this.state.tailLayout}>
                            <Button htmlType="submit" type="primary" style={{ margin: "0 20px" }}>
                                确定
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        )
    }
}