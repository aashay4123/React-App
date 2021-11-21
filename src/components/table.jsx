import Table from "rc-table";
import React from "react";
import "./table.css";

export default function table(props) {
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      className: "bslack",
    },
    {
      title: "Vaccination Status",
      dataIndex: "status",
      key: "Vaccination Status",
    },
  ];

  return (
    <Table
      columns={columns}
      data={props.data}
      rowClassName={(row) =>
        row.status === "Vaccine Done"
          ? "done borderTable"
          : "pending borderTable"
      }
      scroll={{ y: 300 }}
      rowKey={(row) => row.rowKey} // not working
      className="table"
    />
  );
}
