import React, { useState } from "react";
import { Button, Modal, message } from "antd";
import Login from "./Login";
import Register from "./Register";
import { useSelector, useDispatch } from "react-redux";
// import { showModal, closeModal } from "../features/antd/AntDSlice";
import { logout } from "../features/auth/AuthSlice";
import { useNavigate } from "react-router-dom";
import TicketForm from "./TicketForm";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState("");
  const isAuthenticated = useSelector((state) => state.Auth.isAuthenticated);
  const user = useSelector((state) => state.Auth.user);
  const role = useSelector((state) => state.Auth.role);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openModal = (formType) => {
    console.log(formType);
    if (formType == "Login") {
      setForm(<Login handleOk={handleOk} handleCancel={handleCancel} />);
    } else if (formType == "Register") {
      setForm(<Register handleOk={handleOk} handleCancel={handleCancel} />);
    } else if (formType == "Ticket") {
      setForm(<TicketForm handleOk={handleOk} handleCancel={handleCancel} />);
    } else {
      message.error("Something went wrong");
    }
    setOpen(true);
  };

  const handleOk = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(logout());
    console.log("Logout Successfull");
    navigate("/");
    message.success("Logout Successfull!");
  };

  return (
    <div className="header">
      <h2 className="text-xl font-semibold">Ticketing System</h2>
      {!isAuthenticated ? (
        <div className="flex gap-2">
          <Button onClick={() => openModal("Login")}>Login</Button>
          <Button type="primary" onClick={() => openModal("Register")}>
            Register
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-center items-center gap-2">
            {role === "Admin" && <Button
              color="primary"
              variant="solid"
              onClick={() => openModal("Ticket")}
            >
              Add Ticket
            </Button>}
            <Button
              color="danger"
              variant="solid"
              onClick={() => handleLogout()}
            >
              Logout
            </Button>
            <span className="border rounded-full px-2 py-1">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
        </>
      )}
      <Modal
        title="Ticketing System"
        open={open}
        onCancel={handleCancel}
        footer={null}
        destroyOnHidden
      >
        {form}
      </Modal>
    </div>
  );
};

export default Header;
