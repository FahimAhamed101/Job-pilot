import {  useState } from "react";
import { ConfigProvider, Table, Form, Input, Modal } from "antd";
import moment from "moment";
// import { useGetAllUsersQuery } from "../../../redux/features/user/userApi";
import { IoIosSearch } from "react-icons/io";
import { FaAngleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AiFillEye } from "react-icons/ai";

const { Item } = Form;

const ContributionAll = () => {
  // const [searchText, setSearchText] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  // const [params] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // State to hold the selected user data
  const [isModalViewOpen, setIsModalViewOpen] = useState(false);

  // const { data, isFetching, isError, error } = useGetAllUsersQuery(params);

  const [allUsers,] = useState([
    {
      id: 1,
      accountID: 2010,
      displayName: "John Doe",
      email: "johndoe@example.com",
      address_line1: "123 Main St, Springfield",
      image: { url: "https://randomuser.me/api/portraits/men/1.jpg" },
      phone: "123-456-7890",
      createdAt: "2024-01-01T10:00:00",
      status: "Only Registered",
    },
    {
      id: 2,
      accountID: 2011,
      displayName: "Jane Smith",
      email: "janesmith@example.com",
      address_line1: "456 Oak Ave, Springfield",
      image: { url: "https://randomuser.me/api/portraits/women/1.jpg" },
      phone: "234-567-8901",
      createdAt: "2024-02-01T11:00:00",
      status: "Subscriber",
    },
    {
      id: 3,
      accountID: 2012,
      displayName: "Alice Johnson",
      email: "alicejohnson@example.com",
      address_line1: "789 Pine St, Springfield",
      image: { url: "https://randomuser.me/api/portraits/women/2.jpg" },
      phone: "345-678-9012",
      createdAt: "2024-03-01T12:00:00",
      status: "Only Registered",
    },
    {
      id: 4,
      accountID: 2013,
      displayName: "Bob Brown",
      email: "bobbrown@example.com",
      address_line1: "101 Maple Dr, Springfield",
      image: { url: "https://randomuser.me/api/portraits/men/2.jpg" },
      phone: "456-789-0123",
      createdAt: "2024-04-01T13:00:00",
      status: "Subscriber",
    },
    {
      id: 5,
      accountID: 2014,
      displayName: "Charlie Davis",
      email: "charliedavis@example.com",
      address_line1: "202 Birch Rd, Springfield",
      image: { url: "https://randomuser.me/api/portraits/men/3.jpg" },
      phone: "567-890-1234",
      createdAt: "2024-05-01T14:00:00",
      status: "Only Registered",
    },
  ]);
  
  const dataSource = allUsers.map((user, index) => ({
    id: user.id,
    si: index + 1,
    displayName: user.displayName,
    accountID: user.accountID,
    email: user.email,
    phone: user.phone,
    address_line1: user.address_line1,
    createdAt: user.createdAt,
    imageUrl: user.image.url,
    status: user.status,
  }));

  const handleView = (record) => {
    setSelectedUser(record); // Set the selected user data
    setIsModalViewOpen(true); // Open the modal
  };

  const columns = [
    {
      title: "#SI",
      dataIndex: "si",
      key: "si",
      sorter: (a, b) => a.si - b.si,
    },
    {
      title: "Account ID",
      dataIndex: "accountID",
      key: "accountID",
      sorter: (a, b) => a.accountID - b.accountID,
      render: (_, record) => <span>{record.accountID || "N/A"}</span>,
    },
    {
      title: "User Image",
      dataIndex: "userimage",
      key: "userimage",
      render: (_, record) => (
        <img
          src={record.imageUrl || "https://via.placeholder.com/50"}
          alt="Profile"
          className="w-8 h-8 rounded-full mr-2"
        />
      ),
    },
    {
      title: "Display Name",
      dataIndex: "displayName",
      key: "displayName",
      sorter: (a, b) => a.displayName?.localeCompare(b.displayName),
      render: (text) => text || "N/A",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email?.localeCompare(b.email),
      render: (text) => text || "N/A",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
      sorter: (a, b) => a.phone?.localeCompare(b.phone),
      render: (text) => text || "N/A",
    },
    {
      title: "Applied Date Time",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      render: (date) => (date ? moment(date).format("DD MMM YYYY") : "N/A"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <AiFillEye
          onClick={() => handleView(record)}
          style={{ fontSize: "18px", cursor: "pointer" }}
          className="text-[#85594B]"
        />
      ),
    },
  ];

  return (
    <section>
      <div className="md:flex justify-between items-center py-5">
        <Link to={`/allevent/view-item/1`}>
          <div className="text-xl font-semibold pb-3 flex items-center">
            <FaAngleLeft /> Contribution All
          </div>
        </Link>
        <Form layout="inline" className="flex">
          <Item name="username">
            <Input
              className="rounded-lg w-[60%] md:w-full border border-[#4C7E95]"
              placeholder="Search box"
              
            />
          </Item>
          <Item>
            <button className="size-8 rounded-full flex justify-center items-center bg-[#4C7E95] text-white">
              <IoIosSearch className="size-5" />
            </button>
          </Item>
        </Form>
      </div>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#85594B",
              headerColor: "#FFFFFF",
              headerBorderRadius: 5,
            },
          },
        }}
      >
        <Table
          pagination={{
            position: ["bottomCenter"],
            current: currentPage,
            onChange: setCurrentPage,
            pageSize: 4,
          }}
          scroll={{ x: "max-content" }}
          responsive
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
        />
      </ConfigProvider>

      {/* Modal for user details */}
      <Modal
        open={isModalViewOpen}
        onOk={() => setIsModalViewOpen(false)}
        onCancel={() => setIsModalViewOpen(false)}
        footer={null}
        centered
      >
        {selectedUser && (
          <div className="text-black bg-primary p-5">
            <div className="flex items-center mb-4">
              <img
                className="size-24 rounded-full"
                src={selectedUser.imageUrl || "https://via.placeholder.com/50"}
                alt="Profile"
              />
              <h1 className="text-2xl font-semibold ml-5">User Details</h1>
            </div>
            <div className="flex justify-between py-2 border-b">
              <p>Account ID:</p>
              <p>{selectedUser.accountID || "N/A"}</p>
            </div>
            <div className="flex justify-between py-2 border-b">
              <p>Display Name:</p>
              <p>{selectedUser.displayName || "N/A"}</p>
            </div>
            <div className="flex justify-between py-2 border-b">
              <p>Email:</p>
              <p>{selectedUser.email || "N/A"}</p>
            </div>
            <div className="flex justify-between py-2 border-b">
              <p>Phone Number:</p>
              <p>{selectedUser.phone || "N/A"}</p>
            </div>
            <div className="flex justify-between py-2 border-b">
              <p>Location:</p>
              <p>{selectedUser.address_line1 || "N/A"}</p>
            </div>
            <div className="flex justify-between py-2 border-b">
              <p>Joining Date:</p>
              <p>
                {selectedUser.createdAt
                  ? moment(selectedUser.createdAt).format("DD MMM YYYY")
                  : "N/A"}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default ContributionAll;
