// MessagesTable.js
import React, { useEffect, useState } from "react";
import TableComponent from "./TableComponent";


// const customRows = [
//   {
//     author: "Amit",
//     email: "amit.kumar@gmail.com",
//     phone_number: "+919876543210",
//     subject: "Support for Education of Underprivileged Children",
//     text: "Hello, I am passionate about supporting the education of underprivileged children. Please guide me on how I can contribute to your noble cause.",
//     createdAt: "2023-12-01 09:45:00",
//   },
//   {
//     author: "Priya",
//     email: "priya.singh@yahoo.com",
//     phone_number: "+917654321098",
//     subject: "Empowerment through Skill Development",
//     text: "Greetings! I believe in empowering individuals through skill development. How can I be part of your initiatives aimed at creating sustainable livelihoods?",
//     createdAt: "2023-12-02 12:15:00",
//   },
//   {
//     author: "Rajesh",
//     email: "rajesh.sharma@hotmail.com",
//     phone_number: "+918888888888",
//     subject: "Environmental Conservation Project",
//     text: "Dear team, I am deeply concerned about environmental issues. Can you provide details on your projects focused on conservation and sustainability?",
//     createdAt: "2023-12-03 15:30:00",
//   },
//   {
//     author: "Anjali",
//     email: "anjali.verma@gmail.com",
//     phone_number: "+919999999999",
//     subject: "Healthcare Support for Rural Communities",
//     text: "Hi, I am interested in contributing to healthcare initiatives for rural communities. Kindly share information on your ongoing projects in this domain.",
//     createdAt: "2023-12-03 11:00:00",
//   },
//   {
//     author: "Vikram",
//     email: "vikram.shah@yahoo.com",
//     phone_number: "+917777777777",
//     subject: "Animal Welfare Program",
//     text: "Greetings! I love animals and would like to support your efforts in animal welfare. Could you provide details on your ongoing programs in this area?",
//     createdAt: "2023-12-02 14:45:00",
//   },
//   {
//     author: "Neha",
//     email: "neha.gupta@hotmail.com",
//     phone_number: "+918765432109",
//     subject: "Women's Empowerment Initiatives",
//     text: "Hello, I am passionate about women's empowerment. Please share information on your initiatives and how individuals like me can contribute to your cause.",
//     createdAt: "2023-12-03 10:30:00",
//   },
//   {
//     author: "Ravi",
//     email: "ravi.mishra@gmail.com",
//     phone_number: "+916666666666",
//     subject: "Clean Water for Every Village",
//     text: "Dear team, I believe in the right to clean water for every individual. Can you provide details on your projects aimed at providing access to clean water in villages?",
//     createdAt: "2022-10-07 13:15:00",
//   },
//   {
//     author: "Pooja",
//     email: "pooja.sharma@yahoo.com",
//     phone_number: "+915555555555",
//     subject: "Supporting Sustainable Agriculture",
//     text: "Hi, I am interested in sustainable agriculture. Please share information on your projects and how I can contribute to promoting environmentally friendly farming practices.",
//     createdAt: "2022-12-08 09:00:00",
//   },
//   {
//     author: "Rahul",
//     email: "rahul.verma@hotmail.com",
//     phone_number: "+914444444444",
//     subject: "Promoting Solar Energy in Rural Areas",
//     text: "Greetings! I am passionate about sustainable energy. Can you provide information on your projects focused on promoting solar energy in rural areas?",
//     createdAt: "2021-12-09 12:45:00",
//   },
//   {
//     author: "Arun",
//     email: "arun.singh@gmail.com",
//     phone_number: "+913333333333",
//     subject: "Disaster Relief and Rehabilitation",
//     text: "Hello, I am interested in supporting disaster relief efforts. Please provide details on your ongoing projects and how I can contribute to rehabilitation initiatives.",
//     createdAt: "2022-12-10 15:30:00",
//   },
//   {
//     author: "Shweta",
//     email: "shweta.mittal@yahoo.com",
//     phone_number: "+912222222222",
//     subject: "Promoting Digital Literacy",
//     text: "Dear team, I believe in the power of digital literacy. Can you provide details on your initiatives aimed at promoting digital education, especially in rural areas?",
//     createdAt: "2022-12-11 11:00:00",
//   },
//   {
//     author: "Sanjay",
//     email: "sanjay.agarwal@hotmail.com",
//     phone_number: "+911111111111",
//     subject: "Conservation of Biodiversity",
//     text: "Hi, I am passionate about biodiversity conservation. Please share information on your ongoing projects and how I can contribute to protecting our diverse ecosystems.",
//     createdAt: "2023-11-12 14:45:00",
//   },
//   {
//     author: "Nandini",
//     email: "nandini.sharma@gmail.com",
//     phone_number: "+919191919191",
//     subject: "Promoting Sustainable Tourism",
//     text: "Greetings! I am interested in sustainable tourism. Can you provide details on your initiatives and how I can contribute to promoting responsible travel?",
//     createdAt: "2023-11-13 09:30:00",
//   },
//   {
//     author: "Suresh",
//     email: "suresh.yadav@yahoo.com",
//     phone_number: "+918181818181",
//     subject: "Community Health and Wellness",
//     text: "Hello, I am passionate about community health. Please share information on your projects focused on promoting health and wellness in local communities.",
//     createdAt: "2023-11-14 12:15:00",
//   },
//   {
//     author: "Meera",
//     email: "meera.agrawal@hotmail.com",
//     phone_number: "+917171717171",
//     subject: "Empowering Indigenous Artisans",
//     text: "Dear team, I am interested in empowering indigenous artisans. Can you provide details on your initiatives and how I can support the preservation of traditional crafts?",
//     createdAt: "2023-11-15 15:00:00",
//   },
// ];

function MessagesTable() {
  const [customRowsX, setCustomRowsX] = useState([]);
  const [rows, setRows] = useState([]);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/sitedata/contact");
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
          // image: customRowsX[i].image,
          name: customRowsX[i].name,
          email: customRowsX[i].email,
          phone: customRowsX[i].phone,
          Subject: customRowsX[i].Subject,
          message: customRowsX[i].message,
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
      const response = await fetch("http://localhost:4000/deleteMessage", {
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
        props={{ heading: "Messages" }}
        showSidebar={true}
        confirmDeleteIndex={confirmDeleteIndex}
      />
    </>
  );
}
export default MessagesTable;
