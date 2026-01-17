import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Space, message, App } from "antd";
import { addTicket, fetchTickets } from "../features/ticket/TicketSlice";
import TicketFormItems from "./TicketFormItems";
import axios from "axios";
import { handleAxiosError } from "../utils/HandleAxiosError";

const TicketForm = ({ handleOk, handleCancel }) => {
  const currentUserName = useSelector((state) => state.Auth.user.username);
  // const email = useSelector((state) => state.Auth.user.email);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onReset = () => {
    form.resetFields();
  };

  const handleCancelClick = () => {
    onReset();
    handleCancel();
  };

  const onFinish = async (values) => {
    console.log(values);

    try {
      console.log("Ticket Form Data:", values);

      const token = localStorage.getItem("accessToken");
      console.log(token);

      // const response = await axios.get(`http://127.0.0.1:8000/users/me/`, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      // console.log(
      //   "Fetched the current loggedIn user from Backend logic:",
      //   response.data
      // );

      // const response2 = await axios.get(
      //   `http://127.0.0.1:8000/users/${values.assignee}/`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );
      // console.log(response2.data);
      console.log(values.assignee);
      // console.log(values.assignee?.id);

      const ticketDetails = {
        title: values.title,
        description: values.description,
        estimated_time: values.estimated_time,
        status: values.status,
        priority: values.priority,
        categories: values.categories,
        assignee: values.assignee || null,
        due_date: values.due_date?.format("YYYY-MM-DD"),
        meeting_time: values.meeting_time?.format("HH:mm:ss"),
      };
      console.log(ticketDetails);

      const ticket = await axios.post(
        "http://127.0.0.1:8000/tickets/create/",
        ticketDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`, // include token
          },
        }
      );
      console.log("Backend Response when ticket added to DB:", ticket.data);

      dispatch(addTicket(ticket.data));
      dispatch(fetchTickets(currentUserName));
      form.resetFields();
      handleOk();
      message.success("Task Added Successfully!");
    } catch (error) {
      handleAxiosError(error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        status: "ToDo",
        priority: "Medium",
        reporter: currentUserName,
      }}
    >
      <TicketFormItems form={form} />
      <Form.Item>
        <Space>
          <Button onClick={handleCancelClick}>Cancel</Button>
          <Button htmlType="button" onClick={onReset}>
            Reset
          </Button>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default TicketForm;
