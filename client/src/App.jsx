import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");

  async function loadItems() {
  const response = await fetch("http://localhost:5000/api/research-items");
  const data = await response.json();

  if (!response.ok) {
    console.error("Could not load research items:", data);
    setItems([]);
    return;
  }

  setItems(data);
}
  useEffect(() => {
    loadItems();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    const response = await fetch(
      "http://localhost:5000/api/research-items",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, url, notes }),
      }
    );

    if (response.ok) {
      setTitle("");
      setUrl("");
      setNotes("");
      loadItems();
    }
  }

  return (
    <main>
      <h1>Research Milestone</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Building Name
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </label>

        <label>
          Room Number
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </label>

        <label>
          Your Name
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </label>

        <button type="submit">Save research item</button>
      </form>

      <h2>Saved items</h2>

      {items.length === 0 ? (
        <p>No research items yet.</p>
      ) : (
        <div className="saved-items">
          {items.map((item) => (
            <div className="saved-item" key={item.id}>
              <strong>Building Name: </strong>{item.title}
              <br />
              <strong>Room Number: </strong>{item.url}
              <br />
              <strong>USC ID: </strong>{item.notes}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default App;