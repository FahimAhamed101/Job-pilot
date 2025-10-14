import { Form } from "antd";
import { useEffect } from "react";
import { IoChevronBack } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { imageBaseUrl } from "../../../config/imageBaseUrl";
import CustomInput from "../../../utils/CustomInput";

const PersonalInformation = () => {
  const { user } = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user, form]);
  return (
    <div className="w-full">
      {/* Back Button and Title */}
      <div className="flex justify-between items-center">
        <div className="flex  items-center my-6">
          <Link to="/settings">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-semibold">Personal Information</h1>
        </div>
      </div>

      {/* Profile Information */}
      <div className="w-[70%] mx-auto h-full grid grid-cols-1">
        {/* Profile Picture */}
        <div className="w-full h-full mt-10  flex justify-start items-center">
          <img
            className="size-32 rounded-full "
            src={`${imageBaseUrl}${user?.image}`}
            alt=""
          />
          <div className="ml-5">
            <h1 className="mt-2 text-gray-500">{user.name}</h1>
            <h1 className="text-lg font-semibold uppercase">{user?.role}</h1>
          </div>
        </div>

        {/* Personal Details */}
        <Form form={form} layout="vertical" className="w-full mt-10">
          {/* Full Name */}
          <Form.Item label="Full Name" name="fullName">
            <CustomInput placeholder={user.name} readOnly />
          </Form.Item>

          {/* Email */}
          <Form.Item label="Email" name="email">
            <CustomInput placeholder="Enter your email" readOnly />
          </Form.Item>

          {/* Phone Number */}
          <Form.Item label="Phone Number" name="phone">
            <CustomInput
              type="number"
              placeholder="Enter your phone number"
              readOnly
            />
          </Form.Item>
          <Link to="/edit-personal-info">
            <button className="w-full px-8 py-3 bg-[#AB7843] text-white font-semibold rounded-lg">
              Edit Profile
            </button>
          </Link>
        </Form>
      </div>
    </div>
  );
};

export default PersonalInformation;
