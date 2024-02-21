// ReviewsTable.js
import React, { useEffect, useState } from "react";
import TableComponent from "./TableComponent";

// const customRows = [
//   {
//     UserID: 101,
//     author: "Rahul",
//     NGOs_Name: "childCare",
//     text: "ChildCare is doing an exceptional job in providing support and care to underprivileged children. Their dedication is truly commendable!",
//     rating: 5,
//     createdAt: "2023-11-15 14:30:00",
//   },
//   {
//     UserID: 202,
//     author: "Priya",
//     NGOs_Name: "Worknite",
//     text: "Worknite has been a lifeline for those seeking employment opportunities. Their efforts in workforce development are making a significant impact!",
//     rating: 4,
//     createdAt: "2022-12-05 09:45:00",
//   },
//   {
//     UserID: 303,
//     author: "Amit",
//     NGOs_Name: "FoodForAll",
//     text: "FoodForAll is working tirelessly to address the issue of hunger in our community. Their commitment to providing meals to those in need is truly inspiring!",
//     rating: 2,
//     createdAt: "2023-01-20 16:20:00",
//   },
//   {
//     UserID: 404,
//     author: "Sneha",
//     NGOs_Name: "childCare",
//     text: "I've witnessed the positive impact ChildCare has on the lives of children. Their educational programs and support services are making a real difference!",
//     rating: 4,
//     createdAt: "2023-04-08 13:15:00",
//   },
//   {
//     UserID: 505,
//     author: "Raj",
//     NGOs_Name: "Worknite",
//     text: "Worknite has created a platform that bridges the gap between job seekers and employers. It's a great initiative for promoting employment opportunities!",
//     rating: 4,
//     createdAt: "2022-11-30 11:30:00",
//   },
//   {
//     UserID: 606,
//     author: "Neha",
//     NGOs_Name: "FoodForAll",
//     text: "FoodForAll's commitment to reducing food insecurity is truly heartwarming. They are making a positive impact on the lives of those in need!",
//     rating: 3,
//     createdAt: "2023-03-12 09:00:00",
//   },
//   {
//     UserID: 707,
//     author: "Vikram",
//     NGOs_Name: "childCare",
//     text: "ChildCare's dedication to the well-being of children is unmatched. They provide a nurturing environment for the development of young minds!",
//     rating: 3,
//     createdAt: "2023-06-22 17:45:00",
//   },
//   {
//     UserID: 808,
//     author: "Anjali",
//     NGOs_Name: "Worknite",
//     text: "Worknite's efforts in job placement and skill development have positively impacted many lives. It's a valuable resource for the community!",
//     rating: 4,
//     createdAt: "2022-10-18 10:15:00",
//   },
//   {
//     UserID: 909,
//     author: "Kunal",
//     NGOs_Name: "FoodForAll",
//     text: "FoodForAll's initiatives to combat hunger are praiseworthy. They go above and beyond to ensure that no one in the community goes to bed hungry!",
//     rating: 3,
//     createdAt: "2023-05-05 14:00:00",
//   },
//   {
//     UserID: 1010,
//     author: "Pooja",
//     NGOs_Name: "childCare",
//     text: "ChildCare's focus on education and holistic development is making a significant impact on the lives of children. Kudos to their team!",
//     rating: 4,
//     createdAt: "2023-09-10 12:45:00",
//   },
//   {
//     UserID: 1111,
//     author: "Arjun",
//     NGOs_Name: "Worknite",
//     text: "Worknite's commitment to creating employment opportunities is transforming lives. It's a valuable platform for career advancement!",
//     rating: 4,
//     createdAt: "2022-12-28 15:30:00",
//   },
//   {
//     UserID: 1212,
//     author: "Sara",
//     NGOs_Name: "FoodForAll",
//     text: "FoodForAll's dedication to addressing food insecurity is making a positive impact. Their meal distribution programs are a beacon of hope for many!",
//     rating: 2,
//     createdAt: "2023-02-28 08:30:00",
//   },
//   {
//     UserID: 1313,
//     author: "Rishi",
//     NGOs_Name: "childCare",
//     text: "ChildCare's initiatives are shaping a brighter future for children in need. Their commitment to education and support services is truly commendable!",
//     rating: 5,
//     createdAt: "2023-07-17 11:15:00",
//   },
//   {
//     UserID: 1414,
//     author: "Mira",
//     NGOs_Name: "Worknite",
//     text: "Worknite has played a crucial role in connecting job seekers with employment opportunities. It's a valuable platform for career advancement!",
//     rating: 4,
//     createdAt: "2022-11-15 13:00:00",
//   },
//   {
//     UserID: 1515,
//     author: "Rajat",
//     NGOs_Name: "FoodForAll",
//     text: "FoodForAll's commitment to ending hunger is truly commendable. Their community outreach and meal programs are making a difference in people's lives!",
//     rating: 3,
//     createdAt: "2023-04-02 10:45:00",
//   },
// ];

function ReviewsTable() {
  const [customRowsX, setCustomRowsX] = useState([]);
  const [rows, setRows] = useState([]);
 const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);

 useEffect(() => {
   const fetchData = async () => {
     try {
       const response = await fetch(
         "http://localhost:4000/sitedata/reviews"
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
         Name: customRowsX[i].author,
         ngo_name: customRowsX[i].ngoname,
         campaign_name: customRowsX[i].campagainname,
         Comment: customRowsX[i].text,
         rating: customRowsX[i].rating,
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
     const response = await fetch("http://localhost:4000/deleteReview", {
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
    <TableComponent
      columns={customColumns}
      rows={rows}
      onDelete={handleDelete}
      showSidebar={true}
      props={{ heading: "Reviews" }}
      confirmDeleteIndex={confirmDeleteIndex}
    />
  );
}

export default ReviewsTable;
