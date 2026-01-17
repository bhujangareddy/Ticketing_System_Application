import { ExclamationCircleFilled } from "@ant-design/icons";
import { message, Modal } from "antd";
import axios from "axios";
import { handleAxiosError } from "./HandleAxiosError";
import { deleteTicket } from "../features/ticket/TicketSlice";
const { confirm } = Modal;

const handleDelete = async (id, dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    const { data } = await axios.delete(`http://127.0.0.1:8000/tickets/delete/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // include token
        },
      }
    );
    console.log(data.id);
    dispatch(deleteTicket({ id }));
    message.success("Ticket deleted successfully!");
  } catch (error) {
    handleAxiosError(error);
  }
};

const showDeleteConfirm = (record, dispatch) => {
  confirm({
    title: "Are you sure to delete the task?",
    icon: <ExclamationCircleFilled />,
    content: `${record.title}`,
    okText: "Yes",
    okType: "danger",
    cancelText: "No",
    onOk() {
      handleDelete(record.id, dispatch);
    },
    onCancel() {
      console.log("Cancel");
    },
  });
};

export { showDeleteConfirm, handleDelete };
