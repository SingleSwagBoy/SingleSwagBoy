/*
 * @Description: 同步按钮，所有的同步将在这里集中处理 根据传入的type类型不同 发起不同的同步申请
 * @Author: HuangQS
 * @Date: 2021-08-25 18:41:48
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-08-27 11:09:41
 */

import React, { Component } from 'react'
import { Tooltip, Button, message } from 'antd';
import {
    syncOther,                      //其他缓存
    syncLiveCarousel,               //直播轮播缓存
    syncSyncConfig,
} from 'api'


export default class SyncBtn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sync_status: 0, //0：按钮名称 1：等待同步 2：正在同步 3：同步成功 4：同步失败
        }
    }
    render() {
        let that = this;
        let { sync_status } = that.state;
        let { name, desc } = that.props;

        return (
            <Tooltip title={`${desc ? desc : '你懂的，点一下，同步数据'}`} placement="top"  >
                <Button type="primary" onClick={() => that.onSyncBtnClick()} style={{ 'marginLeft': '10px' }} disabled={sync_status === 2}
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

    /**
     *  分类获取请求的数据
     * 
     * @param {*} type      类型 分类请求缓存接口 type在下方查询
     * @param {*} params    非必要参数 某些特定缓存需要传入参数
     * @return 对应方法体 
     */
    getSyncFuncByType(type, params) {
        let that = this;
        if (type === 1) return syncOther();                                 //其他缓存(热点频道/友盟上报/播放控制/分享码/产品线/文案/配置API/移动端banner/运营位/用户识别规则/热点节目/渠道/卡顿策略/设备权益/eslog/开机进入/定时任务/专享运营位/家庭账号配置)
        if (type === 2) return syncLiveCarousel();                          //直播轮播缓存 (直播预告/轮播推荐/观影厅频道配置)
        if (type === 3) return syncSyncConfig(params);                      //查找合集短视频 /mms/config/common/syn_config?key=

        return that.diasbleSync(); //防止报错 本地mock的返回方法 必定返回错误
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