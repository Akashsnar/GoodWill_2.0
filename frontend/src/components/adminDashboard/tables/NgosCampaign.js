// NGOsTable.js
import React, { useEffect, useState } from "react";
import TableComponent from "./TableComponent";

function NGOsCampaign() {
  const [customRowsX, setCustomRowsX] = useState([]);
  const [rows, setRows] = useState([]);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/sitedata/ngodetails"
        );
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
        // const createdAtDate = new Date(customRowsX[i].createdAt);
        // const updatedAtDate = new Date(customRowsX[i].updatedAt);
        newRows[i] = {
          id: customRowsX[i]._id,
          image: customRowsX[i].image,
          campagain_name: customRowsX[i].campagainname,
          desc: customRowsX[i].desc,
          category: customRowsX[i].category,
          goal: customRowsX[i].goal,
          raised: customRowsX[i].raised,
          // createdAt: new Intl.DateTimeFormat("en-US", {
          //   dateStyle: "medium",
          //   timeStyle: "short",
          // }).format(createdAtDate),
          // updatedAt: new Intl.DateTimeFormat("en-US", {
          //   dateStyle: "medium",
          //   timeStyle: "short",
          // }).format(updatedAtDate),
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
    const deleteId = rows[index].id;
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
    setConfirmDeleteIndex(() => handleConfirmDelete(deleteId));
  };

  const handleConfirmDelete = async (deleteId) => {
    try {
      const response = await fetch("http://localhost:4000/deleteNGO", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: deleteId }),
      });

      console.log("Server response:", response);

      if (!response.ok) {
        console.error("Server error:", response.statusText);
        throw new Error("Network response was not ok");
      }

      setRows((prevRows) => prevRows.filter((row) => row.id !== deleteId));
      setConfirmDeleteIndex(null);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      {/* {console.log(rows[0].id)} */}
      <TableComponent
        columns={customColumns}
        rows={rows}
        onDelete={handleDelete}
        props={{ heading: "NGOs' Campaign" }}
        showSidebar={true}
        confirmDeleteIndex={confirmDeleteIndex}
      />
    </>
  );
}

export default NGOsCampaign;
