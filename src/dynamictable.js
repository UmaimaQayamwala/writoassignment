import React, { useState } from "react";
import "./DynamicTable.css";

function DynamicTable() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnType, setNewColumnType] = useState("string");
  const [filters, setFilters] = useState({});

  const addColumn = () => {
    if (newColumnName.trim() === "") return;
    setColumns([...columns, { name: newColumnName, type: newColumnType }]);
    setNewColumnName("");
    setNewColumnType("string");
    console.log(`Column added: ${newColumnName} (${newColumnType})`);
  };

  const deleteColumn = (colIndex) => {
    const updatedColumns = columns.filter((_, index) => index !== colIndex);
    setColumns(updatedColumns);
    console.log(`Column deleted: ${columns[colIndex].name}`);
  };

  const addRow = () => {
    const newRow = {};
    columns.forEach((col) => {
      newRow[col.name] = col.type === "number" ? 0 : "";
    });
    setRows([...rows, newRow]);
    console.log(`Row added: ${JSON.stringify(newRow)}`);
  };

  const deleteRow = (rowIndex) => {
    const updatedRows = rows.filter((_, index) => index !== rowIndex);
    setRows(updatedRows);
    console.log(`Row deleted: ${JSON.stringify(rows[rowIndex])}`);
  };

  const updateCell = (rowIndex, colName, value) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][colName] = value;
    setRows(updatedRows);
  };

  const handleFilterChange = (colName, value) => {
    setFilters({ ...filters, [colName]: value });
  };

  const applyFilter = (row) => {
    return Object.keys(filters).every((colName) => {
      const filterValue = filters[colName];
      if (!filterValue) return true; 
      return row[colName].toString().toLowerCase().includes(filterValue.toLowerCase());
    });
  };

  const filteredRows = rows.filter(applyFilter);

  return (
    <div className="container">
      <h2>Dynamic Table</h2>

  
      <div className="add-column">
        <input
          type="text"
          placeholder="Column Name"
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
        />
        <select
          value={newColumnType}
          onChange={(e) => setNewColumnType(e.target.value)}
        >
          <option value="string">String</option>
          <option value="number">Number</option>
        </select>
        <button onClick={addColumn}>Add Column</button>
      </div>

      
      {columns.length > 0 && (
        <div className="add-row">
          <button onClick={addRow}>Add Row</button>
        </div>
      )}

      
      {columns.length > 0 && (
        <table>
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>
                  {col.name} ({col.type})
                 
                  <input
                    type={col.type === "number" ? "number" : "text"}
                    placeholder={`Filter by ${col.name}`}
                    onChange={(e) => handleFilterChange(col.name, e.target.value)}
                  />
                  <button onClick={() => deleteColumn(index)}>Delete Column</button>
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>
                    <input
                      type={col.type === "number" ? "number" : "text"}
                      value={row[col.name]}
                      onChange={(e) =>
                        updateCell(rowIndex, col.name, e.target.value)
                      }
                    />
                  </td>
                ))}
                <td>
                  <button onClick={() => deleteRow(rowIndex)}>Delete Row</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DynamicTable;