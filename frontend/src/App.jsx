import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000/api/expenses";

function App() {
  const [expenses, setExpenses] = useState([]);

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: ""
  });

  const [editId, setEditId] = useState(null);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(API);
      setExpenses(response.data);
    } catch (error) {
      console.log(error);
      alert("Unable to fetch expenses");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.amount || !form.category ||
        Number(form.amount) <= 0) {
      alert("Enter valid expense details");
      return;
    }

    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, {
          ...form,
          amount: Number(form.amount)
        });

        alert("Expense updated successfully");
      } else {
        await axios.post(API, {
          ...form,
          amount: Number(form.amount)
        });

        alert("Expense added successfully");
      }

      setForm({
        title: "",
        amount: "",
        category: ""
      });

      setEditId(null);
      fetchExpenses();

    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  const handleEdit = (expense) => {
    setForm({
      title: expense.title,
      amount: expense.amount,
      category: expense.category
    });

    setEditId(expense._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) {
      return;
    }

    try {
      await axios.delete(`${API}/${id}`);
      alert("Expense deleted successfully");
      fetchExpenses();
    } catch (error) {
      console.log(error);
      alert("Unable to delete expense");
    }
  };

  const total = expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  return (
    <div className="container">
      <h1>Expense Tracker</h1>
      <p className="subtitle">Manage your daily expenses</p>

      <div className="total-card">
        <h3>Total Expenses</h3>
        <h2>₹ {total.toFixed(2)}</h2>
        <p>
          {expenses.length} {expenses.length === 1 ? "transaction" : "transactions"}
        </p>
      </div>

      <div className="form-card">
        <h2>{editId ? "Update Expense" : "Add New Expense"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Expense Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Education">Education</option>
            <option value="Bills">Bills</option>
            <option value="Personal">Personal</option>
            <option value="Other">Other</option>
          </select>

          <button type="submit">
            {editId ? "Update Expense" : "Add Expense"}
          </button>

          {editId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setEditId(null);
                setForm({
                  title: "",
                  amount: "",
                  category: ""
                });
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="list-card">
        <h2>Expense History</h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {expenses.length === 0 ? (
                <tr className="empty-row">
                  <td colSpan="5">
                    <p className="empty-text">No expenses found. Add your first expense!</p>
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td>{expense.title}</td>
                    <td>₹ {Number(expense.amount).toFixed(2)}</td>
                    <td>{expense.category}</td>
                    <td>
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() => handleEdit(expense)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => handleDelete(expense._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
