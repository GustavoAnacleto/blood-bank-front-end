// src/App.js
import axios from 'axios';
import React, { useState } from 'react';

function App() {
  const [fileContent, setFileContent] = useState(null);
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = JSON.parse(event.target.result);
      setFileContent(content);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fileContent) {
      try {
        const response = await axios.post('http://localhost:8080/donors/average-imc', fileContent);
        setResults(response.data);
      } catch (error) {
        console.error('Error processing the request', error);
      }
    }
  };

  return (
    <div className="App">
      <h1>Blood Bank Data Processor</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".json" onChange={handleFileChange} />
        <button type="submit">Submit</button>
      </form>
      {results && (
        <div>
          <h2>Results:</h2>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;

