import React, { Component } from 'react'
import NavHeader from '../../components/NavHeader'
import { Button, Toast } from 'antd-mobile'
import { Link } from 'react-router-dom'
// 实现react里面表单验证的两个库(formik、yup)
import { Formik, Form, Field, ErrorMessage } from 'formik'
// 使用yup库添加表单验证规则
import * as yup from 'yup'
import axios from 'axios'
import './index.scss'
import { setToken } from '../../utils/auth'

// 验证的正则表达式 (字母、数字和下划线，并指定位数)
const reg_username = /^[a-zA-Z_\d]{5,8}$/
const reg_password = /^[a-zA-Z_\d]{5,12}$/

export default class Login extends Component {
  render() {
    return (
      <div className="login">
        <NavHeader title="账号登录" className="login-nav-header" />
        <div className="login-content">
          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={yup.object().shape({
              username: yup
                .string()
                .required('用户名不能为空')
                .matches(reg_username, '长度为5-8位，格式为数字、字母、下划线'),
              password: yup
                .string()
                .required('密码不能为空')
                .matches(
                  reg_password,
                  '长度为5-12位，格式为数字、字母、下划线'
                ),
            })}
            // 登录功能函数
            onSubmit={async (values) => {
              const { username, password } = values
              const res = await axios.post('/user/login', {
                username,
                password,
              })
              const { status, description, body } = res
              if (status === 200) {
                setToken(body.token)
                // 被AuthRoute组件打回到登录页面，参数里面的state是有值的
                const url = this.props.location.state?.from.pathname
                this.props.history.replace(url || '/home/profile')
              } else {
                Toast.show({
                  content: description,
                  duration: 1500,
                })
              }
            }}
          >
            {() => (
              <Form autoComplete="off">
                <div className="form-item">
                  <div className="input">
                    <Field name="username" placeholder="请输入账号" />
                  </div>
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="form-item">
                  <div className="input">
                    <Field name="password" placeholder="请输入密码" />
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="error"
                  />
                </div>

                <div className="form-submit">
                  <Button block color="primary" size="large" type="submit">
                    登录
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <div className="back-home">
          <Link to="/register">还没有账号，去注册~</Link>
        </div>
      </div>
    )
  }
}
