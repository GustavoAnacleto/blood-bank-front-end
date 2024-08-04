import axios from 'axios';
import React, { useState } from 'react';
import './styles/App.css';


function App() {
  const [fileContent, setFileContent] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = JSON.parse(event.target.result);
        setFileContent(content);
        setError(null);
      } catch (err) {
        setError('Arquivo JSON inválido');
        setFileContent(null);
      }
    };
    reader.readAsText(file);
  };

  const handleRequest = async (url, method = 'post') => {
    if (fileContent || method === 'get') {
      setLoading(true);
      try {
        const response = await axios({
          method: method,
          url: url,
          data: method === 'post' ? fileContent : undefined
        });
        setResults(response.data);
        setError(null);
      } catch (error) {
        console.error('Erro ao processar a solicitação', error);
        setError('Erro ao processar a solicitação');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Nenhum conteúdo de arquivo para enviar');
    }
  };

  return (
    <div className="App">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h1>Processador de dados do banco de sangue</h1>
      <form>
        <input type="file" accept=".json" onChange={handleFileChange} />
      </form>
      <button onClick={() => handleRequest('http://localhost:8080/donors/average-imc')}>IMC médio por faixa de idade</button>
      <button onClick={() => handleRequest('http://localhost:8080/donors/obesity-percentage')}>Percentual de obesos por gênero</button>
      <button onClick={() => handleRequest('http://localhost:8080/donors/average-age-by-blood-type')}>Média de idade por tipo de sangue</button>
      <button onClick={() => handleRequest('http://localhost:8080/donors/possible-donors-by-blood-type')}>Possíveis doadores por tipo sanguíneo</button>
      <button onClick={() => handleRequest('http://localhost:8080/donors/count-by-state')}>Contagem por estado</button>
      {error && <p>{error}</p>}
      {loading && <p>Loading...</p>}
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
