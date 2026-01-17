import { message, App } from "antd";


const extractErrorMessage = (data) => {
  if (typeof data === "string") return data;

  if (data?.detail) return data.detail;

  if (typeof data === "object") {
    return Object.values(data)
      .flat()
      .join(", ");
  }

  return "Something went wrong!";
};


// name started with small letter because it is a normal arrow function not a component
export const handleAxiosError = (error) => {
  if (error.response) {
    const { status, data } = error.response;

    const errorMessage = extractErrorMessage(data);

    switch (status) {
      case 400:
        message.error(errorMessage);
        break;
      case 401:
        message.error(errorMessage || "Unauthorized Access!");
        break;
      case 403:
        message.error(errorMessage || "Forbidden!");
        break;
      case 404:
        message.error(errorMessage || "Resource not found!");
        break;
      case 500:
        message.error("Internal Server Error. Please try again later!");
        break;
      default:
        message.error("Something went wrong on the server!");
    }
  } else if (error.request) {
    message.error(
      "Could not connect to the server. Please check your network connection."
    );
  } else {
    message.error("An unexpected error occurred. Please try again.");
  }
};

