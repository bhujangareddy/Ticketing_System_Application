import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, setRole } from "../features/auth/AuthSlice";
import axios from "axios";
import { handleAxiosError } from "../utils/HandleAxiosError";

const Login = ({ handleOk }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log("Login Data:", values);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/token/",
        values
      );

      console.log("Backend Response:", response.data);
      dispatch(setRole(response.data))
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      // Attach token for future API calls
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.accessToken}`;
      
      dispatch(login(values));
      form.resetFields();
      handleOk();
      message.success("Login Successful!");
    } catch (error) {
      handleAxiosError(error);
    }
  };
  return (
    <>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: "Please enter your username." },
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
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please enter your password!" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="Enter your password"
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
            Login
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Login;
