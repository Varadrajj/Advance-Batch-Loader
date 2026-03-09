import React, { useState } from "react";
import "../styles/Upload.css";

function Upload() {

    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState(null);
    const [selectedMapped, setSelectedMapped] = useState(null);
    const [selectedHeader, setSelectedHeader] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [mappedColumns, setMappedColumns] = useState([]);

    const [itemType, setItemType] = useState("");
    const [excelHeaders, setExcelHeaders] = useState([]);

    const [arasProperties, setArasProperties] = useState([]);

    const itemTypes = [
        "Part",
        "Document",
        "CAD Document"
    ];

    const handleItemTypeChange = async (value) => {
   
        setItemType(value);

        const connection = JSON.parse(localStorage.getItem("connection"));

        try {

            const response = await fetch(
                `https://localhost:7110/api/aras/properties?itemType=${value}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(connection)
                }
            );

            const properties = await response.json();

            console.log("Aras Properties:", properties);

            setArasProperties(properties);

        } catch (err) {

            console.error("Property fetch error", err);

        }
    };


    // Upload Excel
    const handleFileChange = (event) => {

        const selected = event.target.files[0];

        if (selected) {

            setFile(selected);
            setFileName(selected.name);

            readExcelHeaders(selected);
        }
    };

    const handleDrop = (event) => {

        event.preventDefault();

        const droppedFile = event.dataTransfer.files[0];

        if (droppedFile) {

            setFile(droppedFile);
            setFileName(droppedFile.name);

            readExcelHeaders(droppedFile);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };


    // Read Excel Headers
    const readExcelHeaders = async (file) => {

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

            console.log("Excel Headers:", headers);

            setExcelHeaders(headers);

        } catch (err) {

            console.error("Excel header error", err);

        }
    };



    // Map columns
    const handleMap = () => {

        if (!selectedHeader || !selectedProperty) return;

        const newMapping = {

            header: selectedHeader,
            property: selectedProperty
        };

        setMappedColumns([...mappedColumns, newMapping]);

        

        setSelectedHeader(null);
        setSelectedProperty(null);
    };

    const handleUnmap = () => {

        if (!selectedMapped) return;

        const updatedMappings = mappedColumns.filter(
            (map) => map !== selectedMapped
        );

        setMappedColumns(updatedMappings);

       

        setSelectedMapped(null);
    };



    return (

        <div className="upload-container">
            <h2>Upload Excel File</h2>

            {/* Upload Section */}
            <div className="upload-top-section">
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


            {/* ItemType Selection */}

            <div className="itemtype-section">

                {/*<label>Select ItemType</label>*/}

                <select
                    value={itemType}
                    onChange={(e) => handleItemTypeChange(e.target.value)}
                >

                    <option value="">Select ItemType</option>

                    {itemTypes.map((type, index) => (
                        <option key={index} value={type}>
                            {type}
                        </option>
                    ))}

                </select>

            </div>
        </div>

            {/* Mapping Section */}

            <div className="mapping-section">

                <div className="mapping-header">

                    <h3>Property Mapping</h3>

                    <button className="import-btn">
                    Import Data
                    </button>

                </div>

                <div className="mapping-container">

                    {/* Excel Headers */}

                    <div className="mapping-column">

                        <h4>Excel Headers</h4>

                        <div className="mapping-list">

                        {excelHeaders.map((header, index) => (

                            <div
                                key={index}
                                className={`mapping-item ${selectedHeader?.columnIndex === header.columnIndex ? "selected" : ""}`}
                                onClick={() => setSelectedHeader(header)}
                            >
                                {header.columnName}
                            </div>

                        ))}

                        </div>
                    </div>



                    {/* Maping Buttons */}

                    <div className="mapping-middle">

                        <button className="map-btn" onClick={handleMap} disabled={!selectedHeader || !selectedProperty}>Map →</button>

                        <button className="unmap-btn" onClick={handleUnmap} disabled={!selectedMapped}>← Unmap</button>

                    </div>



                    {/* Aras Properties */}

                    <div className="mapping-column">

                        <h4>Aras Properties</h4>

                            <div className="mapping-list">

                        {arasProperties.map((prop, index) => (

                            <div
                                key={index}
                                className={`mapping-item ${selectedProperty?.name === prop.name ? "selected" : ""}`}
                                onClick={() => setSelectedProperty(prop)}
                            >
                                {prop.label || prop.name}
                            </div>

                        ))}

                        </div>
                    </div>



                    {/* Mapped Columns */}

                    <div className="mapping-column mapped">

                        <h4>Mapped Columns</h4>

                        <div className="mapping-list">

                        {mappedColumns.map((map, index) => (

                            <div
                                key={index}
                                className={`mapped-item ${selectedMapped === map ? "selected" : ""
                                    }`}
                                onClick={() => setSelectedMapped(map)}
                            >

                                {map.header.columnName} → {map.property.label || map.property.name}

                            </div>

                        ))}

                        </div>
                    </div>

                </div>

            </div>

            {/* Import Logs Section */}

            <div className="logs-section">

                <div className="logs-header">

                    <h3>Loader Logs</h3>

                    <button className="export-btn">
                        Export Logs
                    </button>

                </div>

                <div className="logs-table-container">

                    THIS IS TEST DATA FOR LOGS

                </div>

            </div>

        </div>

    );
}

export default Upload;