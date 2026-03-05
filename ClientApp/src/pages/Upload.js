import React, { useState } from "react";
import "../styles/Upload.css";

function Upload() {

    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        const selected = event.target.files[0];

        if (selected) {
            setFile(selected);
            setFileName(selected.name);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            setFileName(file.name);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleNext = async () => {

        if (!file) {
            alert("Please upload a file");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {

            const response = await fetch(
                "https://localhost:7110/api/excel/headers",
                {
                    method: "POST",
                    body: formData
                }
            );

            const headers = await response.json();

            localStorage.setItem("excelHeaders", JSON.stringify(headers));

            alert("Headers loaded successfully");

            // next page later
            console.log(headers);

        } catch (err) {
            alert("Error reading Excel file");
        }
    };

    return (
        <div className="upload-container">

            <h2>Upload Excel File</h2>

            <div
                className="drop-zone"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >

                <p>Drag & Drop Excel File Here</p>
                <p>or</p>

                <input
                    type="file"
                    accept=".xls,.xlsx"
                    onChange={handleFileChange}
                />

                {fileName && (
                    <p className="file-name">
                        Selected File: {fileName}
                    </p>
                )}

            </div>

            <div className="itemtype-section">

                <label>Select ItemType</label>

                <select>

                    <option>Part</option>
                    <option>Document</option>
                    <option>CAD</option>

                </select>

            </div>

            <button className="next-btn" onClick={handleNext}>
                Next
            </button>

        </div>
    );
}

export default Upload;