import { DELTODO, SETREAD } from './actionTypes'

// 删除todo
const delTodo = (index) => {
  return {
    type: DELTODO,
    index
  }
}

// 点击已读
const setRead = (index) => {
  return {
    type: SETREAD,
    index
  }
}

export {
  delTodo,
  setRead
}