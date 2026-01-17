import { Button, Space, Form, message, Row, Col, App } from "antd";
import { useDispatch } from "react-redux";
import { updateTicket } from "../features/ticket/TicketSlice";
import dayjs from "dayjs";
import TicketFormItems from "./TicketFormItems";
import axios from "axios";
import { handleAxiosError } from "../utils/HandleAxiosError";
import { useEffect } from "react";

const EditTicketModal = ({ selectedTicket, setOpen }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const initialAssignee = selectedTicket.assignee;

  const handleReset = () => form.resetFields();

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  useEffect(() => {
    if (selectedTicket) {
      form.setFieldsValue({
        ...selectedTicket,
        assignee: selectedTicket.assignee || null,
        categories: selectedTicket.categories.map(c => c.id),
        due_date: selectedTicket.due_date
          ? dayjs(selectedTicket.due_date)
          : null,
        meeting_time: selectedTicket.meeting_time
          ? dayjs(selectedTicket.meeting_time, "HH:mm:ss")
          : null,
      });
    }
  }, [form, selectedTicket]);

  const onFinish = async (values) => {
    try {
      console.log("Task Data:", values);
      console.log("PATCH categories:", values.categories);
      console.log(values.assignee);

      // const response1 = await axios.get(`http://127.0.0.1:8000/users/me`);
      // console.log(
      //   "Fetched the current loggedin user from Backend logic:",
      //   response1.data
      // );
      
      // const response2 = await axios.get(
      //   `http://127.0.0.1:8000/users/${values.assignee}`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`, // include token
      //     },
      //   }
      // );
      // console.log(response2.data);
      // console.log(response2.data.id);
      let assignee = null;
      if(values.assignee === initialAssignee) {
        assignee = values.assignee.id;
      } else {
        assignee = values.assignee;
      }
      const ticketDetails = {
        title: values.title,
        description: values.description,
        estimated_time: values.estimated_time,
        status: values.status,
        priority: values.priority,
        categories: values.categories,
        assignee: assignee || null,
        due_date: values.due_date?.format("YYYY-MM-DD"),
        meeting_time: values.meeting_time?.format("HH:mm:ss"),
      };

      console.log(ticketDetails);
      const token = localStorage.getItem("accessToken");
      if (!selectedTicket?.id) {
        message.error("Invalid ticket selected");
        return;
      }

      const editedTicket = await axios.patch(
        `http://127.0.0.1:8000/tickets/update/${selectedTicket.id}/`,
        ticketDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`, // include token
          },
        }
      );

      console.log("Updated in backend:", editedTicket);
      dispatch(updateTicket(editedTicket.data));
      form.resetFields();
      setOpen(false);
      message.success("Ticket Updated Successfully");
    } catch (error) {
      handleAxiosError(error);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <TicketFormItems />
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item className="flex justify-start mb-0">
            <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button onClick={handleReset}>Reset</Button>
              <Button type="primary" htmlType="submit">
                Save Changes
              </Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default EditTicketModal;
