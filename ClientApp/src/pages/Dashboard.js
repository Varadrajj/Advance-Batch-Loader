import React from "react";
import "../styles/Dashboard.css";
import Navbar from "../components/Navbar";
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
        <div>
        <Navbar title="Advanced Batch Loader" />
    <div className="dashboard-container">


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
    </div>
  );
}

export default Dashboard;