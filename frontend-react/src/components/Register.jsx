import React from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { namePattern, emailEnd, pwdPattern, pwdRule } from "../utils/constants";
import axios from "axios";
import { handleAxiosError } from "../utils/HandleAxiosError";

const Register = ({ handleOk }) => {
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    try {
      console.log("Register Data:", values);
      const user = await axios.post(
        "http://127.0.0.1:8000/api/v1/register/",
        values
      );
      console.log("Backend Response:", user.data);
      form.resetFields();
      handleOk();
      message.success("Registered successfully!");
    } catch (error) {
      handleAxiosError(error);
    }
  };

  return (
    <>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: "Please enter your username." },
            { min: 5, message: "Username must contain atleast 5 characters." },
            {
              max: 30,
              message: "Username must not exceed more than 30 characters.",
            },
            {
              pattern: namePattern,
              message:
                "Username must contain only small, capital letters and no consecutive space characters",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="Enter your username"
            size="large"
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email!" },
            { type: "email", message: "Enter a valid email address!" },
            {
              max: 30,
              message: "Email must not exceed more than 30 characters!",
            },
            {
              pattern: emailEnd,
              message: "Email should follow the format 'example@domain.com'",
            },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-gray-400" />}
            placeholder="Enter your email"
            size="large"
            allowClear
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please enter your password!" },
            { min: 8, message: "Password must be atleast 8 characters!" },
            {
              pattern: pwdPattern,
              message: pwdRule,
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Enter a password"
            size="large"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className="rounded-lg"
          >
            Register
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Register;
