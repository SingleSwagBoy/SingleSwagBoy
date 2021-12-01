

import React, { Component } from 'react'
import { } from 'api'
import { Checkbox, Card, Button, message, Table, Modal, List, Select } from 'antd'
import { } from 'react-router-dom'
import { } from "@ant-design/icons"
import moment from 'moment';
import util from 'utils'
import "./style.css"
export default class EarnIncentiveTask extends React.Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageSize: 10,
            total: 0,
            loading: false,
            layout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            tailLayout: {
                wrapperCol: { offset: 20, span: 4 },
            },
        }
    }
    render() {
        let { } = this.state;
        let { materialShow, totalCount, materialData } = this.props
        return (
            <div className="materialBox">
                <Modal title="图文素材列表" centered visible={materialShow} onCancel={() => { }} footer={null} width={800}>
                    <Checkbox.Group style={{ width: '100%' }} onChange={() => { }}>
                        <List
                            grid={{ gutter: 16, column: 3 }}
                            dataSource={materialData}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <Checkbox value={item.media_id}>
                                        {
                                            item.content.news_item && item.content.news_item.map((r, i) => {
                                                return (
                                                    <Card >
                                                        {
                                                            i == 0
                                                                ?
                                                                <div style={{ maxHeight: "300px", width: "100%", position: "relative" }} >
                                                                    <div ><img style={{ width: "100%", height: "100px" }} src={r.thumb_url} alt="" /></div>
                                                                    <div style={{ position: "absolute", "bottom": "0", "color": "#fff", padding: "10px" }}>{r.title}</div>
                                                                </div>
                                                                :
                                                                <div style={{ display: "flex", "alignItems": "center", "justifyContent": 'space-between', padding: "10px" }} >
                                                                    <div>{r.title}</div>
                                                                    <div ><img style={{ width: "30px", height: "30px" }} src={r.thumb_url} alt="" /></div>
                                                                </div>
                                                        }
                                                    </Card>
                                                )
                                            })
                                        }
                                    </Checkbox>
                                </List.Item>
                            )}
                        />
                    </Checkbox.Group>
                </Modal>
            </div>
        )
    }
    componentDidMount() {

    }


    changeSize = (page, pageSize) => {   // 分页
        console.log(page, pageSize);
        this.setState({
            page: page,
            pageSize: pageSize
        }, () => {
            this.getSend()
        })
    }


}