import { combineReducers } from 'redux'
import user from './user'
import msg from './msg'

const rootReducer = combineReducers({
  user,
  msg
})

export default rootReducer