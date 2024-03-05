// GraphTable.js
import React, { useEffect, useState } from "react";
import TableComponent from "./TableComponent";

// const customRows = [
//     {
//         name: "Aarav",
//         NGOs_Name: "FoodForAll",
//         Donation_Amount: "₹400",
//         date: "2022-09-18 09:45:00",
//     },
//     {
//         name: "Advait",
//         NGOs_Name: "Worknite",
//         Donation_Amount: "₹300",
//         date: "2022-09-08 11:30:00",
//     },
//     {
//         name: "Diya",
//         NGOs_Name: "FoodForAll",
//         Donation_Amount: "₹1200",
//         date: "2022-10-14 14:05:00",
//     },
//     {
//         name: "Vivaan",
//         NGOs_Name: "childCare",
//         Donation_Amount: "₹300",
//         date: "2022-10-27 08:22:00",
//     },
//     {
//         name: "Harsh",
//         NGOs_Name: "Worknite",
//         Donation_Amount: "₹1200",
//         date: "2022-11-19 18:48:00",
//     },
//     {
//         name: "Harshit",
//         NGOs_Name: "Worknite",
//         Donation_Amount: "₹1200",
//         date: "2022-12-09 18:48:00",
//     },
//     {
//         name: "Aryan",
//         NGOs_Name: "FoodForAll",
//         Donation_Amount: "₹1000",
//         date: "2023-01-23 23:15:00",
//     },
//     {
//         name: "Anvi",
//         NGOs_Name: "childCare",
//         Donation_Amount: "₹500",
//         date: "2023-01-01 05:37:00",
//     },
//     {
//         name: "Kabir",
//         NGOs_Name: "Worknite",
//         Donation_Amount: "₹1100",
//         date: "2023-02-14 13:10:00",
//     },
//     {
//         name: "Amaira",
//         NGOs_Name: "FoodForAll",
//         Donation_Amount: "₹100",
//         date: "2023-03-29 20:55:00",
//     },
//     {
//         name: "Aadi",
//         NGOs_Name: "childCare",
//         Donation_Amount: "₹600",
//         date: "2023-03-06 04:27:00",
//     },
//     {
//         name: "Aradhya",
//         NGOs_Name: "Worknite",
//         Donation_Amount: "₹1600",
//         date: "2023-04-10 10:40:00",
//     },
//     {
//         name: "Vihaan",
//         NGOs_Name: "FoodForAll",
//         Donation_Amount: "₹1900",
//         date: "2023-04-25 15:18:00",
//     },
//     {
//         name: "Mira",
//         NGOs_Name: "childCare",
//         Donation_Amount: "₹2000",
//         date: "2023-04-03 21:45:00",
//     },
//     {
//         name: "Yuvan",
//         NGOs_Name: "Worknite",
//         Donation_Amount: "₹2200",
//         date: "2023-05-17 07:03:00",
//     },
//     {
//         name: "Zara",
//         NGOs_Name: "FoodForAll",
//         Donation_Amount: "₹1200",
//         date: "2023-06-07 08:15:00",
//     },
//     {
//         name: "Aarush",
//         NGOs_Name: "childCare",
//         Donation_Amount: "₹1500",
//         date: "2023-07-11 17:40:00",
//     },
//     {
//         name: "Myra",
//         NGOs_Name: "Worknite",
//         Donation_Amount: "₹1800",
//         date: "2023-08-28 12:22:00",
//     },
//     {
//         name: "Advika",
//         NGOs_Name: "FoodForAll",
//         Donation_Amount: "₹1200",
//         date: "2023-09-03 14:50:00",
//     },
//     {
//         name: "Kian",
//         NGOs_Name: "childCare",
//         Donation_Amount: "₹1500",
//         date: "2023-02-10 09:18:00",
//     },
//     {
//         name: "Riya",
//         NGOs_Name: "Worknite",
//         Donation_Amount: "₹1800",
//         date: "2023-03-09 19:30:00",
//     },
//     {
//         name: "Rehan",
//         NGOs_Name: "FoodForAll",
//         Donation_Amount: "₹1000",
//         date: "2023-04-14 23:45:00",
//     },
//     {
//         name: "Aisha",
//         NGOs_Name: "childCare",
//         Donation_Amount: "₹1300",
//         date: "2023-05-22 05:05:00",
//     },
//     {
//         name: "Rohan",
//         NGOs_Name: "Worknite",
//         Donation_Amount: "₹1100",
//         date: "2023-06-30 14:20:00",
//     },
//     {
//         name: "Sanya",
//         NGOs_Name: "FoodForAll",
//         Donation_Amount: "₹1400",
//         date: "2023-07-08 20:37:00",
//     },
//     {
//         name: "Riya",
//         NGOs_Name: "Worknite",
//         Donation_Amount: "₹1800",
//         date: "2023-07-09 19:30:00",
//     },
//     {
//         name: "Rehan",
//         NGOs_Name: "FoodForAll",
//         Donation_Amount: "₹1000",
//         date: "2023-08-14 23:45:00",
//     },
//     {
//         name: "Aisha",
//         NGOs_Name: "childCare",
//         Donation_Amount: "₹1300",
//         date: "2023-09-22 05:05:00",
//     },
//     {
//         name: "Rohan",
//         NGOs_Name: "Worknite",
//         Donation_Amount: "₹1100",
//         date: "2023-10-30 14:20:00",
//     },
// ];

function DonationsTable() {
  const [customRowsX, setCustomRowsX] = useState([]);
  const [rows, setRows] = useState([]);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/sitedata/donations"
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
        // const updatedAtDate = new Date(customRowsX[i].updatedAt);
        newRows[i] = {
          id: customRowsX[i]._id,
          user_name: customRowsX[i].username,
          ngo_name: customRowsX[i].NgoName,
          campaign_name: customRowsX[i].campaignName,
          email: customRowsX[i].email,
          phone: customRowsX[i].phone,
          donationAmount: customRowsX[i].donationAmount,
          createdAt: new Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(createdAtDate),
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
      const response = await fetch("http://localhost:4000/deleteDonation", {
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
      <TableComponent
        columns={customColumns}
        rows={rows}
        onDelete={handleDelete}
        showSidebar={false}
        props={{ heading: "Donation Graph" }}
        confirmDeleteIndex={confirmDeleteIndex}
      />
    </>
  );
}

export default DonationsTable;