// import { IoChevronBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import { TbEdit } from "react-icons/tb";
import CustomButton from "../../../utils/CustomButton";

// import { useGetAboutUsQuery } from "../../redux/features/setting/settingApi";
 // Importing Spin

const Customizable = () => {
 
  return (
    <section className="w-full h-full min-h-screen">
      <div className="flex justify-between items-center py-5">
        <div className="flex  items-center">
          {/* <Link to="/settings">
            <IoChevronBack className="text-2xl" />
          </Link> */}
          <h1 className="text-2xl font-semibold">Customizable Profiles</h1>
        </div>
        <Link to={"/welcomepage/edit-customizable"}>
          <CustomButton border>
            <TbEdit className="size-5"/>
            <span>Edit</span>
          </CustomButton>
        </Link>
      </div>
      <div>
        <p className="text-lg  text-black">
          {/* {about.content} */}
          Individual profiles for tracking personal schedules and preferences..
            <br />
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corporis, dignissimos blanditiis. Nulla, labore autem illo repellat voluptatum repellendus ex libero esse eum mollitia voluptatem unde hic amet perspiciatis nihil, dolor maiores. Alias facilis amet, perferendis qui laborum ratione, porro asperiores maiores ab sed pariatur. Nemo repudiandae eaque velit quas temporibus blanditiis illum, inventore sapiente expedita, nam atque corrupti magni labore laborum saepe quasi! Ipsum eveniet tempore veritatis beatae, cumque modi eligendi deserunt recusandae dolore quod quia, mollitia itaque sed, ab placeat praesentium consectetur accusamus
        </p>
      </div>
    </section>
  );
};

export default Customizable;
