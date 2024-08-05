import axios from 'axios';
import React, { useState } from 'react';
import './styles/App.css';

function App() {
  const [fileContent, setFileContent] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeButton, setActiveButton] = useState(null);

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

  const handleRequest = async (url, method = 'post', buttonId) => {
    if (fileContent || method === 'get') {
      setLoading(true);
      try {
        const response = await axios({
          method: method,
          url: url,
          data: method === 'post' ? fileContent : undefined
        });
        const formattedResults = formatResults(response.data);
        setResults(formattedResults);
        setError(null);
        setActiveButton(buttonId);
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

  const handleSaveDonors = async () => {
    if (fileContent) {
      setLoading(true);
      try {
        await axios.post('http://localhost:8080/donors/donors', fileContent);
        setResults({ message: 'Dados guardados com sucesso' });
        setError(null);
        setActiveButton('saveDonors');
      } catch (error) {
        console.error('Erro ao salvar os doadores', error);
        setError('Erro ao salvar os doadores');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Nenhum conteúdo de arquivo para enviar');
    }
  };

  const formatResults = (results) => {
    const formattedResults = {};
    for (const [key, value] of Object.entries(results)) {
      if (typeof value === 'number') {
        formattedResults[key] = value.toFixed(2);
      } else {
        formattedResults[key] = value;
      }
    }
    return formattedResults;
  };

  const pluralize = (count, singular, plural) => {
    return count === 1 ? singular : plural;
  };

  return (
    <div className="App">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h1>Processador de dados do banco de sangue</h1>
      <form>
        <input type="file" accept=".json" onChange={handleFileChange} />
      </form>
      <button onClick={() => handleRequest('http://localhost:8080/donors/average-imc', 'post', 'imc')}>IMC médio por faixa de idade</button>
      <button onClick={() => handleRequest('http://localhost:8080/donors/obesity-percentage', 'post', 'obesity')}>Percentual de obesos por gênero</button>
      <button onClick={() => handleRequest('http://localhost:8080/donors/average-age-by-blood-type', 'post', 'age')}>Média de idade por tipo de sangue</button>
      <button onClick={() => handleRequest('http://localhost:8080/donors/possible-donors-by-blood-type', 'post', 'donors')}>Possíveis doadores por tipo sanguíneo</button>
      <button onClick={() => handleRequest('http://localhost:8080/donors/count-by-state', 'post', 'state')}>Contagem por estado</button>
      <button onClick={handleSaveDonors}>Salvar Doadores</button>
      {error && <p>{error}</p>}
      {loading && <p>Loading...</p>}
      {results && (
        <div className="results">
          <h2>Results:</h2>
          {Object.entries(results).map(([key, value]) => (
            <div key={key} className="result-item">
              {activeButton === 'imc' && (
                <p className="dark-blue-text">
                  A média dos doadores {pluralize(value, 'de', 'dos')} {key} ano{value > 1 ? 's' : ''} == {value}
                </p>
              )}
              {activeButton === 'obesity' && (
                <p className="dark-blue-text">
                  {value}% de {key} possui obesidade
                </p>
              )}
              {activeButton === 'age' && (
                <p className="dark-blue-text">
                  A média de idade por tipo sanguíneo {key} == {value} anos
                </p>
              )}
              {activeButton === 'donors' && (
                <p className="dark-blue-text">
                  Pacientes com o sangue {key} têm {Math.floor(value)} possíveis doadores
                </p>
              )}
              {activeButton === 'state' && (
                <p className="dark-blue-text">
                  {Math.floor(value)} doador{Math.floor(value) > 1 ? 'es' : ''} de "{key}"
                </p>
              )}
              {activeButton === 'saveDonors' && (
                <p className="dark-blue-text">
                  {value}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
