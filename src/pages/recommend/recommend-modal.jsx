// 广告管理尝鲜版弹出框内容
import React, { Component } from 'react'
import { baseUrl, } from 'api'
import './style.css'
import moment from 'moment';
import Address from "../../components/address/index" //地域组件
import Market from "../../components/market/index" //渠道组件

import { Input, DatePicker, Button, Tooltip, Switch, Modal, Form, Select, Alert, Radio, Divider, Upload, Image, message } from 'antd';
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;




export default class recommendModal extends Component {

    constructor(props) {
        super(props);

        this.formRef = React.createRef();
        this.state = {
            is_create: true,                            //是否新增数据 
            is_loading: false,
            _id: -1,
            ad_image_url: '',                           //广告图片链接
            dateFormat: 'YYYY-MM-DD HH:mm:ss',          //日期格式化
            startTime: '',
            endTime: '',
            address: '',        //地域
            market: '',         //渠道
        }
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    //外部请求更新页面数据
    refreshFromData(data) {
        let that = this;
        if (!this.formRef || !this.formRef.current) {
            let interval = setInterval(() => {
                if (!this.formRef || !this.formRef.current) {
                } else {
                    that.renderPageWhenPageChange(data);
                    clearInterval(interval);
                }
            }, 200)
        } else {
            that.renderPageWhenPageChange(data);
        }
    }
    //等待页面加载完成 对数据进行渲染处理 
    renderPageWhenPageChange(data) {
        let that = this;
        that.formRef.current.resetFields();
        //编辑信息
        if (data) {
            let status = data.status;
            //状态：1、有效,2、无效
            if (status == 1) status = true;
            else status = false;
            data.status = status;


            data.time = [
                moment(data.startTime), moment(data.endTime)
            ]
            //设备标签
            if (data.tags && data.tags.length > 0) {
                if (data.tags.constructor === String) { data.tags = data.tags.split(','); }
            }
            else data.tags = [];

            //频道列表
            if (data.jumpChannelCode && data.jumpChannelCode.length > 0) {
                if (data.jumpChannelCode.constructor === String) {
                    data.jumpChannelCode = data.jumpChannelCode.split(',');
                }
            }
            else data.jumpChannelCode = [];


            console.log('编辑')
            console.log(data);
            let address = [];
            if (data.area) address = data.area.split(',');      //地域列表
            let market = data.market;                           //渠道列表

            that.setState({
                _id: data.id,
                ad_image_url: data.picUrl,
                startTime: data.startTime,
                endTime: data.endTime,
                address: address,
                market: market,
            })

            that.formRef.current.setFieldsValue(data)
        }
        //创建
        else {
            that.setState({
                _id: -1,
                ad_image_url: '',
                startTime: '',
                endTime: '',
                address: [],
                market: [],
            })
        }
    }



    render() {
        let { is_loading, ad_image_url, dateFormat } = this.state;
        let { visible, qrcode_types, jump_types, jump_menu_types, good_look_types, user_tag, delivery_types, channel_list } = this.props;

        return (
            <div>
                <Modal className="modal-box" visible={visible} title="广告信息" width={800} transitionName="" onCancel={() => { this.props.onCancel() }} forceRender={true}
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
                        <Form.Item label="notice1" >
                            <div>当id为空时，当前为[创建模式],反之存在id时，为[更新模式]</div>
                        </Form.Item>
                        <Form.Item label="id" name='id' >
                            <Input className="input-wrapper-from" disabled />
                        </Form.Item>
                        <Form.Item label="广告名称" name='name' rules={[{ required: true, message: '请输入广告名称' }]}>
                            <Input className="input-wrapper-from" placeholder="请输入广告名称" />
                        </Form.Item>

                        <Form.Item label="开始结束时间" name='time' rules={[{ required: true, message: '请选择开始结束时间' }]}  >
                            <RangePicker showTime format={dateFormat} />
                        </Form.Item>

                        <Form.Item label="状态" name="status" rules={[{ required: true, message: '请选择状态' }]} valuePropName='checked'>
                            <Switch checkedChildren="有效" unCheckedChildren="无效" />
                        </Form.Item>

                        <Divider orientation="left">二维码配置</Divider>

                        <Form.Item label="二维码类型" name="type"   >
                            <Select className="input-wrapper-from">
                                {qrcode_types.map((item, index) => {
                                    return <Option value={item.key} key={index}>{item.key} - {item.value}</Option>
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item label="二维码尺寸">
                            <Form.Item name="qrWidth"  >
                                <Input className="input-wrapper-from" addonBefore="宽" placeholder="例如:200" addonAfter="px" />
                            </Form.Item>
                            <Form.Item name="qrHight" >
                                <Input className="input-wrapper-from" addonBefore="高" placeholder="例如:200" addonAfter="px" />
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label="二维码偏移">
                            <Form.Item name="qrX"  >
                                <Input className="input-wrapper-from" addonBefore="横" placeholder="例如:200" addonAfter="px" />
                            </Form.Item>
                            <Form.Item name="qrY" >
                                <Input className="input-wrapper-from" addonBefore="纵" placeholder="例如:200" addonAfter="px" />
                            </Form.Item>
                        </Form.Item>
                        {/* <Form.Item name="qrCodeUrl" label="二维码地址" >
                            <Input className="input-wrapper-from" />
                        </Form.Item> */}
                        <Form.Item label="二维码颜色" name="qrColor">
                            <Input className="input-wrapper-from" />
                        </Form.Item>
                        <Form.Item label="二维码背景颜色" name="qrBackGroundColor" >
                            <Input className="input-wrapper-from" />
                        </Form.Item>



                        <Divider orientation="left">广告配置</Divider>
                        <Form.Item label="图片" name="picUrl">
                            <div className="uplpad-image-box">
                                <Upload {...this.buildAdImageUpload()}>上传图片</Upload>
                                {ad_image_url ? <Image height={100} src={ad_image_url} /> : ''}
                            </div>
                            <div>{ad_image_url}</div>
                        </Form.Item>

                        <Form.Item label="跳转类型">
                            <Form.Item label="" name="jumpType" style={{ width: 200, display: "inline-block" }}>
                                <Select className="input-wrapper-from" placeholder='请选择跳转类型' onChange={(val) => {
                                    this.setState({
                                        jump_types: this.state.jump_types
                                    })
                                    this.formRef.current.setFieldsValue({ "jumpType": val })
                                }}>
                                    {jump_types.map((item, index) => {
                                        return <Option value={item.key} key={index}>{item.key} - {item.value}</Option>
                                    })}
                                </Select>
                            </Form.Item>
                            {
                                this.formRef.current && this.formRef.current.getFieldValue("jumpType") === 1 ?
                                    <Form.Item label="频道" name="jumpChannelCode" style={{ marginLeft: 10, width: 230, display: "inline-flex" }}>
                                        <Select className="input-wrapper-from" mode="multiple" placeholder='请选择频道类型' >
                                            {channel_list.map(r => {
                                                return <Option value={r.code} key={r.id}>
                                                    <div>{r.code}-{r.name}</div>
                                                </Option>
                                            })}
                                        </Select>
                                    </Form.Item>
                                    : this.formRef.current && this.formRef.current.getFieldValue("jumpType") === 4 ?
                                        <Form.Item label="跳转菜单" name="jumpMenuType" style={{ marginLeft: 10, width: 230, display: "inline-flex" }}>
                                            <Select className="input-wrapper-from" placeholder='请选择跳转菜单'>
                                                {jump_menu_types.map((item, index) => {
                                                    return <Option value={item.key} key={index}>{item.key} - {item.value}</Option>
                                                })}
                                            </Select>
                                        </Form.Item>

                                        : this.formRef.current && this.formRef.current.getFieldValue("jumpType") === 8 ?
                                            <Form.Item label="好看分类" name="goodLookType" style={{ marginLeft: 10, width: 230, display: "inline-flex" }}>
                                                <Select className="input-wrapper-from" placeholder='请选择好看分类' >
                                                    {good_look_types.map((item, index) => {
                                                        return <Option value={item.key} key={index}>{item.key} - {item.value}</Option>
                                                    })}
                                                </Select>
                                            </Form.Item>
                                            : ''
                            }
                        </Form.Item>

                        <Form.Item label='用户设备标签' name='tags'>
                            <Select className="input-wrapper-from" mode="multiple">
                                {user_tag.map(r => {
                                    return <Option value={r.code} key={r.id}>
                                        <div>{r.code}-{r.name}</div>

                                    </Option>
                                })}
                            </Select>
                        </Form.Item>


                        <Form.Item label="标签投放类型" name="deliveryType" rules={[{ required: true, message: '请选择标签投放类型' }]}                 >
                            <Radio.Group>
                                {delivery_types.map((item, index) => {
                                    return <Radio value={item.key} key={index}> {item.value}</Radio>
                                })}
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item label="比例" name='ratio'>
                            <Input className="input-wrapper-from"></Input>
                        </Form.Item>
                        <Form.Item label="展示时长" name="duration" rules={[{ required: true, message: '请输入展示时长' }]}>
                            <Input className="input-wrapper-from" placeholder="例如:10" addonAfter="秒" />
                        </Form.Item>

                        <Form.Item label="地域" name="area">
                            <Address defaultAddress={this.state.address}
                                onCheckAddress={this.onCheckAddress.bind(this)}
                            />
                        </Form.Item>

                        <Form.Item label="渠道" name="market"   >
                            <Market getMarketReturn={this.getMarketReturn.bind(this)}
                                checkData={this.state.market}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div >
        )
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
            address: arr
        })
    }
    getMarketReturn(val) {
        this.state.market = val
        this.setState({
            market: this.state.market
        })
        this.formRef.current.setFieldsValue({ "market": val })
    }

    //图片上传地址
    buildAdImageUpload() {
        let that = this;
        return {
            name: "file",
            listType: "picture-card",
            className: "avatar-uploader",
            showUploadList: false,
            action: `${baseUrl}/mms/file/upload?dir=ad`,
            headers: {
                authorization: JSON.parse(localStorage.getItem("user")).authorization,
            },
            //上传文件改变时的状态
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    that.setState({ is_loading: true });
                }
                if (info.file.status === 'done') {
                    console.log(info.file)
                    message.success(`上传成功`);
                    let fileObj = info.file.originFileObj;
                    that.getBase64(fileObj, imageUrl => {
                        that.setState({ is_loading: false });
                    })

                    console.log(info.file.response.data.fileUrl)

                    //更新链接
                    that.state.ad_image_url = info.file.response.data.fileUrl;
                    // let formData = that.state.formData;
                    // that.formRef.current.setFieldsValue(formData)
                }
                else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 上传失败.`);
                }
            },
            //上传文件之前的钩子，参数为上传的文件
            beforeUpload(file) {
                let isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isJpgOrPng) {
                    message.error('You can only upload JPG/PNG file!');
                }
                let isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    message.error('Image must smaller than 2MB!');
                }
                return isJpgOrPng && isLt2M;
            }
        }
    }

    getBase64(img, callback) {
        let reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    //上传图片按钮被点击
    onUploadImageClick() {

    }

    //二维码切换监听
    onQrcodeTypeChange() {

    }

    //确认按钮被点击
    onOkClick() {
        let object = this.formRef.current.getFieldsValue()
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
        let duration = object.duration;
        if (!duration) {
            message.error('请输入展示时长')
            return
        } else {
            if (!this.checkNumber(duration)) {
                message.error('请填入时长');
                return;
            }
            object.duration = parseInt(duration);
        }

        if (object.qrWidth) {
            if (!this.checkNumber(object.qrWidth)) {
                message.error('二维码宽度校验失败');
                return;
            }
            object.qrWidth = parseInt(object.qrWidth);
        }
        if (object.qrHight) {
            if (!this.checkNumber(object.qrHight)) {
                message.error('二维码高度校验失败');
                return;
            }
            object.qrHight = parseInt(object.qrHight);
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

        if (!object.deliveryType) {
            message.error('请选择标签投放类型');
            return;
        }

        //状态：1、有效,2、无效
        let status = object.status;
        if (status === true) status = 1;
        else if (!status) status = 2;
        object.status = status;

        //地域
        let area = that.state.address;
        if (!area) {
            object.area = '';
        }
        else if (area.constructor === Array) {
            object.area = area.join(',');
        }


        //渠道信息
        let market = object.market;
        if (!market) {
            object.market = '';
        }
        else if (market.constructor === Array) {
            object.market = market.join(',');
        }

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

        //选择的频道类型
        let jumpChannelCode = object.jumpChannelCode;
        if (!jumpChannelCode) {
            object.jumpChannelCode = '';
        }
        else if (jumpChannelCode.constructor === Array) {
            object.jumpChannelCode = jumpChannelCode.join(',');
        }



        let obj = {};
        for (let key in object) {
            let value = object[key];
            if (value) obj[key] = value;
        }
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
