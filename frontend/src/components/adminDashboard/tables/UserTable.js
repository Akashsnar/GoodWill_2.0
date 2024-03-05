// UserTable.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TableComponent from "./TableComponent";

// const customRows = [
//   {
//     name: "Rahul Sharma",
//     email: "rahulsharma789@gmail.com",
//     phone_number: "+9187654321",
//     date_of_birth: "05/12/1995",
//     gender: "Male",
//     donations: "₹800",
//   },
//   {
//     name: "Priya Patel",
//     email: "priyapatel456@gmail.com",
//     phone_number: "+9198765432",
//     date_of_birth: "02/28/1988",
//     gender: "Female",
//     donations: "₹1200",
//   },
//   {
//     name: "Amit Singh",
//     email: "amitsingh123@gmail.com",
//     phone_number: "+9176543210",
//     date_of_birth: "09/15/1990",
//     gender: "Male",
//     donations: "₹500",
//   },
//   {
//     name: "Ananya Gupta",
//     email: "ananyagupta789@gmail.com",
//     phone_number: "+9165432109",
//     date_of_birth: "11/03/1982",
//     gender: "Female",
//     donations: "₹1500",
//   },
//   {
//     name: "Vikas Kumar",
//     email: "vikaskumar234@gmail.com",
//     phone_number: "+9154321098",
//     date_of_birth: "07/19/1997",
//     gender: "Male",
//     donations: "₹300",
//   },
//   {
//     name: "Shreya Jain",
//     email: "shreyajain567@gmail.com",
//     phone_number: "+9143210987",
//     date_of_birth: "04/06/1985",
//     gender: "Female",
//     donations: "₹1800",
//   },
//   {
//     name: "Sandeep Verma",
//     email: "sandeepverma789@gmail.com",
//     phone_number: "+9132109876",
//     date_of_birth: "01/24/1993",
//     gender: "Male",
//     donations: "₹200",
//   },
//   {
//     name: "Neha Reddy",
//     email: "nehareddy123@gmail.com",
//     phone_number: "+9121098765",
//     date_of_birth: "06/09/1986",
//     gender: "Female",
//     donations: "₹1600",
//   },
//   {
//     name: "Rajesh Yadav",
//     email: "rajeshyadav456@gmail.com",
//     phone_number: "+9198765432",
//     date_of_birth: "10/18/1994",
//     gender: "Male",
//     donations: "₹700",
//   },
//   {
//     name: "Pooja Sharma",
//     email: "poojasharma789@gmail.com",
//     phone_number: "+9187654321",
//     date_of_birth: "03/14/1989",
//     gender: "Female",
//     donations: "₹1300",
//   },
//   {
//     name: "Arjun Patel",
//     email: "arjunpatel123@gmail.com",
//     phone_number: "+9176543210",
//     date_of_birth: "08/27/1991",
//     gender: "Male",
//     donations: "₹100",
//   },
//   {
//     name: "Deepika Singh",
//     email: "deepikasingh456@gmail.com",
//     phone_number: "+9165432109",
//     date_of_birth: "12/11/1983",
//     gender: "Female",
//     donations: "₹1400",
//   },
//   {
//     name: "Rahul Kumar",
//     email: "rahulkumar234@gmail.com",
//     phone_number: "+9154321098",
//     date_of_birth: "05/26/1998",
//     gender: "Male",
//     donations: "₹400",
//   },
//   {
//     name: "Anjali Gupta",
//     email: "anjaliGupta567@gmail.com",
//     phone_number: "+9143210987",
//     date_of_birth: "02/02/1984",
//     gender: "Female",
//     donations: "₹1700",
//   },
//   {
//     name: "Vivek Verma",
//     email: "vivekverma789@gmail.com",
//     phone_number: "+9132109876",
//     date_of_birth: "09/09/1992",
//     gender: "Male",
//     donations: "₹600",
//   },
//   {
//     name: "Ananya Reddy",
//     email: "ananyareddy123@gmail.com",
//     phone_number: "+9121098765",
//     date_of_birth: "04/15/1987",
//     gender: "Female",
//     donations: "₹1100",
//   },
//   {
//     name: "Prateek Yadav",
//     email: "prateekyadav456@gmail.com",
//     phone_number: "+9198765432",
//     date_of_birth: "11/30/1995",
//     gender: "Male",
//     donations: "₹900",
//   },
//   {
//     name: "Aishwarya Sharma",
//     email: "aishwaryasharma789@gmail.com",
//     phone_number: "+9187654321",
//     date_of_birth: "06/24/1990",
//     gender: "Female",
//     donations: "₹1900",
//   },
//   {
//     name: "Arun Patel",
//     email: "arunpatel123@gmail.com",
//     phone_number: "+9176543210",
//     date_of_birth: "01/08/1982",
//     gender: "Male",
//     donations: "₹50",
//   },
//   {
//     name: "Suman Singh",
//     email: "sumansingh456@gmail.com",
//     phone_number: "+9165432109",
//     date_of_birth: "07/02/1993",
//     gender: "Female",
//     donations: "₹1200",
//   },
//   {
//     name: "Vikram Verma",
//     email: "vikramverma234@gmail.com",
//     phone_number: "+9154321098",
//     date_of_birth: "03/17/1985",
//     gender: "Male",
//     donations: "₹700",
//   },
// ];

function UserTable() {
  const [customRowsX, setCustomRowsX] = useState([]);
  const [rows, setRows] = useState([]);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/userinfo"
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
  // const [rows, setRows] = React.useState(customRows);

  useEffect(() => {
    if (customRowsX.length > 0) {
      const newRows = [];
      for (let i = 0; i < customRowsX.length; i++) {
        const createdAtDate = new Date(customRowsX[i].createdAt);
      const updatedAtDate = new Date(customRowsX[i].updatedAt);
        newRows[i] = {
          id: customRowsX[i]._id,
          profilePic: customRowsX[i].profilePic,
          name: customRowsX[i].name,
          phone: customRowsX[i].phone,
          email: customRowsX[i].Email,
          dob: customRowsX[i].dob,
          createdAt: new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(createdAtDate),
          updatedAt: new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(updatedAtDate)
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
      const response = await fetch("http://localhost:4000/deleteUser", {
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
        showSidebar={true}
        props={{ heading: "Users" }}
        confirmDeleteIndex={confirmDeleteIndex}
        renderCell={(row, column) => {
          return row[column.id];
        }}
      />
    </>
  );
}

export default UserTable;
