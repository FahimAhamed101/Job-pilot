import { Table } from "antd";
import { Link } from "react-router-dom";
import { useGetAllReportsQuery } from "../../../redux/features/report/report";

const ReportList = () => {
  const { data: reports } = useGetAllReportsQuery();

  console.log(reports);

  const columns = [
    {
      title: "#SL",
      key: "sl",
      render: (_, __, index) => index + 1, // Dynamically render the serial number (1, 2, 3, ...)
    },
    { title: "User", dataIndex: ["author", "name"], key: "user" }, // Author's name
    {
      title: "Report User",
      dataIndex: ["reportBy", "name"],
      key: "reportUser",
    }, // ReportBy's name
    { title: "Report Name", dataIndex: "title", key: "reportName" },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      render: (text) => new Date(text).toLocaleString(),
    }, // Formatting date
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Link to={`/report-details/${record._id}`}> View Details </Link> // Adjust action as needed
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Report List</h2>
      </div>

      <Table
        dataSource={reports}
        columns={columns}
        rowKey="_id" // Unique key for each report
      />
    </div>
  );
};

export default ReportList;
