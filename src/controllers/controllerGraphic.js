const { dataSource } = require('../database');

const getFinancesByDateRange = async (req, res) => {
  const { startDate, endDate, userId } = req.query;

  const query = `
    SELECT incomeDate AS date, incomeAmount AS amount, 'income' AS type
    FROM tblIncome
    WHERE incomeDate BETWEEN ? AND ? AND userId = ?

    UNION ALL

    SELECT expenseDate AS date, expenseAmount AS amount, 'expense' AS type
    FROM tblExpense
    WHERE expenseDate BETWEEN ? AND ? AND userId = ?
    ORDER BY date;
  `;

  try {
    const results = await dataSource.query(query, [startDate, endDate, userId, startDate, endDate, userId]);
    res.json(results);  // Asegúrate de retornar el arreglo completo
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos financieros', details: error.message });
  }
};

module.exports = {
  getFinancesByDateRange
};
