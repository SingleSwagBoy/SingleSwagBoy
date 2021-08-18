import React, { Component } from 'react'
// import request from 'utils/request'
import { } from 'api'
import { Card, Breadcrumb, Button, message, Tabs, Table } from 'antd'
import request from 'utils/request.js'
import { } from 'react-router-dom'
import { } from "@ant-design/icons"
import util from 'utils'
import "./style.css"
const { TabPane } = Tabs;
export default class AddressNews extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            lists: [],
            loading: false,
            config: "",
            channelList: [],
            layout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            tailLayout: {
                wrapperCol: { offset: 4, span: 20 },
            },
            addressList: [
                "山东-济南", "河北-石家庄", "吉林-长春", "黑龙江-哈尔滨", "辽宁-沈阳", "内蒙古-呼和浩特", "新疆-乌鲁木齐", "甘肃-兰州", "宁夏-银川",
                "山西-太原", "陕西-西安", "河南-郑州", "安徽-合肥", "江苏-南京", "浙江-杭州", "福建-福州", "广东-广州", "江西-南昌", "海南-海口", "广西-南宁",
                "贵州-贵阳", "湖南-长沙", "湖北-武汉", "四川-成都", "云南-昆明", "西藏-拉萨", "青海-西宁", "天津-天津", "上海-上海", "重庆-重庆", "北京-北京", "台湾-台北"
            ],
            columns: [
                {
                    title: "标题",
                    dataIndex: "title",
                    key: "title",
                },
                {
                    title: "操作",
                    key: "action",
                    width: 200,
                    render: (rowValue, row, index) => {
                        return (
                            <div>
                                {
                                    <div style={{color:"#1890ff",cursor:"pointer"}} onClick={() => {
                                        window.open(`https://www.douyin.com/search/${row.title}`)
                                    }}>
                                        搜索
                                    </div>
                                }
                            </div>
                        )
                    }
                }

            ],
        }
    }
    render() {
        const { addressList } = this.state;
        return (
            <div className="address_page">
                <Card title={
                    <Breadcrumb>
                        <Breadcrumb.Item>地域新闻</Breadcrumb.Item>
                    </Breadcrumb>

                }
                >
                    <Tabs defaultActiveKey="0" tabPosition={"left"}
                    onChange={(val)=>{
                        console.log(val)
                        this.setState({
                            loading:true
                        })
                        this.getNews(this.state.addressList[val].split("-")[1])
                    }}
                    >
                        {
                            addressList.map((r, i) => (
                                <TabPane tab={r} key={i}>
                                    <Table
                                        dataSource={this.state.lists}
                                        rowKey={i}
                                        loading={this.state.loading}
                                        columns={this.state.columns} />
                                </TabPane>
                            ))
                        }
                    </Tabs>

                </Card>
            </div>
        )
    }
    componentDidMount() {
        this.setState({
            loading:true
        })
        this.getNews(this.state.addressList[0].split("-")[1])
    }
    getNews(addr) {
        let params = {
            "type": "cityHotSearch",
            "cities": [addr]
        }
        request.post(`http://47.93.253.41:5000/spider/weibo/update`, params).then(res => {
            console.log(res)
            if (res.data.success) {
                this.setState({
                    lists:res.data.cities_hots[0].hots,
                    loading:false
                })
            }else{
                this.setState({
                    lists:[],
                    loading:false
                })
            }
        })
    }

}
