// SetTable.js
import React from "react";
import TableComponent from "./TableComponent";

const customRows = [
  { name: "John", age: 25, city: "New York" },
  { name: "Alice", age: 30, city: "Los Angeles" },
  { name: "Bob", age: 22, city: "Chicago" },
  { name: "Eva", age: 28, city: "San Francisco" },
  { name: "Charlie", age: 35, city: "Seattle" },
];

function SetTable() {
  const [rows, setRows] = React.useState(customRows);

  const customColumns = Object.keys(customRows[0]).map((key) => ({
    id: key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    minWidth: 100,
  }));

  const handleDelete = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };

  return (
    <TableComponent
      columns={customColumns}
      rows={rows}
      onDelete={handleDelete}
    />
  );
}

export default SetTable;
