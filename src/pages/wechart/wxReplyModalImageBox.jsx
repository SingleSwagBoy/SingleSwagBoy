/*
 * @Author: HuangQS
 * @Date: 2021-09-07 18:41:59
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-09-08 16:46:01
 * @Description: 多种类型的[微信公众号]上传对应图片
 */

import React, { Component } from 'react';
import { Input, Form } from 'antd';
import ImageUpload from "@/components/ImageUpload/index" //图片组件

export default class wxReplyModalImageBox extends Component {
    constructor(props) {
        super(props);
        this.imageFormRef = React.createRef();

        this.state = {
            form_status: 0, //form状态 0:未初始化 1:初始化中 2:已完成初始化
            form_interval: null,    //定时器
            render_wx_codes: [
                // {
                //     name: '',            //公众号名称
                //     code: '',            //公众号code
                //     media_url: '',       //图片地址mediaUrl
                //     media_iD: '',        //图片id
                // }
            ],
            imgs: [],   //图片数据列表
            //页面渲染的微信二维码
        }
    }

    componentDidMount() {
        let that = this;
        that.initFormRef();
        that.props.onRef(that);
    }
    //获取Form表单的Ref对象 若未取到数据 将持续强制更新
    initFormRef() {
        let that = this;
        let interval = that.state.form_interval;

        if (that.imageFormRef && that.imageFormRef.current) {
            if (interval) {
                clearInterval(interval);
            }
            return;
        }
        if (!interval) {
            interval = setInterval(() => {
                that.forceUpdate();
            }, 1000);
        }
    }


    render() {
        let that = this;
        let { imgs } = that.state;


        return (
            <div>
                <Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} style={{ width: 600 }} ref={that.imageFormRef} >
                    {that.imageFormRef && that.imageFormRef.current && (
                        <Form.Item label="图片上传">
                            <Form.Item>
                                <label>根据微信的要求，需要指定且单独上传对应的微信公众号所需要的图片</label>
                            </Form.Item>
                            {
                                imgs.map((item, index) => (
                                    <Form.Item label={item.name} name={item.wxCode} key={index}>
                                        <ImageUpload
                                            getUploadFileUrl={(file, newItem) => { that.getUploadFileUrl(item.wxCode, newItem) }}
                                            postUrl={`/mms/wxReply/addMedia?wxCode=${item.wxCode}`}
                                            // imageUrl={imgs[index].url ? imgs[index].url : ""}
                                            imageUrl={that.getImageUrlByCode(item.wxCode, index)}
                                        />
                                    </Form.Item>
                                ))
                            }
                        </Form.Item>
                    )}
                </Form>

            </div>
        );
    }




    //传入当前选中的WxCode对应的keys
    pushSelectWxCodeKeys(wxCodeKeys, data) {
        if (!data) return;
        let that = this;
        let { dict_public_types } = that.props; //所有微信公众号列表

        let imgs = [];

        for (let i = 0, ilen = dict_public_types.length; i < ilen; i++) {
            let dict = dict_public_types[i];
            let temp_code = dict.code;

            for (let j = 0, jlen = wxCodeKeys.length; j < jlen; j++) {
                let curr_code = wxCodeKeys[j];
                if (curr_code === temp_code) {

                    let obj = {
                        wxCode: dict.code,
                        name: dict.name,
                    }
                    imgs.push(obj);
                    break;
                }
            }
        }

        //遍历 循环查询出回复数据中的图片列表 存储图片到本地
        let temp_imgs = data.imgs;
        if (temp_imgs) {
            for (let i = 0, ilen = temp_imgs.length; i < ilen; i++) {
                let temp_img = temp_imgs[i];
                let temp_code = temp_img.wxCode;
                for (let j = 0, jlen = imgs.length; j < jlen; j++) {
                    let curr_img = imgs[j];
                    let curr_code = curr_img.wxCode;

                    if (temp_code === curr_code) {
                        curr_img.url = temp_img.url;
                        curr_img.media_id = temp_img.media_id;
                        break;
                    }
                }
            }
        }

        that.setState({
            imgs: imgs,
        }, () => {
            that.forceUpdate();
        })
    }
    /**
     * 获取上传的图片路径
     * @param {*} curr_code 
     * @param {*} newItem 
     */
    getUploadFileUrl(curr_code, newItem) {
        console.log('获取图片路径');
        console.log(newItem);

        let that = this;
        let { imgs } = that.state;
        let url = newItem.url;
        let media_id = newItem.mediaID;


        for (let i = 0, ilen = imgs.length; i < ilen; i++) {
            let img = imgs[i];
            let temp_code = img.wxCode;
            if (curr_code === temp_code) {
                img.media_id = media_id;
                img.url = url;
                break;
            }
        }
        that.imageFormRef.current.setFieldsValue(imgs);
        that.onImageUploadCallback()
    }
    //获取图片url地址
    getImageUrlByCode(curr_code, index) {
        let that = this;
        let { imgs } = that.state;
        let img_url = '';

        let img = imgs[index];
        if (img) {
            let url = img.url;
            if (url) {
                img_url = url;
            }
        }
        return img_url;
    }

    //获取imgs
    getImgs() {
        let that = this;
        let { imgs } = that.state;

        return imgs;
    }
    //上传图片成功回调
    onImageUploadCallback() {
        let that = this;
        let { imgs } = that.state;

        that.props.onCallback(imgs);
    }






}