/*
 * @Description: 同步按钮，所有的同步将在这里集中处理 根据传入的type类型不同 发起不同的同步申请
 * @Author: HuangQS
 * @Date: 2021-08-25 18:41:48
 * @LastEditors: HuangQS
 * @LastEditTime: 2022-03-14 17:58:01
 */

import React, { Component } from 'react'
import { Tooltip, Button, message } from 'antd';
import {
    syncOther,                      //其他缓存
    syncLiveCarousel,               //直播轮播缓存
    syncSyncConfig,                 //查找合集短视频 /mms/config/common/syn_config?key=
    syncSynSlice,                   //配置管理 简单的接口
    syncWeChat,                     //微信自动回复/wxcode/微信二维码
    syncMenuImage,                  //广告菜单栏目录配置
    syncWxTemplateMsgConfig,        //微信模板消息 同步
    syncWhite,                      //白名单广告 同步
    syncProgramAppConfig,           //电视节目单 同步
    syncAdNewTagSync,               //广告新标签 数据同步
    adListSync,                     // 广告组数据同步
    adRightKeySync,                 // 素材数据同步
    syncZzItemList,                 // 赚赚提现商品同步
    syncZZShow,                     //公告和随机金额配置同步
    syncProgramList,                //节目单视频集配置
    syncSuggest,                    //首页为你推荐
    syncWordsConfig,                //首页文字轮播同步缓存
    syncHomeList,                   //首页直播配置同步
    syncSource,                   //源失效
    syncEnterChannel,                   //会员开机进入配置
    syncChannelSport,                   //配置管理-体育频道视频集配置-数据同步
    syncMyWechatUser,                   //企业微信
    syncQrcodeConfig,                   //企业微信同步到我们库
    syncPowerBoot,                   //开启启动图配置
    syncHkCategory,                   //好看分类
    synctags,                        //企微标签
    syncChannelRecommend,           //频道推荐-数据同步
    syncActivityConfig,           //家庭相册配置图片活动
    syncArmourPackage,              //马甲包
    syncOfflineProgram,              //下线节目
    syncAdSPList,              //支付成功
    syncMenuList,              //菜单配置
    requestApkConfigSync,               //同步apk配置
    syncTopic,               //tv专题页面
    syncMineGrid,               //我的页面
    syncLogout,               //我的页面
    syncHotChannel,               //频道搜索==》热门频道
    syncAblum,               //相册活动管理

} from 'api'


export default class SyncBtn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sync_status: 0, //0：按钮名称 1：等待同步 2：正在同步 3：同步成功 4：同步失败
        }
    }

    /**
     *  分类获取请求的数据
     * 
     * @param {*} type      类型 分类请求缓存接口 type在下方查询
     * @param {*} params    非必要参数 某些特定缓存需要传入参数
     * @return 对应方法体 
     */
    getSyncFuncByType(type, params) {
        let that = this;
        if (type === 1) return syncOther();                                     //其他缓存(热点频道/友盟上报/播放控制/分享码/产品线/文案/配置API/移动端banner/运营位/用户识别规则/热点节目/渠道/卡顿策略/设备权益/eslog/开机进入/定时任务/专享运营位/家庭账号配置)
        if (type === 2) return syncLiveCarousel();                              //直播轮播缓存 (直播预告/轮播推荐/观影厅频道配置)
        if (type === 3) return syncSyncConfig(params);                          //查找合集短视频 /mms/config/common/syn_config?key=
        if (type === 4) return syncWeChat();                                    //微信自动回复/wxcode/微信二维码
        if (type === 5) return syncMenuImage();                                 //广告菜单栏目录配置
        if (type === 6) return syncWxTemplateMsgConfig();                       //微信模板消息 同步
        if (type === 7) return syncSynSlice(params);                            //简单接口 
        if (type === 8) return syncWhite();                                     //白名单
        if (type === 9) return syncProgramAppConfig();                          //电视节目单配置
        if (type === 10) return syncAdNewTagSync();                             //广告新标签
        if (type === 11) return adListSync();                                   //广告组
        if (type === 12) return adRightKeySync();                               //素材
        if (type === 13) return syncZzItemList();                               //提现商品列表
        if (type === 14) return syncZZShow(params);                             //公告和随机金额配置
        if (type === 15) return syncProgramList(params);                              //节目单视频集配置
        if (type === 16) return syncSuggest();                                 //首页为你推荐
        if (type === 17) return syncWordsConfig();                                 //首页文字轮播同步缓存
        if (type === 18) return syncHomeList(params);                                 //首页直播配置同步
        if (type === 19) return syncSource();                                 //源失效
        if (type === 20) return syncEnterChannel();                                 //会员开机进入配置
        if (type === 21) return syncChannelSport();                                 //配置管理-体育频道视频集配置-数据同步
        if (type === 22) return syncMyWechatUser();                                 //企业微信
        if (type === 23) return syncQrcodeConfig();                                 //企业微信同步到我们库
        if (type === 24) return syncPowerBoot();                                 //开启启动图配置
        if (type === 25) return syncHkCategory();                                //好看分类
        if (type === 26) return syncChannelRecommend();                                 //频道推荐-数据同步
        if (type === 27) return synctags();                                      //企微标签
        if (type === 28) return syncActivityConfig();                                      //家庭相册配置图片活动
        if (type === 29) return syncArmourPackage();                                      //马甲包
        if (type === 30) return syncOfflineProgram();                                      //下线节目
        if (type === 31) return syncAdSPList();                                      //支付成功
        if (type === 32) return syncMenuList();                                      //菜单配置
        if (type === 33) return requestApkConfigSync();                                      //同步apk配置
        if (type === 34) return syncTopic();                                      //tv专题页面
        if (type === 35) return syncMineGrid();                                      //tv专题页面
        if (type === 36) return syncLogout();                                      //tv专题页面
        if (type === 37) return syncHotChannel();                                      //频道搜索==》热门频道
        if (type === "ablumActivity") return syncAblum();                                      //相册活动管理


        return that.diasbleSync(); //防止报错 本地mock的返回方法 必定返回错误
    }


    render() {
        let that = this;
        let { sync_status } = that.state;
        let { name, desc, size } = that.props;

        return (
            <Tooltip title={`${desc ? desc : '你懂的，点一下，同步数据'}`} placement="top"  >
                <Button type="primary" size={size} onClick={() => that.onSyncBtnClick()} style={{ 'marginLeft': '10px' }} disabled={sync_status === 2}
                    onMouseLeave={(e) => that.onSyncBtnBlur(e)}  >
                    {
                        sync_status === 0 ? `${name}` :
                            sync_status === 1 ? `等待同步` :
                                sync_status === 2 ? `正在同步` :
                                    sync_status === 3 ? `同步成功` :
                                        sync_status === 4 ? `同步失败` : ''
                    }
                </Button>
            </Tooltip>
        )
    }

    //同步按钮被点击
    onSyncBtnClick() {
        let that = this;
        let sync_status = that.state.sync_status;
        if (sync_status === 2) {
            message.error('正在同步，请耐心等待。');
            return;
        }

        that.setState({
            sync_status: 2,
        }, () => {
            that.requestSyncByType();
        })
    }

    //类型判断 同步请求
    requestSyncByType() {
        let that = this;
        let { type, params } = that.props;

        that.getSyncFuncByType(type, params).then(res => {
            message.success('同步成功');
            that.setState({ sync_status: 3 })
        }).catch(res => {
            message.error('同步失败:' + res.desc);
            that.setState({ sync_status: 4 })
        })
    }




    //按钮获取到焦点 状态变更为展示名字
    onSyncBtnBlur() {
        let that = this;
        let sync_status = that.state.sync_status;
        //同步成功 || 同步失败
        if (sync_status === 3 || sync_status === 4) {
            that.setState({ sync_status: 0 })
        }
    }

    //本地mock的返回方法
    diasbleSync() {
        let that = this;
        let { name, desc } = that.props;

        let obj = {
            desc: `[${name}]尚未完成对应接口的开发`,
        }
        return Promise.reject(obj);
    }
}
