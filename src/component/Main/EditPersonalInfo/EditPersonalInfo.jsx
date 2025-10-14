import { Form } from "antd";
import { useEffect, useRef, useState } from "react";
import { IoCameraOutline, IoChevronBack } from "react-icons/io5";
import { RiEdit2Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { imageBaseUrl } from "../../../config/imageBaseUrl";
import { updateUser } from "../../../redux/features/auth/authSlice";
//import { useUpdateUserMutation } from "../../../redux/features/profile/profileApi";
import CustomButton from "../../../utils/CustomButton";
import CustomInput from "../../../utils/CustomInput";

const EditInformation = () => {
  const { user } = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
 // const [updateProfileInfo, { isLoading }] = useUpdateUserMutation();

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(
    user?.image ? `${imageBaseUrl}${user.image}` : null
  );
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user?.name,
        email: user?.email,
        phone: user?.phone,
      });
    }
  }, [user, form]);

  const handleImageChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setImageFile(file); // Store file to send on update
      setImageUrl(newImageUrl); // Show preview
    }
  };

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Open file dialog
    }
  };

  const onFinish = async (values) => {
    const formdata = new FormData();
    formdata.append("name", values.fullName); // Ensure correct field name
    formdata.append("phone", values.phone); // Phone field update

    // Only append email if it's allowed to be updated
    if (imageFile) {
      formdata.append("image", imageFile); // Add image if updated
    }

    try {
      const response = await updateProfileInfo(formdata);
      if (response.error) {
        toast.error(response.error.data.message);
      }
      if (response.data) {
        dispatch(updateUser({ user: response?.data?.attributes }));
        toast.success("Profile updated successfully!");
        navigate("/personal-info");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong while updating your profile.");
    }
  };

  return (
    <div className="w-full">
      {/* Back Button and Title */}
      <div className="flex justify-between items-center">
        <div className="flex  items-center my-6">
          <Link to="/personal-info">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-semibold">Edit Information</h1>
        </div>
      </div>

      {/* Profile Information */}
      <div className="w-[70%] mx-auto h-full grid grid-cols-1">
        {/* Profile Picture */}
        <div className="w-full h-full mt-10  flex justify-start items-center">
          <div
            className="relative cursor-pointer w-32 h-32"
            onClick={handleDivClick}
          >
            {imageUrl ? (
              <img
                className="rounded-full w-full h-full object-cover"
                src={imageUrl}
                alt="Profile Preview"
              />
            ) : (
              <div className="bg-[#c6dadc] p-2 text-white flex flex-col items-center rounded-full w-full h-full">
                <IoCameraOutline size={40} />
                <span>Upload Image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-sm text-center">Change Image</p>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: "none" }}
          />
          <div className="ml-5 flex items-center justify-between">
            <div className="text-white -ml-8 mr-5 z-10 bg-[#FFD400] rounded-full p-1">
              <RiEdit2Line size={20} />
            </div>
            <div>
              <h1 className="mt-2 font-semibold text-3xl">{user.name}</h1>
              <h1 className="text-lg  uppercase">{user?.role}</h1>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="w-full  mt-10"
        >
          {/* Full Name */}
          <Form.Item label="Full Name" name="fullName">
            <CustomInput placeholder="Enter your full name" />
          </Form.Item>

          {/* Email */}
          <Form.Item label="Email" name="email">
            <CustomInput
              placeholder="Enter your email"
              className="readOnly"
              readOnly
            />
          </Form.Item>

          {/* Phone Number */}
          <Form.Item label="Phone Number" name="phone">
            <CustomInput type="tel" placeholder="Enter your phone number" />
          </Form.Item>

          {/* Submit Button */}
          <CustomButton
            loading={isLoading}
            className="w-full text-white font-semibold"
          >
            Save & Change
          </CustomButton>
        </Form>
      </div>
    </div>
  );
};

export default EditInformation;
