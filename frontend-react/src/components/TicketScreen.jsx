import { Button, Space, Table, Tag, Empty, Drawer, Modal, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import EditTicketModal from "../components/EditTicketModal";
// import { useMediaQuery } from "react-responsive";
import { fetchTickets } from "../features/ticket/TicketSlice";
import { showDeleteConfirm } from "../utils/delete";
import dayjs from "dayjs";

// This renders the duedate in table with proper style and structure
const renderDateTime = (value) => {
  if (!value) return "—";

  const date = dayjs(value);

  return (
    <Tooltip title={date.format("YYYY-MM-DD HH:mm:ss")}>
      <div style={{ lineHeight: 1.3 }}>
        <div style={{ fontWeight: 500 }}>
          {date.format("DD MMM YYYY")}
        </div>
        <div style={{ fontSize: 12, color: "#8c8c8c" }}>
          {date.format("hh:mm A")}
        </div>
      </div>
    </Tooltip>
  );
};

const TicketScreen = () => {
  const role = useSelector((state) => state.Auth.role);
  console.log(role);
  const username = useSelector((state) => state.Auth.user.username);
  const { tickets, loading, error } = useSelector((state) => state.Tickets);
  //   const isMobile = useMediaQuery({ maxWidth: 768 });
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  console.log(tickets);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      className: "text-blue-500"
    },
    // {
    //   title: "Description",
    //   dataIndex: "description",
    //   key: "description",
    // },
    {
      title: "Category",
      dataIndex: "categories",
      key: "categories",
      // renders each category with its style 
      render: (categories = []) => (
        <>
          {categories.map((category) => {
            let color = "grey";

            switch (category.name) {
              case "Bug":
                color = "red";
                break;
              case "Frontend":
                color = "green";
                break;
              case "Backend":
                color = "purple";
                break;
              case "Database":
                color = "orange";
                break;
              case "Testing":
                color = "cyan";
                break;
            }

            return (
              <Tag color={color} key={category.id}>
                {category.name}
              </Tag>  
            );
          })}
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      // renders the status with its style
      render: (status) => {
        let defaultStyle = "text-center border rounded p-2";
        let style = "";

        if(status === "ToDo") {
          style = "text-red-500";
        } else if( status === "InProgress") {
          style= "text-yellow-500";
        } else {
          style = "text-green-500";
        }
        return <span className={`${style} ${defaultStyle}`}>{status}</span>
      }
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      // renders the priority with its style
      render: (priority) => {
        let defaultStyle = "font-semibold";
        let style = "";

        if(priority === "Low") {
          style = "text-green-500";
        } else if( priority === "Medium") {
          style= "text-yellow-500";
        } else {
          style = "text-red-500";
        }
        return <span className={`${style} ${defaultStyle}`}>{priority}</span>
      }
    },
    // If the role is Admin, then only the assignee column is displayed in the table
    ...(role === "Admin"
      ? [
          {
            title: "Assignee",
            dataIndex: "assignee",
            key: "assignee",
            render: (assignee) => assignee || "—",
          },
        ]
      : []
    ),
    // If the role is User, then only the reporter column is displayed in the table
    ...(role === "User"
      ? [
        {
          title: "Reporter",
          dataIndex: "reporter",
          key: "reporter",
          render: (reporter) => reporter || "—",
        },
      ]
      : []
    ),
    // Estimated time in hrs
    {
      title: "Estimated Time",
      dataIndex: "estimated_time",
      key: "estimated_time",
      render: (estimated_time) => {
        if(estimated_time) {
          return estimated_time + " Hrs";
        } else {
          return "—";
        }
      },
    },
    // Due date with a format and style
    {
      title: "Due Date",
      dataIndex: "due_date",
      key: "due_date",
      render: (due_date) => {
        if(due_date) {
          const date = dayjs(due_date);
          return <div className="font-semibold">{date.format("DD MMM YYYY")}</div>
        } else {
          {return  "—"}
        }
      }
    },
    // Created At
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: renderDateTime,
    },
    // Updated At
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: renderDateTime,
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <Button
    //         onClick={() => showModal(record)}
    //         color="primary"
    //         variant="solid"
    //       >
    //         Edit
    //       </Button>
    //       <Button
    //         color="danger"
    //         variant="solid"
    //         onClick={() => showDeleteConfirm(record, dispatch)}
    //       >
    //         Delete
    //       </Button>
    //     </Space>
    //   ),
    // },
    // If the role is Admin, then only the action with edit and delete buttons are displayed
    ...(role === "Admin"
      ? [
          {
            title: "Action",
            key: "action",
            render: (_, record) => (
              <Space size="middle">
                <Button onClick={() => showModal(record)} color="primary" variant="solid">
                  Edit
                </Button>
                <Button
                  color="danger"
                  variant="solid"
                  onClick={() => showDeleteConfirm(record, dispatch)}
                >
                  Delete
                </Button>
              </Space>
            ),
          },
        ]
      : []),
  ];

  // Fetch tasks using Redux
  useEffect(() => {
    if (username) {
      dispatch(fetchTickets(username));
    }
  }, [username, dispatch]);

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error}</div>;

  const showModal = (record) => {
    setSelectedTicket(record);
    setOpen(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="m-4 text-center">
        <h1 className="text-xl font-semibold my-2">
          Welcome to Ticketing System
        </h1>
        <p className="mb-4">
          Stay organized, stay productive — manage your tickets effortlessly
          with Ticket Management System
        </p>

        <Table
          bordered
          columns={columns}
          dataSource={tickets}
          rowKey="id"
          pagination={{
            pageSize: 5, // show only 5 rows per page
            placement: ["bottomRight"], // pagination on right side
            showSizeChanger: false, // remove page size dropdown
            // showQuickJumper: true,       // allows jumping to page 2, 3 etc
          }}
        />
        <Modal
          title="Edit Ticket"
          open={open}
          onCancel={handleCancel}
          footer={null}
          destroyOnHidden
        >
          {selectedTicket && (
            <EditTicketModal
              selectedTicket={selectedTicket}
              setOpen={setOpen}
            />
          )}
        </Modal>
      </div>
    </>
  );
};

export default TicketScreen;
