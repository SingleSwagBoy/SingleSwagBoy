import { DELTODO, SETREAD } from './actionTypes'

const defaultState = {
  msgLists: [
    {
      content: '明天复习vue',
      isCompleted: false
    },
    {
      content: '明天一起去爬山',
      isCompleted: false
    },
    {
      content: '明天一起开黑',
      isCompleted: false
    },
    {
      content: '代办事项4',
      isCompleted: true
    },
    {
      content: '代办事项',
      isCompleted: false
    },
  ]
}

const reducer = (state=defaultState, action) => {
  const newState = JSON.parse(JSON.stringify(state))
  switch (action.type) {
    case DELTODO:
      newState.msgLists.splice(action.index, 1)
      break;
    case SETREAD:
      newState.msgLists[action.index].isCompleted = true
      break;
    default:
      break;
  }

  return newState
}

export default reducer