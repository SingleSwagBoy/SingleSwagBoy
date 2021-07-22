import React from 'react'
import Loading2 from '../../components/Loading2/index'
import 'animate.css'

class LoadingDemo extends React.Component {
  render() {
    return (
      <div style={styles.bg}>
        <h3 style={styles.loadingTitle} className='animated bounceInLeft'>欢迎来到电视家,一起来发现有趣吧</h3>
        <Loading2/>
      </div>
    )
  }
}

const styles = {
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: '#DEF3F4'
  },
  loadingTitle:{
    position:'absolute',
    top:'50%',
    left:'40%',
    // marginLeft: -45,
    // marginTop: -18,
    color:'#000',
    fontWeight:500,
    fontSize:20
  },
}
export default LoadingDemo