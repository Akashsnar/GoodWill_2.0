// NGOsTable.js
import React, { useEffect, useState } from "react";
import TableComponent from "./TableComponent";

function NGOsTable() {
  const [customRowsX, setCustomRowsX] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/sitedata/ngosc");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setCustomRowsX(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (customRowsX.length > 0) {
      const newRows = [];
      for (let i = 0; i < customRowsX.length; i++) {
        newRows[i] = {
          id: customRowsX[i]._id,
          name: customRowsX[i].name,
          desc: customRowsX[i].desc,
          category: customRowsX[i].category,
          goal: customRowsX[i].goal,
          raised: customRowsX[i].raised,
        };
      }
      setRows(newRows);
    }
  }, [customRowsX]);

  const customColumns = Object.keys(rows[0] || {}).map((key) => ({
    id: key,
    label: key
      .replace(/_/g, " ")
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()),
    minWidth: 100,
  }));

  const handleDelete = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  return (
    <>
      {/* {console.log(customRowsX[0])} */}
      <TableComponent
        columns={customColumns}
        rows={rows}
        onDelete={handleDelete}
        props={{ heading: "NGOs" }}
      />
    </>
  );
}

export default NGOsTable;
