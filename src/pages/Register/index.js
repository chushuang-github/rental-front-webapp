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

// 验证的正则表达式 (字母、数字和下划线，并指定位数)
const reg_username = /^[a-zA-Z_\d]{5,8}$/
const reg_password = /^[a-zA-Z_\d]{5,12}$/

export default class Register extends Component {
  render() {
    return (
      <div className="register">
        <NavHeader title="注册" className="register-nav-header" />
        <div className="register-content">
          <Formik
            initialValues={{ username: '', password: '', repassword: '' }}
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
              repassword: yup
                .string()
                .required('密码不能为空')
                .matches(
                  reg_password,
                  '长度为5-12位，格式为数字、字母、下划线'
                ),
            })}
            onSubmit={async (values) => {
              const { username, password, repassword } = values
              if (password !== repassword) {
                Toast.show({
                  content: '输入的两次密码不一致',
                  duration: 1500,
                })
                return
              }
              const res = await axios.post('/user/registered', {
                username,
                password,
              })
              const { status, description, body } = res
              console.log(res)
              if (status === 200) {
                localStorage.setItem('hkzf_token', body.token)
                this.props.history.push('/home/profile')
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

                <div className="form-item">
                  <div className="input">
                    <Field name="repassword" placeholder="请确认密码" />
                  </div>
                  <ErrorMessage
                    name="repassword"
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
          <Link to="/home">点我返回首页</Link>
          <Link to="/login">已有账号，去登陆</Link>
        </div>
      </div>
    )
  }
}
