import React, { useState } from "react";
import "../styles/Upload.css";

function Upload() {

    const [fileName, setFileName] = useState("");
    const [file, setFile] = useState(null);

    const [selectedHeader, setSelectedHeader] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [mappedColumns, setMappedColumns] = useState([]);

    const [itemType, setItemType] = useState("");

    const itemTypes = [
        "Part",
        "Document",
        "CAD Document"
    ];

    const [excelHeaders, setExcelHeaders] = useState([
        "item_number",
        "name",
        "description",
        "weight",
        "classification"
    ]);

    const [arasProperties, setArasProperties] = useState([
        "item_number",
        "name",
        "description",
        "state",
        "classification",
        "weight"
    ]);



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


    // When ItemType selected
    const handleItemTypeChange = (value) => {

        setItemType(value);

        // Static properties for now
        setArasProperties([
            "item_number",
            "name",
            "description",
            "state",
            "classification",
            "weight"
        ]);
    };


    // Map columns
    const handleMap = () => {

        if (!selectedHeader || !selectedProperty) return;

        const newMapping = {
            header: selectedHeader,
            property: selectedProperty
        };

        setMappedColumns([...mappedColumns, newMapping]);

        setExcelHeaders(excelHeaders.filter(h => h !== selectedHeader));
        setArasProperties(arasProperties.filter(p => p !== selectedProperty));

        setSelectedHeader(null);
        setSelectedProperty(null);
    };


    return (

        <div className="upload-container">

            <h2>Upload Excel File</h2>

            {/* Upload Section */}

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

                <label>Select ItemType</label>

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



            {/* Mapping Section */}

            <div className="mapping-section">

                <h3>Column Mapping</h3>

                <div className="mapping-container">

                    {/* Excel Headers */}

                    <div className="mapping-column">

                        <h4>Excel Headers</h4>

                        {excelHeaders.map((header, index) => (

                            <div
                                key={index}
                                className={`mapping-item ${selectedHeader === header ? "selected" : ""}`}
                                onClick={() => setSelectedHeader(header)}
                            >
                                {header}
                            </div>

                        ))}

                    </div>



                    {/* Map Button */}

                    <div className="mapping-middle">

                        <button
                            className="map-btn"
                            onClick={handleMap}
                        >
                            Map →
                        </button>

                    </div>



                    {/* Aras Properties */}

                    <div className="mapping-column">

                        <h4>Aras Properties</h4>

                        {arasProperties.map((prop, index) => (

                            <div
                                key={index}
                                className={`mapping-item ${selectedProperty === prop ? "selected" : ""}`}
                                onClick={() => setSelectedProperty(prop)}
                            >
                                {prop}
                            </div>

                        ))}

                    </div>



                    {/* Mapped Columns */}

                    <div className="mapping-column mapped">

                        <h4>Mapped Columns</h4>

                        {mappedColumns.map((map, index) => (

                            <div key={index} className="mapped-item">

                                {map.header} → {map.property}

                            </div>

                        ))}

                    </div>

                </div>

            </div>

        </div>

    );
}

export default Upload;