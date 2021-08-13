// 广告管理尝鲜版弹出框内容
import React, { Component } from 'react'
import { baseUrl, } from 'api'
import './style.css'
import moment from 'moment';

import { Input, DatePicker, Button, Tooltip, Switch, Modal, Form, Select, Alert, Divider, Upload, Image, message } from 'antd';
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
            switch_checked: false,
            startTime: '',
            endTime: '',
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
            data.status = true;
            console.log(data);
            data.time = [
                moment(data.startTime), moment(data.endTime)
            ]

            that.setState({
                _id: data.id,
                ad_image_url: data.picUrl,
                switch_checked: data.status,
                startTime: data.startTime,
                endTime: data.endTime,
            })

            that.formRef.current.setFieldsValue(data)
        }
        //创建
        else {
            that.setState({
                _id: -1,
                ad_image_url: '',
                switch_checked: false,
                startTime: '',
                endTime: '',
            })
        }
    }



    render() {
        let { is_loading, ad_image_url, dateFormat } = this.state;
        let { visible, qrcode_types, jump_types, jump_menu_types, good_look_types } = this.props;

        return (
            <div>
                <Modal className="modal-box" visible={visible} title="广告信息" width={800} transitionName="" closable={false}
                    footer={[
                        <Button onClick={() => {
                            this.formRef.current.resetFields()
                            this.props.onCancel()
                        }}>取消</Button>
                        ,
                        <Button type="primary" loading={is_loading} onClick={() => this.onOkClick()}>确定</Button>,
                    ]}>
                    <Button onClick={() => {
                        // let open_time = moment(this.state.startTime).format(dateFormat)

                        console.log(this.state.startTime)

                        console.log(moment(this.state.startTime, dateFormat))
                        console.log(moment(this.state.startTime).format(dateFormat))

                    }}>asd</Button>

                    <Form name='recom' labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} ref={this.formRef}>
                        <Divider></Divider>
                        <Form.Item label="id" name='id' >
                            <Input className="input-wrapper-from" disabled />
                        </Form.Item>
                        <Form.Item label="广告名称" name='name' rules={[{ required: true, message: '请输入广告名称' }]}>
                            <Input className="input-wrapper-from" placeholder="请输入广告名称" />
                        </Form.Item>
                        {/* <Form.Item label="开始结束时间" name='time' rules={[{ required: true, message: '请选择开始结束时间' }]}  >
                            <RangePicker showTime format={dateFormat} defaultValue={[moment(this.state.startTime, dateFormat), moment(this.state.endTime, dateFormat)]} />
                        </Form.Item> */}


                        {/* <Form.Item label="状态" name="status" valuepropname={this.switch_checked} key='switch' rules={[{ required: true, message: '请选择状态' }]} >
                            <Switch defaultChecked={this.state.switch_checked} checkedChildren="有效" unCheckedChildren="无效" valuePropName='checked' />
                        </Form.Item> */}

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
                        <Form.Item label="二维码地址" >
                            <Input className="input-wrapper-from" />
                        </Form.Item>
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
                        <Form.Item label="展示时长" name="duration" rules={[{ required: true, message: '请输入展示时长' }]}>
                            <Input className="input-wrapper-from" placeholder="例如:10" addonAfter="秒" />
                        </Form.Item>

                        <Form.Item label="跳转类型" name="jumpType">
                            <Select className="input-wrapper-from" >
                                {jump_types.map((item, index) => {
                                    return <Option value={item.key} key={index}>{item.key} - {item.value}</Option>
                                })}
                            </Select>
                        </Form.Item>

                        <Form.Item label="跳转菜单类型" name="jumpMenuType">
                            <Select className="input-wrapper-from" >
                                {jump_menu_types.map((item, index) => {
                                    return <Option value={item.key} key={index}>{item.key} - {item.value}</Option>
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item label="好看分类" name="goodLookType">
                            <Select className="input-wrapper-from" >
                                {good_look_types.map((item, index) => {
                                    return <Option value={item.key} key={index}>{item.key} - {item.value}</Option>
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item label="">
                        {
                            // this.formRef.current && this.formRef.current.getFieldsValue('jumpMenuType') == 1 ? <div>AAA</div> : ''
                            console.log(this.formRef.current ? 1 : 2)
                        }
                       </Form.Item>




                        <Form.Item label="比例" name='ratio'>
                            <Input className="input-wrapper-from"></Input>
                        </Form.Item>

                        <Form.Item label="频道">
                            <Select className="input-wrapper-from"></Select>
                        </Form.Item>


                        <Form.Item label="用户设备标签">
                            <Select className="input-wrapper-from"></Select>
                        </Form.Item>

                        <Form.Item label="标签投放类型">
                        </Form.Item>

                        <Form.Item label="地域">
                        </Form.Item>
                        <Form.Item label="渠道">
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        )
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
        //状态：1、有效,2、无效
        let status = object.status;
        if (status === true) status = 1;
        else if (!status) status = 2;
        object.status = status;

        console.log('object.status');
        console.log(object.status);

        this.props.onOk(object)
    }

}
