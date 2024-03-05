// FeedbackTable.js
import React, { useEffect, useState } from "react";
import TableComponent from "./TableComponent";

// const customRows = [
//   {
//     name: "KP",
//     email: "kp@gmail.com",
//     did_you_find_what_you_needed: "Yes, all of it",
//     Is_this_the_first_time_you_have_visited_the_website: "Yes",
//     Rating: "4",
//   },
//   {
//     name: "Rahul Sharma",
//     email: "rahulsharma789@gmail.com",
//     did_you_find_what_you_needed: "Yes, all of it",
//     Is_this_the_first_time_you_have_visited_the_website: "Yes",
//     Rating: "5",
//   },
//   {
//     name: "Amit Singh",
//     email: "amitsingh123@gmail.com",
//     did_you_find_what_you_needed: "Yes, all of it",
//     Is_this_the_first_time_you_have_visited_the_website: "No",
//     Rating: "4",
//   },
//   {
//     name: "Priya Patel",
//     email: "priyapatel456@gmail.com",
//     did_you_find_what_you_needed: "Yes, some of it",
//     Is_this_the_first_time_you_have_visited_the_website: "Yes",
//     Rating: "3",
//   },
//   {
//     name: "Ananya Gupta",
//     email: "ananyagupta789@gmail.com",
//     did_you_find_what_you_needed: "No, none of it",
//     Is_this_the_first_time_you_have_visited_the_website: "No",
//     Rating: "2",
//   },
//   {
//     name: "Vikas Kumar",
//     email: "vikaskumar234@gmail.com",
//     did_you_find_what_you_needed: "Yes, all of it",
//     Is_this_the_first_time_you_have_visited_the_website: "Yes",
//     Rating: "5",
//   },
//   {
//     name: "Shreya Jain",
//     email: "shreyajain567@gmail.com",
//     did_you_find_what_you_needed: "Yes, some of it",
//     Is_this_the_first_time_you_have_visited_the_website: "No",
//     Rating: "4",
//   },
//   {
//     name: "Sandeep Verma",
//     email: "sandeepverma789@gmail.com",
//     did_you_find_what_you_needed: "No, none of it",
//     Is_this_the_first_time_you_have_visited_the_website: "Yes",
//     Rating: "3",
//   },
//   {
//     name: "Neha Reddy",
//     email: "nehareddy123@gmail.com",
//     did_you_find_what_you_needed: "Yes, all of it",
//     Is_this_the_first_time_you_have_visited_the_website: "No",
//     Rating: "5",
//   },
//   {
//     name: "Rajesh Yadav",
//     email: "rajeshyadav456@gmail.com",
//     did_you_find_what_you_needed: "Yes, some of it",
//     Is_this_the_first_time_you_have_visited_the_website: "Yes",
//     Rating: "4",
//   },
//   {
//     name: "Pooja Sharma",
//     email: "poojasharma789@gmail.com",
//     did_you_find_what_you_needed: "No, none of it",
//     Is_this_the_first_time_you_have_visited_the_website: "No",
//     Rating: "2",
//   },
//   {
//     name: "Arjun Patel",
//     email: "arjunpatel123@gmail.com",
//     did_you_find_what_you_needed: "Yes, all of it",
//     Is_this_the_first_time_you_have_visited_the_website: "Yes",
//     Rating: "5",
//   },
//   {
//     name: "Deepika Singh",
//     email: "deepikasingh456@gmail.com",
//     did_you_find_what_you_needed: "Yes, some of it",
//     Is_this_the_first_time_you_have_visited_the_website: "No",
//     Rating: "4",
//   },
//   {
//     name: "Rahul Kumar",
//     email: "rahulkumar234@gmail.com",
//     did_you_find_what_you_needed: "No, none of it",
//     Is_this_the_first_time_you_have_visited_the_website: "Yes",
//     Rating: "3",
//   },
//   {
//     name: "Anjali Gupta",
//     email: "anjaliGupta567@gmail.com",
//     did_you_find_what_you_needed: "Yes, all of it",
//     Is_this_the_first_time_you_have_visited_the_website: "No",
//     Rating: "5",
//   },
//   {
//     name: "Vivek Verma",
//     email: "vivekverma789@gmail.com",
//     did_you_find_what_you_needed: "Yes, some of it",
//     Is_this_the_first_time_you_have_visited_the_website: "Yes",
//     Rating: "4",
//   },
//   {
//     name: "Ananya Reddy",
//     email: "ananyareddy123@gmail.com",
//     did_you_find_what_you_needed: "No, none of it",
//     Is_this_the_first_time_you_have_visited_the_website: "No",
//     Rating: "2",
//   },
// ];

function FeedbackTable() {
  const [customRowsX, setCustomRowsX] = useState([]);
  const [rows, setRows] = useState([]);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/sitedata/feedbacks"
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
          // image: customRowsX[i].image,
          name: customRowsX[i].name,
          email: customRowsX[i].email,
          phone: customRowsX[i].phone,
          did_you_find_what_you_needed: customRowsX[i].did_you_find_what_you_needed,
          Is_this_the_first_time_you_have_visited_the_website: customRowsX[i].Is_this_the_first_time_you_have_visited_the_website,
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
      const response = await fetch("http://localhost:4000/deleteFeedback", {
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
        props={{ heading: "Feedbacks" }}
        showSidebar={true}
        confirmDeleteIndex={confirmDeleteIndex}
      />
    </>
  );
}

export default FeedbackTable;
