// EventTable.js
import React, { useEffect, useState } from "react";
import TableComponent from "./TableComponent";

function EventTable() {
  const [customRowsX, setCustomRowsX] = useState([]);
  const [rows, setRows] = useState([]);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/eventsData"
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
        const createdAtDate = new Date(customRowsX[i].createdAt);
        const updatedAtDate = new Date(customRowsX[i].updatedAt);
        newRows[i] = {
          id: customRowsX[i]._id,
          NgoName: customRowsX[i].NgoName,
          campaign_name: customRowsX[i].campaignName,
          Event_Name: customRowsX[i].EventName,
          Location: customRowsX[i].Location,
          Description: customRowsX[i].Description,
          Duration: customRowsX[i].Duration,
          // DateRange: customRowsX[i].DateRange,
          createdAt: new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(createdAtDate),
          updatedAt: new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(updatedAtDate),
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
      const response = await fetch("http://localhost:4000/deleteEvent", {
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
        props={{ heading: "NGOs' Events" }}
        showSidebar={true}
        confirmDeleteIndex={confirmDeleteIndex}
      />
    </>
  );
}

export default EventTable;
