import React, { useState } from "react";

const DataCollector: React.FC = () => {
  const [employeeName, setEmployeeName] = useState("");
  const [employeeDepartment, setEmployeeDepartment] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch("http://46.19.74.196:3002/api/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employeeName,
        employeeDepartment,
      }),
    });

    const textResponse = await response.text(); // Capture response as text
    console.log("Raw Response:", textResponse);

    const data = JSON.parse(textResponse); // Attempt to parse JSON
    if (response.ok) {
      console.log("Response from server:", data);
      setResponseMessage(data.message || "Employee added successfully!");
    } else {
      console.error("Error:", data);
      setResponseMessage(data.error || "Failed to add employee.");
    }

    setEmployeeName("");
    setEmployeeDepartment("");
  } catch (error) {
    console.error("Error posting data:");
    setResponseMessage("Error connecting to the server.");
  }
};


  return (
    <section>
      <h2>Data Collector</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Employee Name:</label>
          <input
            type="text"
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            placeholder="Enter employee name"
            required
          />
        </div>
        <div>
          <label>Employee Department:</label>
          <input
            type="text"
            value={employeeDepartment}
            onChange={(e) => setEmployeeDepartment(e.target.value)}
            placeholder="Enter department"
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>

      {responseMessage && (
        <div>
          <p>{responseMessage}</p>
        </div>
      )}
    </section>
  );
};

export default DataCollector;
