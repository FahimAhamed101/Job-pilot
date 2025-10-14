import { Spin } from "antd";
import { IoChevronBack } from "react-icons/io5";
import { TbEdit } from "react-icons/tb";
import { Link } from "react-router-dom";
import { useGetAboutUsQuery } from "../../redux/features/setting/settingApi"; // Import the hook
import CustomButton from "../../utils/CustomButton";
import decodeHtmlEntities from "../../utils/decodeHtmlEntities";

const AboutUsPage = () => {
  const { data, isLoading, isError } = useGetAboutUsQuery();

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <Spin />
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-120px)]">
        <p className="text-lg text-red-500">Failed to load About Us content</p>
      </div>
    );
  }

  const aboutContent = data?.content;

  return (
    <section className="w-full h-full min-h-screen">
      <div className="flex justify-between items-center py-5">
        <div className="flex items-center">
          <Link to="/settings">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-semibold">About Us</h1>
        </div>
        <Link to={"/settings/edit-about-us/11"}>
          <CustomButton border>
            <TbEdit className="size-5 text-white" />
            <span className="text-white">Edit</span>
          </CustomButton>
        </Link>
      </div>

      <div>
        {/* Display the About Us content */}
        {aboutContent ? (
          <p
            className="text-lg px-5 text-black"
            dangerouslySetInnerHTML={{
              __html: decodeHtmlEntities(aboutContent),
            }}
          />
        ) : (
          <p className="text-lg px-5 text-black">
            No content available for About Us.
          </p>
        )}
      </div>
    </section>
  );
};

export default AboutUsPage;
