import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, List, Avatar, Button, Badge, Modal } from 'antd'
import { delTodo, setRead } from 'store/msg/actionCreates'
const { confirm } = Modal

const mapStateToProps = (state) => {
  return {
    msgLists: state.msg.msgLists
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    delTodo: (index) => {
      dispatch(delTodo(index))
    },
    setRead: (index) => {
      dispatch(setRead(index))
    }
  }
}


@connect(mapStateToProps, mapDispatchToProps)
class MsgLists extends Component {
  render() {

    return (
      <Card>
        <List
          itemLayout="horizontal"
          dataSource={this.props.msgLists}
          renderItem={(item, index) => (
            <List.Item
              actions={[
              <Button 
                disabled={item.isCompleted} 
                onClick={()=>{
                  this.props.setRead(index)
                }}
                size="small" 
                type="primary">点击已读</Button>
              ,<Button 
                danger
                onClick={()=>{
                  confirm({
                    title: '删除消息',
                    content: '确认删除吗？',
                    onOk: ()=>{
                      this.props.delTodo(index)
                    }
                  });
                }}
                size="small" 
                type="primary">删除</Button>
            ]}
            >
              <List.Item.Meta
                avatar={
                  <Badge dot={!item.isCompleted}>
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  </Badge>
                }
                // title={<span>{item.title}</span>}
                description={<span>{item.content}</span>}
              />
            </List.Item>
          )}
        />
      </Card>
    )
  }
}

export default  MsgLists
