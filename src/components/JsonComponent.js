import React, { useState } from 'react';

const JsonComponent = () => {
  const [data, setData] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const jsonData = { key: 'value' }; // Substitua pelo seu JSON

    try {
      const response = await fetch('URL_DO_SEU_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Erro ao enviar o JSON:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <button type="submit">Enviar JSON</button>
      </form>
      {data && (
        <div>
          <h3>Resultados:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default JsonComponent;
