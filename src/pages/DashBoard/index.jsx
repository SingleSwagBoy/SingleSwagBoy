import React, { Component } from 'react'
import { Card, Row, Col } from 'antd'

const echarts = require('echarts');

export default class DashBoard extends Component {
  render() {
    // console.log('/dashBoard')
    return (
      <div>
        <Card title="仪表盘">
          <Row gutter={10}>
            <Col span={6}>
              <div style={{height: 300, background: '#09015f'}}>
                内容1
              </div>
            </Col>
            <Col span={6}>
              <div style={{height: 300, background: '#09125f'}}>
                内容2
              </div>
            </Col>
            <Col span={6}>
              <div style={{height: 300, background: '#09032f'}}>
                内容3
              </div>
            </Col>
            <Col span={6}>
              <div style={{height: 300, background: '#090176'}}>
                内容4
              </div>
            </Col>
          </Row>
          {/*
           图表
          */}
          <Row gutter={10}>
            <Col span={12}>
              <div id="chart1" style={{height: 300}}></div>
            </Col>
            <Col span={12}>
              <div id="chart2" style={{height: 300, overflow: 'hidden'}}></div>
            </Col>
          </Row>
        </Card>
      </div>
    )
  }
  componentDidMount(){
    this.initChart1()
    this.initChart2()
  }
  initChart1 = () => {
    const myChart = echarts.init(document.getElementById('chart1'));
    // 绘制图表
    myChart.setOption({
      title: {
          text: 'xxxx标题'
      },
      color: ['#978234', 'green'],
      tooltip: {},
      xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      legend: {},
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        },
        {
          name: '销售额',
          type: 'line',
          smooth: true,
          data: [23, 14, 33, 23, 32, 55]
        }
      ]
    });
  }
  initChart2 = () => {
    var dataArr = 34;
    var colorSet = {
        color: '#468EFD'
    };
    const option = {
        backgroundColor: '#0E1327',
        tooltip: {
            formatter: "{a} <br/>{b} : {c}%"
        },
    
        series: [{
                name: "内部进度条",
                type: "gauge",
                // center: ['20%', '50%'],
                radius: '40%',
    
                splitNumber: 10,
                axisLine: {
                    lineStyle: {
                        color: [
                            [dataArr / 100, colorSet.color],
                            [1, "#111F42"]
                        ],
                        width: 8
                    }
                },
                axisLabel: {
                    show: false,
                },
                axisTick: {
                    show: false,
    
                },
                splitLine: {
                    show: false,
                },
                itemStyle: {
                    show: false,
                },
                detail: {
                    formatter: function(value) {
                        if (value !== 0) {
                            var num = Math.round(value ) ;
                            return parseInt(num).toFixed(0)+"%";
                        } else {
                            return 0;
                        }
                    },
                    offsetCenter: [0, 82],
                    textStyle: {
                        padding: [0, 0, 0, 0],
                        fontSize: 18,
                        fontWeight: '700',
                        color: colorSet.color
                    }
                },
                title: { //标题
                    show: true,
                    offsetCenter: [0, 46], // x, y，单位px
                    textStyle: {
                        color: "#fff",
                        fontSize: 14, //表盘上的标题文字大小
                        fontWeight: 400,
                        fontFamily: 'PingFangSC'
                    }
                },
                data: [{
                    name: "清分完成率",
                    value: dataArr,
                }],
                pointer: {
                    show: true,
                    length: '75%',
                    radius: '20%',
                    width: 10, //指针粗细
                },
                animationDuration: 4000,
            },
            {
                name: '外部刻度',
                type: 'gauge',
                //  center: ['20%', '50%'],
                radius: '50%',
                min: 0, //最小刻度
                max: 100, //最大刻度
                splitNumber: 10, //刻度数量
                startAngle: 225,
                endAngle: -45,
                axisLine: {
                    show: true,
                    lineStyle: {
                        width: 1,
                        color: [
                            [1, 'rgba(0,0,0,0)']
                        ]
                    }
                }, //仪表盘轴线
                axisLabel: {
                    show: true,
                    color: '#4d5bd1',
                    distance: 25,
                    formatter: function(v) {
                        // eslint-disable-next-line default-case
                        switch (v + '') {
                            case '0':
                                return '0';
                            case '10':
                                return '10';
                            case '20':
                                return '20';
                            case '30':
                                return '30';
                            case '40':
                                return '40';
                            case '50':
                                return '50';
                            case '60':
                                return '60';
                            case '70':
                                return '70';
                            case '80':
                                return '80';
                            case '90':
                                return '90';
                            case '100':
                                return '100';
                        }
                    }
                }, //刻度标签。
                axisTick: {
                    show: true,
                    splitNumber: 7,
                    lineStyle: {
                        color: colorSet.color, //用颜色渐变函数不起作用
                        width: 1,
                    },
                    length: -8
                }, //刻度样式
                splitLine: {
                    show: true,
                    length: -20,
                    lineStyle: {
                        color: colorSet.color, //用颜色渐变函数不起作用
                    }
                }, //分隔线样式
                detail: {
                    show: false
                },
                pointer: {
                    show: false
                }
            },
        ]
    };
    
    const myChart = echarts.init(document.getElementById('chart2'));
    myChart.setOption(option)
  }
}
