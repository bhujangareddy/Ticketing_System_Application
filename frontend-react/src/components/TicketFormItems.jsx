import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Radio,
  InputNumber,
  Checkbox,
  DatePicker,
  TimePicker,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { handleAxiosError } from "../utils/HandleAxiosError";
import {
  // namePattern,
  noConsecutiveSpaces,
  onlyLettersAndSpaces,
} from "../utils/constants";

import { runes } from "runes2";
import { useSelector } from "react-redux";
const { Option } = Select;

const TicketFormItems = ({ form }) => {
  const [users, setUsers] = useState([]);
  const user = useSelector((state) => state.Auth.user);
  const [categories, setCategories] = useState([]);

  // Fetches the categories data from API call in DB
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await axios.get(
          "http://127.0.0.1:8000/tickets/categories/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setCategories(
          res.data.map((cat) => ({
            label: cat.name, // what user sees
            value: cat.id, // what backend receives
          })),
        );
      } catch (error) {
        handleAxiosError(error);
      }
    };

    fetchData();
  }, []);

  console.log("Username: ->", user.username);

  const dueDate = Form.useWatch("dueDate", form);

  console.log("Line:", dueDate);

  // This arrow function disables the selection of passed time using duedate
  const disablePastTime = () => {
    if (!dueDate) return {};

    const isToday = dayjs(dueDate).isSame(dayjs(), "day");

    if (!isToday) return {};

    const currentHour = dayjs().hour();
    const currentMinute = dayjs().minute();

    return {
      disabledHours: () => Array.from({ length: currentHour }, (_, i) => i),

      disabledMinutes: (selectedHour) =>
        selectedHour === currentHour
          ? Array.from({ length: currentMinute }, (_, i) => i)
          : [],
    };
  };

  console.log(disablePastTime);

  const token = localStorage.getItem("accessToken");

  // This fetches the all registered users data from DB using API call 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res2 = await axios.get(`http://127.0.0.1:8000/users/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res2.data);
        setUsers(res2.data);
      } catch (error) {
        handleAxiosError(error);
      }
    };

    fetchUsers();
  }, [token]);

  return (
    <>
      <p className="font-semibold text-red-400">
        Controller input label with Asterisk(*) are must required
      </p>

      {/* Title */}
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="title"
            label="Title:"
            rules={[
              {
                required: true,
                message: "Please enter the title",
              },
              {
                validator: (_, value) => {
                  const trimmed = value?.trim() || "";

                  if (!trimmed) {
                    return Promise.reject("");
                  } else if (trimmed.length < 3) {
                    return Promise.reject(
                      "Title must contain at least 3 characters",
                    );
                  } else if (trimmed.length > 25) {
                    return Promise.reject(
                      "Title must not exceed more than 25 characters",
                    );
                  } else if (!onlyLettersAndSpaces.test(trimmed)) {
                    return Promise.reject(
                      "Title must not contain special symbols, numbers, or emojis",
                    );
                  } else if (noConsecutiveSpaces.test(trimmed)) {
                    return Promise.reject(
                      "Title must not contain consecutive spaces",
                    );
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <Input
              placeholder="Enter the title"
              // This 'count' prop value(object) does not allow the user to enter more than 25 characters in the normal text input field
              // And it even provide better user experience by providing real time update on how many characters were already entered by the user
              // Ex: Nani 4/25(i.e., strategy/max)
              count={{
                show: true, // here, show key have true as its boolean value, that means the count value(Ex: 4/25) is shown at the right end of the current input field
                max: 25,
                strategy: (txt) => runes(txt).length,
                exceedFormatter: (txt, { max }) =>
                  runes(txt).slice(0, max).join(""),
              }}
              // defaultValue="🔥 emoji"
              // console.log("🔥".length); // this prints - 2
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          {/* <Form.Item
            name="status"
            label="Status:"
            // rules={[
            //   {
            //     required: true,
            //     message: "Please select the status",
            //   },
            // ]}
          >
            <Radio.Group
              block
              options={[
                { value: "ToDo", label: "ToDo" },
                { value: "InProgress", label: "InProgress" },
                { value: "Done", label: "Done" },
              ]}
              optionType="button"
              // defaultValue={"ToDo"}
            />
          </Form.Item> */}
          <Form.Item
            name="status"
            label="Status:"
            // rules={[{ required: true, message: "Please choose the priority" }]}
          >
            <Select placeholder="Select status">
              <Option value="ToDo">ToDo</Option>
              <Option value="InProgress">InProgress</Option>
              <Option value="Done">Done</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {/* Description using TextArea */}
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="description"
            label="Description:"
            rules={[
              // {
              //   required: true,
              //   message: "Please enter the description",
              // },
              {
                validator: (_, value) => {
                  const trimmed = value?.trim() || "";

                  if (!trimmed || trimmed.length === 0) {
                    return Promise.resolve();
                  } else if (!onlyLettersAndSpaces.test(trimmed)) {
                    return Promise.reject(
                      "Description must not contain special symbols, numbers or emojis",
                    );
                  } else if (noConsecutiveSpaces.test(trimmed)) {
                    return Promise.reject(
                      "Description must not contain consecutive spaces",
                    );
                  }
                  // else if (trimmed.length < 10) {
                  //   return Promise.reject(
                  //     "Description must contain atleast 10 characters"
                  //   );
                  // }
                  else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter the description"
              count={{
                show: true,
                max: 100,
                strategy: (txt) => runes(txt).length,
                exceedFormatter: (txt, { max }) =>
                  runes(txt).slice(0, max).join(""),
              }}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Priority using Select Dropdown */}
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="priority"
            label="Priority:"
            // rules={[{ required: true, message: "Please choose the priority" }]}
          >
            <Select placeholder="Select priority">
              <Option value="Low">Low</Option>
              <Option value="Medium">Medium</Option>
              <Option value="High">High</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name="estimated_time"
            label="Estimated Time(in hrs):"
            rules={[
              // {
              //   required: true,
              //   message: "Please enter the estimated time",
              // },
              {
                validator: (_, value) => {
                  // console.log(value);
                  // console.log(typeof value);
                  if (value < 0) {
                    return Promise.reject("Estimated time cannot be negative");
                  } else if (value > 40) {
                    return Promise.reject(
                      "Estimated time cannot be more than 40 hours",
                    );
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <InputNumber
              placeholder="Enter the time in hours"
              style={{ width: 230 }}
              // defaultValue={null}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Categories using Select Dropdown with multiple selection */}
      <Row gutter={16}>
        <Col span={24}>
          {/* CheckBoxes for categories Selection */}
          {/* <Form.Item
            label="Categories:"
            name="categories"
            rules={[
              {
                required: true,
                message: "Please select at least one category",
              },
              {
                validator: (_, value = []) => {
                  if (value.length > 3) {
                    return Promise.reject(
                      "Please select any 3 categories only"
                    );
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <Checkbox.Group style={{ width: "100%" }}>
              {categories?.map((category) => (
                <Checkbox key={category.id} value={category.id}>
                  {category.name}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item> */}
          <Form.Item
            name="categories"
            label="Categories:"
            rules={[
              {
                required: true,
                message: "Please select at least one category",
              },
              {
                validator: (_, value = []) => {
                  if (value.length > 3) {
                    return Promise.reject(
                      new Error("Select at most 3 categories"),
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="Select the categories"
              options={categories}
            />
          </Form.Item>
        </Col>
      </Row>

      {/* Assignee using Select Dropdown with search functionality */}
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="assignee"
            label="Assignee:"
            // rules={[{ required: true, message: "Please select the assignee" }]}
          >
            <Select
              showSearch={{ optionFilterProp: "value" }}
              placeholder="Choose the assignee"
              style={{ width: 230 }}
            >
              {users.map((user) => (
                <Select.Option key={user.id} value={user.id}>
                  {user.username}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* Reporter is the current User which is read only */}
        <Col xs={24} sm={12}>
          <Form.Item
            name="reporter"
            label="Reporter:"
            // rules={[{ required: true, message: "Please select the reporter" }]}
          >
            <Input readOnly disabled />
          </Form.Item>
        </Col>
      </Row>

      {/* DueDate using DatePicker that avoid selecting passed date */}
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            name="due_date"
            label="Due Date:"
            // rules={[{ required: true, message: "Please select the due date" }]}
          >
            <DatePicker
              className="w-full"
              needConfirm
              // This disables the passed date selection
              disabledDate={(current) =>
                current &&
                current.startOf("day").isBefore(dayjs().startOf("day"))
              }
            />
          </Form.Item>
        </Col>

        {/* Meeting time can only be choosen after five hours from current time  */}
        <Col xs={24} sm={12}>
          <Form.Item
            name="meeting_time"
            label="Meeting Time:"
            rules={[
              {
                validator: (_, value) => {
                  // If no value selected, skip validation
                  if (!value) return Promise.resolve();

                  const now = dayjs();

                  // Must be at least 5 hours later
                  if (value.diff(now, "hour") < 5) {
                    return Promise.reject(
                      "Meeting should be scheduled at least after 5 hours",
                    );
                  }

                  // Past hour
                  if (value.hour() < now.hour()) {
                    return Promise.reject("You cannot select a past hour");
                  }

                  // Same hour, past minute
                  if (
                    value.hour() === now.hour() &&
                    value.minute() < now.minute()
                  ) {
                    return Promise.reject("You cannot select a past minute");
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <TimePicker
              needConfirm
              className="w-full"
              disabledTime={disablePastTime}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default TicketFormItems;
