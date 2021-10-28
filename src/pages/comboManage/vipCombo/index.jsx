import React, { Component } from 'react'
class VipCombo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageSize: 10,
            total: 0,
            loading: false,
            currentItem: {},
            layout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 20 },
            },
            tailLayout: {
                wrapperCol: { offset: 4, span: 20 },
            },
            packageTypes: [
                {key: 1, label: "普通套餐"},
                {key: 2, label: "实物"},
                {key: 3, label: "竞猜答题"},
            ],
        }
    }
    render() {
        return <div>VipCombo</div>;
    }
}

export default VipCombo;