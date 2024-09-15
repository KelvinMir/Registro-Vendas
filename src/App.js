import React, { useState } from 'react';
import './App.css';


function App() {
  const [sales, setSales] = useState([]);
  const [formData, setFormData] = useState({
    buyerName: '',
    valueSold: '',
    installments: '',
    costValue: ''
  });
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // mês atual
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // ano atual

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSale = {
      date: new Date(),  // Registro da data completa
      buyerName: formData.buyerName,
      valueSold: parseFloat(formData.valueSold),
      installments: parseInt(formData.installments),
      costValue: parseFloat(formData.costValue),
      installmentValues: Array(parseInt(formData.installments)).fill(parseFloat(formData.valueSold) / parseInt(formData.installments)) // Distribuindo o valor das parcelas
    };
    setSales([...sales, newSale]);
    setFormData({ valueSold: '', installments: '', costValue: '' });
  };

  const handleInstallmentChange = (saleIndex, installmentIndex, newValue) => {
    const updatedSales = [...sales];
    updatedSales[saleIndex].installmentValues[installmentIndex] = parseFloat(newValue);
    setSales(updatedSales);
  };

  // Calcula o total a receber no mês atual
  const getTotalToReceive = () => {
    return sales.reduce((total, sale) => {
      return total + sale.installmentValues.reduce((subtotal, installmentValue, index) => {
        const saleMonth = new Date(sale.date).getMonth() + 1; // Mês da venda
        const saleYear = new Date(sale.date).getFullYear(); // Ano da venda
        const installmentMonth = saleMonth + index;
        const installmentYear = saleYear + Math.floor((saleMonth - 1 + index) / 12);
        const adjustedInstallmentMonth = ((installmentMonth - 1) % 12) + 1; // Ajusta o mês caso seja maior que 12
        if (adjustedInstallmentMonth === currentMonth && installmentYear === currentYear) {
          return subtotal + installmentValue;
        }
        return subtotal;
      }, 0);
    }, 0);
  };

  return (
    <div className="App">
      <div className='Left'>
        <h1>Registro de Vendas</h1>
        <form className='Formulario1' onSubmit={handleSubmit}>
          <div>
            <label  htmlFor="buyer-name">Comprador:</label>
            <input 
              type="text"
              id="buyer-name" 
              name="buyerName"
              value={formData.buyerName}
              onChange={handleInputChange}
            />
          </div>
          <div className="input-container">
            <label>Valor Vendido:</label>
            <span className="currency-prefix">R$</span>
            <input
              type="number"
              name="valueSold"
              value={formData.valueSold}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label>Parcelas:</label>
            <input
              type="number"
              name="installments"
              value={formData.installments}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="input-container">
            <label>Valor de Custo:</label>
            <span className="currency-prefix">R$</span>
            <input
              type="number"
              name="costValue"
              value={formData.costValue}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Registrar Venda</button>
        </form>
      </div>
      

      <h2>Vendas Registradas</h2>
      <table>
        <thead>
          <tr>
            <th>Comprador</th>
            <th>Data</th>
            <th>Valor Vendido</th>
            <th>Parcelas</th>
            <th>Valor de Custo</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale, saleIndex) => (
            <tr key={saleIndex}>
              <td>{sale.buyerName}</td>
              <td>{sale.date.toLocaleDateString()}</td>
              <td className="table-value-input">
                <span className="currency-prefix">R$</span>
                <input
                  type="text"
                  value={sale.valueSold.toFixed(2)}
                  readOnly
                />
                </td>
              <td>
                {sale.installmentValues.map((installmentValue, installmentIndex) => (
                   <div key={installmentIndex} className="table-value-input">
                   <span className="currency-prefix">R$</span>
                   <input
                     type="number"
                     value={installmentValue.toFixed(2)}
                     onChange={(e) => handleInstallmentChange(saleIndex, installmentIndex, e.target.value)}
                   />
                 </div>
                ))}
              </td>
              <td className="table-value-input">
                <span className="currency-prefix">R$</span>
                <input
                  type="text"
                  value={sale.costValue.toFixed(2)}
                  readOnly
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Valores a Receber no Mês</h2>
      <div>
        <label>Mês:</label>
        <input
          type="number"
          value={currentMonth}
          onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
          min="1"
          max="12"
        />
        <label>Ano:</label>
        <input
          type="number"
          value={currentYear}
          onChange={(e) => setCurrentYear(parseInt(e.target.value))}
        />
      </div>
      <h3 className='Footer'>Total a Receber: R${getTotalToReceive().toFixed(2)}</h3>
    </div>
  );
}

export default App;
