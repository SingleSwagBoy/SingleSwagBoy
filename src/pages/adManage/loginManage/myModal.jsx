// 广告管理尝鲜版弹出框内容
import React, { Component } from 'react'
import { baseUrl, } from 'api'
import './style.css'
import moment from 'moment';
import ImageUpload from "../../../components/ImageUpload/index" //图片组件
// import Address from "../../components/address/index" //地域组件
// import Market from "../../components/market/index" //渠道组件

import { Input, DatePicker, Button, Tooltip, Switch, Modal, Form, Select, Radio, Divider, Upload, Image, message ,InputNumber} from 'antd';
const { Option } = Select;
const { RangePicker } = DatePicker;
const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
};



export default class myModal extends Component {

    constructor(props) {
        super(props);

        this.formRef = React.createRef();
        this.state = {
            is_create: true,                            //是否新增数据 
            is_loading: false,
            isAdd:false,
            _id: -1,
            ad_image_url: '',                           //广告图片链接
            dateFormat: 'YYYY-MM-DD HH:mm:ss',          //日期格式化
            startTime: '',
            endTime: '',
            backgroundImage:"",
            id:"",
            tags:"",
            tagList:[],
            //address: '',        //地域
            //market: '',         //渠道
        }
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    //外部请求更新页面数据
    refreshFromData(data) {
        console.log("refreshFromData  data",data)
        this.setState({
            isAdd:data==null?true:false
        },()=>{
            console.log("isAddisAddisAdd",this.state.isAdd)
        })

        let that = this;
        if (!that.formRef || !that.formRef.current) {
            let interval = setInterval(() => {
                if (!that.formRef || !that.formRef.current) {
                } else {
                    that.renderPageWhenPageChange(data);
                    clearInterval(interval);
                }
            }, 200)
        } else {
            that.renderPageWhenPageChange(data);
        }
    }
    getUploadFileUrl(fill){
        console.log(fill)
        this.formRef.current.setFieldsValue({ "backgroundImage": fill });
        this.setState({
            backgroundImage:fill
        })
    }
    //等待页面加载完成 对数据进行渲染处理 
    renderPageWhenPageChange(data) {
        let that = this;
        that.formRef.current.resetFields();
        //编辑信息
        if (data) {
            console.log('编辑前')
            console.log(data)
            let status = data.state;
            //状态：1、有效,0、无效
            if (status == 1) status = true;
            else status = false;
            data.status = status;

            data.time = [
                moment(data.startTime), moment(data.endTime)
            ]
            //设备标签
            if (data.tags && data.tags.length > 0) {
                if (data.tags.constructor === String) {
                    data.tags = data.tags.split(',');
                }

                data.tags = data.tags.map((item, index) => {
                    return parseInt(item);
                })
            }
            else data.tags = [];

            console.log(data);
            // let address = [];
            // if (data.area) address = data.area.split(',');      //地域列表

            that.setState({
                _id: data.id,
                id: data.id,
                tags:data.tags,
                ad_image_url: data.picUrl,
                startTime: data.startTime,
                endTime: data.endTime,
                backgroundImage:data.backgroundImage
                //address: address,
                //market: data.market, //渠道列表
            })

            that.formRef.current.setFieldsValue(data)
        }
        //创建
        else {
            that.setState({
                _id: -1,
                id: "",
                tags:"",
                ad_image_url: '',
                startTime: '',
                endTime: '',
                backgroundImage:""
                //address: [],
                //market: [],
            })
        }
    }



    render() {
        let { is_loading, ad_image_url, dateFormat ,isAdd} = this.state;
        let { visible, qrcode_types, jump_types, jump_menu_types, good_look_types, user_tag, delivery_types, channel_list, product_list } = this.props;

        return (
            <div>
                <Modal className="modal-box" visible={visible} title={isAdd?'新增':'编辑'} width={800} transitionName="" onCancel={() => { this.props.onCancel() }} forceRender={true}
                    footer={[
                        <Button onClick={() => {
                            this.formRef.current.resetFields()
                            this.props.onCancel()
                        }}>取消</Button>
                        ,
                        <Button type="primary" loading={is_loading} onClick={() => this.onOkClick()}>确定</Button>,
                    ]}>

                    <Form name='recom' labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} ref={this.formRef}>
                        <Divider></Divider>
                        <Form.Item label="名称" name="name" >
                            {/* rules={[{ required: true, message: '请填写名称' }]} */}
                            <Input placeholder="请填写名称" />
                        </Form.Item>
                        <Form.Item label="二维码尺寸">
                            <div className="input-wrapper-box">
                                <Form.Item name="qrWidth">
                                    <Input className="input-wrapper-from" addonBefore="宽" placeholder="例如:200" addonAfter="px" />
                                </Form.Item>
                                <Form.Item name="qrHeight" style={{ marginLeft: '5px' }}>
                                    <Input className="input-wrapper-from" addonBefore="高" placeholder="例如:200" addonAfter="px" />
                                </Form.Item>
                            </div>
                        </Form.Item>
                        <Form.Item label="二维码坐标">
                            <div className="input-wrapper-box">
                                <Form.Item name="qrX">
                                    <Input className="input-wrapper-from" addonBefore="横" placeholder="例如:200" addonAfter="px" />
                                </Form.Item>
                                <Form.Item name="qrY" style={{ marginLeft: '5px' }}>
                                    <Input className="input-wrapper-from" addonBefore="纵" placeholder="例如:200" addonAfter="px" />
                                </Form.Item>
                            </div>
                        </Form.Item>
                        <Form.Item label="二维码颜色">
                            <div className="input-wrapper-box">
                                <Form.Item name="qrColor">
                                    <Input addonBefore="主体" placeholder="例:#FFFFFF" className="input-wrapper-from" />
                                </Form.Item>
                                <Form.Item name="qrBackgroundColor" style={{ marginLeft: '5px' }}>
                                    <Input addonBefore="背景" placeholder="例:#FFFFFF" className="input-wrapper-from" />
                                </Form.Item>
                            </div>
                        </Form.Item>
                        <Form.Item label="背景图" name="backgroundImage" valuePropName="fileList" 
                            // 如果没有下面这一句会报错
                            getValueFromEvent={normFile} 
                        >
                             <div className="input-wrapper-box">
                                <ImageUpload getUploadFileUrl={this.getUploadFileUrl.bind(this)}
                                    imageUrl={this.state.backgroundImage}
                                    // this.formRef.current ? this.formRef.current.getFieldValue("backImage") : ""
                                />
                             </div>
                            
                        </Form.Item>
                        <Form.Item label='用户设备标签' name='tags'>
                            <Select className="input-wrapper-from" mode="multiple" optionFilterProp="name" placeholder='请选择用户设备标签(可多选)'>
                                {user_tag.map((item, index) => {
                                    return <Option value={item.id} key={item.id} name={item.name}>
                                        <div>{item.id}-{item.name}</div>
                                    </Option>
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item label="标签投放类型" name="deliveryType">
                            <Radio.Group>
                                {delivery_types.map((item, index) => {
                                    return <Radio value={item.key} key={index}> {item.value}</Radio>
                                })}
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="排序" name="sort"
                        //  rules={[{ required: true, message: '请选择排序' }]}
                         >
                            <InputNumber min={-1} />
                        </Form.Item>
                        <Form.Item label="上线时间-下线时间" name='time' 
                        // rules={[{ required: true, message: '请选择上线下线时间' }]}  
                        >
                            <RangePicker showTime format={dateFormat} />
                        </Form.Item>
                        <Form.Item label="状态" name="status"
                        //  rules={[{ required: true, message: '请选择状态' }]} 
                         valuePropName='checked'>
                            <Switch checkedChildren="有效" unCheckedChildren="无效" />
                        </Form.Item>


                        {/* {this.formRef && this.formRef.current && (
                            <div>

                                <Divider orientation="left">二维码配置</Divider>

                            </div>

                        )} */}

                    </Form>
                </Modal>
            </div >
        )
    }


    getBase64(img, callback) {
        let reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    //确认按钮被点击
    onOkClick() {
        let object = this.formRef.current.getFieldsValue();
        console.log(object)
        let that = this;
        if (!object.status) object.status = false;

        // for (let key in object) {
        //     let item = object[key];
        //     console.log(key + ' --- ' + item)
        // }
        let name = object.name;
        if (!name) {
            message.error('请填写广告名称')
            return
        }

        let time = object.time;
        if (!time) {
            message.error('请填写开始结束时间')
            return
        } else {
            try {
                object.startTime = time[0].valueOf();
                object.endTime = time[1].valueOf();
            } catch {
                message.error('时间错误')
                return;
            }
        }


        if (object.qrWidth) {
            if (!this.checkNumber(object.qrWidth)) {
                message.error('二维码宽度校验失败');
                return;
            }
            object.qrWidth = parseInt(object.qrWidth);
        }
        if (object.qrHeight) {
            if (!this.checkNumber(object.qrHeight)) {
                message.error('二维码高度校验失败');
                return;
            }
            object.qrHeight = parseInt(object.qrHeight);
        }
        if (object.qrX) {
            if (!this.checkNumber(object.qrX)) {
                message.error('二维码横向偏移校验失败');
                return;
            }
            object.qrX = parseInt(object.qrX);
        }

        if (object.qrY) {
            if (!this.checkNumber(object.qrY)) {
                message.error('二维码纵向偏移校验失败');
                return;
            }
            object.qrY = parseInt(object.qrY);
        }

        //状态：1、有效,2、无效
        let status = object.status;
        if (status === true) status = 1;
        else if (!status) status = 0;
        object.state = status;
        console.log(object)

        //用户标签
        let tags = object.tags;
        if (!tags) {
            object.tags = '';
        }
        else if (tags.constructor === Array) {
            object.tags = tags.join(',');
        }
        //用户图片
        let ad_image_url = that.state.ad_image_url;
        if (ad_image_url) object.picUrl = ad_image_url;

        let obj = Object.assign(object, {
            id:this.state.id,
            //tags:this.state.tags
        })
        // for (let key in object) {
        //     let value = object[key];
        //     if (value || value === 0) obj[key] = value;
        // }
        

        console.log('=======创建、编辑、保存object');
        console.log(obj);
        this.props.onOk(obj)
    }
    //校验数字
    checkNumber(number) {
        let regex = /^[0-9]*$/;
        return regex.test(number);
    }

}
