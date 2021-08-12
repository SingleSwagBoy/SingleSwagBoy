// 广告管理尝鲜版弹出框内容
import React, { Component } from 'react'
import { baseUrl, } from 'api'
import './style.css'

import { Input, DatePicker, Button, Tooltip, Switch, Modal, Form, Select, Alert, Divider, Upload, Image, message } from 'antd';
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;



export default class recommendModal extends Component {

    constructor(props) {
        super(props);

        this.formRef = React.createRef();
        this.state = {
            is_create: true,    //是否新增数据 
            is_loading: false,
            ad_image_url: '',       //广告图片链接

        }
    }

    componentWillUpdate(prevProps, prevState) {
        let that = this;
        let modal_box = prevProps.modal_box;
        let select_item = modal_box.select_item;

        if (!this.formRef || !this.formRef.current) {
            let interval = setInterval(() => {
                if (!this.formRef || !this.formRef.current) {

                } else {
                    that.renderPageWhenPageChange(select_item);
                    clearInterval(interval);
                }
            }, 1000)
        } else {
            that.renderPageWhenPageChange(select_item);
        }
    }





    render() {
        let { is_loading, ad_image_url } = this.state;
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
                        <Button type="primary" loading={is_loading} onClick={() => {
                            let object = this.formRef.current.getFieldsValue()

                            if (!object.status) object.status = false;

                            for (let key in object) {
                                let item = object[key];
                                console.log(key + ' --- ' + item)
                            }

                            let id = this.formRef.current.id;
                            console.log('id--->' + id);
                            // this.props.onOk(object)
                        }}>确定</Button>,

                    ]}>
                    <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} ref={this.formRef}>
                        <Divider></Divider>
                        <Form.Item label="广告名称" name='name' rules={[{ required: true, message: '请输入广告名称' }]}>
                            <Input className="input-wrapper-from" placeholder="请输入广告名称" />
                        </Form.Item>
                        <Form.Item label="状态" name='status' rules={[{ required: true, message: '请选择状态' }]} >
                            <Switch checkedChildren="有效" unCheckedChildren="无效" />
                        </Form.Item>

                        <Divider orientation="left">二维码配置</Divider>

                        <Form.Item label="二维码类型" name="type" rules={[{ required: true, message: '请选择二维码类型' }]} >
                            <Select className="input-wrapper-from">
                                {qrcode_types.map(item => {
                                    return <Option value={item.key} key={item.key}>{item.key} - {item.value}</Option>
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item label="二维码尺寸">
                            <Form.Item name="qrWidth" rules={[{ required: true, message: '请输入二维码宽度' }]}>
                                <Input className="input-wrapper-from" addonBefore="宽" placeholder="例如:200" addonAfter="px" />
                            </Form.Item>
                            <Form.Item name="qrHight" rules={[{ required: true, message: '请输入二维码高度' }]}>
                                <Input className="input-wrapper-from" addonBefore="高" placeholder="例如:200" addonAfter="px" />
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label="二维码偏移">
                            <Form.Item name="qrX" rules={[{ required: true, message: '请输入二维码横轴' }]}>
                                <Input className="input-wrapper-from" addonBefore="横" placeholder="例如:200" addonAfter="px" />
                            </Form.Item>
                            <Form.Item name="qrY" rules={[{ required: true, message: '请输入二维码纵轴' }]}>
                                <Input className="input-wrapper-from" addonBefore="纵" placeholder="例如:200" addonAfter="px" />
                            </Form.Item>
                        </Form.Item>
                        <Form.Item label="二维码颜色" name="qrColor" rules={[{ required: true, message: '请输入二维码颜色' }]}>
                            <Input className="input-wrapper-from" />
                        </Form.Item>
                        <Form.Item label="二维码地址" name="qrCodeUrl" rules={[{ required: true, message: '请输入二维码地址' }]}>
                            <Input className="input-wrapper-from" />
                        </Form.Item>


                        <Divider orientation="left">广告配置</Divider>
                        <Form.Item label="图片" name="picUrl">
                            <div className="uplpad-image-box">
                                <Upload {...this.buildAdImageUpload()}>上传图片</Upload>
                                {ad_image_url ? <Image width={100} height={100} src={ad_image_url} /> : ''}
                            </div>

                            <div>{ad_image_url}</div>
                        </Form.Item>
                        <Form.Item label="展示时长" name="duration" >
                            <Input className="input-wrapper-from" placeholder="例如:10" addonAfter="秒" />
                        </Form.Item>

                        <Form.Item label="跳转类型" name="jumpType">
                            <Select className="input-wrapper-from" >
                                {jump_types.map(item => {
                                    return <Option value={item.key} key={item.key}>{item.key} - {item.value}</Option>
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item label="跳转菜单类型" name="jumpMenuType">
                            <Select className="input-wrapper-from" >
                                {jump_menu_types.map(item => {
                                    return <Option value={item.key} key={item.key}>{item.key} - {item.value}</Option>
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item label="好看分类" name="goodLookType">
                            <Select className="input-wrapper-from" >
                                {good_look_types.map(item => {
                                    return <Option value={item.key} key={item.key}>{item.key} - {item.value}</Option>
                                })}
                            </Select>
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

    renderPageWhenPageChange(data) {
        let that = this;
        that.formRef.current.resetFields();
        // that.setState({
        //     is_loading: false,
        // })


        //编辑
        if (data) {

            that.formRef.current.setFieldsValue(data)
            that.state.ad_image_url = data.picUrl;
        }
        //创建
        else {
            that.state.ad_image_url = '';
        }

        // that.state.is_loading = false;


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


}
