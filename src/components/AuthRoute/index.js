import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isAuth } from '../../utils/auth'

export default function AuthRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      // 通过render跳转的路由组件，该组件里面是没有history、location等属性的
      // 这些属性在render函数的参数props里面，需要手动的传递给路由组件
      render={(props) => {
        const isLogin = isAuth()
        if (isLogin) {
          // 登录过
          return <Component {...props} />
        } else {
          // 没有登录，跳转回登录页面
          // 通过Redirect进行路由重定向，并且通过state传递参数
          // 通过state和search的方式传递参数，刷新页面的时候参数不会消失
          // 登录页面进行登录的时候，登录成功跳转是需要根据state参数决定跳转到哪儿的
          // state有值，跳转到state参数值的路径；state没值，跳转的主页
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location },
              }}
            />
          )
        }
      }}
    ></Route>
  )
}
