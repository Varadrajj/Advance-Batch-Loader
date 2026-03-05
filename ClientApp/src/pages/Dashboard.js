import React from "react";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();
  const recentImports = [
    {
      id: "IMP-001",
      date: "10 Feb 2026",
      itemType: "Part",
      status: "Completed"
    },
    {
      id: "IMP-002",
      date: "11 Feb 2026",
      itemType: "Document",
      status: "Running"
    },
    {
      id: "IMP-003",
      date: "12 Feb 2026",
      itemType: "Part BOM",
      status: "Failed"
    }
  ];

  return (
    <div className="dashboard-container">

      <h1 className="title">Advanced Batch Loader</h1>

      {/* Action Buttons */}

      <div className="action-buttons">

              <button
                  className="btn"
                  onClick={() => navigate("/upload")}
              >
                  New Import
              </button>

        <button className="btn">
          Import History
        </button>

        <button className="btn">
          Templates
        </button>

      </div>

      {/* Recent Imports Table */}

      <div className="table-container">

        <h2>Recent Imports</h2>

        <table className="import-table">

          <thead>
            <tr>
              <th>Import ID</th>
              <th>Date</th>
              <th>Item Type</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {recentImports.map((item) => (

              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.date}</td>
                <td>{item.itemType}</td>
                <td className={`status ${item.status.toLowerCase()}`}>
                  {item.status}
                </td>
              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Dashboard;