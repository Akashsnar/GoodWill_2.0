// FeedbackTable.js
import React from "react";
import TableComponent from "./TableComponent";

const customRows = [
  {
    name: "KP",
    email: "kp@gmail.com",
    did_you_find_what_you_needed: "Yes, all of it",
    Is_this_the_first_time_you_have_visited_the_website: "Yes",
    Rating: "4",
  },
  {
    name: "Rahul Sharma",
    email: "rahulsharma789@gmail.com",
    did_you_find_what_you_needed: "Yes, all of it",
    Is_this_the_first_time_you_have_visited_the_website: "Yes",
    Rating: "5",
  },
  {
    name: "Amit Singh",
    email: "amitsingh123@gmail.com",
    did_you_find_what_you_needed: "Yes, all of it",
    Is_this_the_first_time_you_have_visited_the_website: "No",
    Rating: "4",
  },
  {
    name: "Priya Patel",
    email: "priyapatel456@gmail.com",
    did_you_find_what_you_needed: "Yes, some of it",
    Is_this_the_first_time_you_have_visited_the_website: "Yes",
    Rating: "3",
  },
  {
    name: "Ananya Gupta",
    email: "ananyagupta789@gmail.com",
    did_you_find_what_you_needed: "No, none of it",
    Is_this_the_first_time_you_have_visited_the_website: "No",
    Rating: "2",
  },
  {
    name: "Vikas Kumar",
    email: "vikaskumar234@gmail.com",
    did_you_find_what_you_needed: "Yes, all of it",
    Is_this_the_first_time_you_have_visited_the_website: "Yes",
    Rating: "5",
  },
  {
    name: "Shreya Jain",
    email: "shreyajain567@gmail.com",
    did_you_find_what_you_needed: "Yes, some of it",
    Is_this_the_first_time_you_have_visited_the_website: "No",
    Rating: "4",
  },
  {
    name: "Sandeep Verma",
    email: "sandeepverma789@gmail.com",
    did_you_find_what_you_needed: "No, none of it",
    Is_this_the_first_time_you_have_visited_the_website: "Yes",
    Rating: "3",
  },
  {
    name: "Neha Reddy",
    email: "nehareddy123@gmail.com",
    did_you_find_what_you_needed: "Yes, all of it",
    Is_this_the_first_time_you_have_visited_the_website: "No",
    Rating: "5",
  },
  {
    name: "Rajesh Yadav",
    email: "rajeshyadav456@gmail.com",
    did_you_find_what_you_needed: "Yes, some of it",
    Is_this_the_first_time_you_have_visited_the_website: "Yes",
    Rating: "4",
  },
  {
    name: "Pooja Sharma",
    email: "poojasharma789@gmail.com",
    did_you_find_what_you_needed: "No, none of it",
    Is_this_the_first_time_you_have_visited_the_website: "No",
    Rating: "2",
  },
  {
    name: "Arjun Patel",
    email: "arjunpatel123@gmail.com",
    did_you_find_what_you_needed: "Yes, all of it",
    Is_this_the_first_time_you_have_visited_the_website: "Yes",
    Rating: "5",
  },
  {
    name: "Deepika Singh",
    email: "deepikasingh456@gmail.com",
    did_you_find_what_you_needed: "Yes, some of it",
    Is_this_the_first_time_you_have_visited_the_website: "No",
    Rating: "4",
  },
  {
    name: "Rahul Kumar",
    email: "rahulkumar234@gmail.com",
    did_you_find_what_you_needed: "No, none of it",
    Is_this_the_first_time_you_have_visited_the_website: "Yes",
    Rating: "3",
  },
  {
    name: "Anjali Gupta",
    email: "anjaliGupta567@gmail.com",
    did_you_find_what_you_needed: "Yes, all of it",
    Is_this_the_first_time_you_have_visited_the_website: "No",
    Rating: "5",
  },
  {
    name: "Vivek Verma",
    email: "vivekverma789@gmail.com",
    did_you_find_what_you_needed: "Yes, some of it",
    Is_this_the_first_time_you_have_visited_the_website: "Yes",
    Rating: "4",
  },
  {
    name: "Ananya Reddy",
    email: "ananyareddy123@gmail.com",
    did_you_find_what_you_needed: "No, none of it",
    Is_this_the_first_time_you_have_visited_the_website: "No",
    Rating: "2",
  },
];

function FeedbackTable() {
  const [rows, setRows] = React.useState(customRows);

  const customColumns = Object.keys(customRows[0]).map((key) => ({
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
    <TableComponent
      columns={customColumns}
      rows={rows}
      onDelete={handleDelete}
      props={{ heading: "Feedbacks" }}
      />
      </>
  );
}

export default FeedbackTable;
