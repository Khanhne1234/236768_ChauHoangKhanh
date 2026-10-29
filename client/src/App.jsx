import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://food-backend-236768.onrender.com/api/foods";

const emptyForm = {
  foodId: "",
  name: "",
  category: "",
  cuisine: "",
  ingredients: "",
  price: "",
  quantity: "",
  description: "",
  imageUrl: "",
};

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || `Lỗi HTTP ${response.status}`);
  }

  return data;
}

function getFoodId(food) {
  return food._id || food.foodId;
}

export default function App() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedFood, setSelectedFood] = useState(null);

  async function loadFoods(keyword = "", signal) {
    setLoading(true);
    setError("");

    try {
      const query = keyword.trim()
        ? `?search=${encodeURIComponent(keyword.trim())}`
        : "";
      const data = await request(`${API_URL}${query}`, { signal });
      setFoods(Array.isArray(data) ? data : data.foods || []);
    } catch (err) {
      if (err.name !== "AbortError") setError(err.message);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => loadFoods(search, controller.signal), 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search]);

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setMessage("");
  }

  function openEditForm(food) {
    setEditingId(getFoodId(food));
    setForm({
      foodId: food.foodId || "",
      name: food.name || "",
      category: food.category || "",
      cuisine: food.cuisine || "",
      ingredients: (food.ingredients || []).join(", "),
      price: food.price ?? "",
      quantity: food.quantity ?? "",
      description: food.description || "",
      imageUrl: food.imageUrl || "",
    });
    setShowForm(true);
    setMessage("");
  }

  async function showDetails(food) {
    setError("");
    try {
      const data = await request(`${API_URL}/${getFoodId(food)}`);
      setSelectedFood(data.food || data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    const payload = {
      ...form,
      ingredients: form.ingredients
        .split(/[,\n]/)
        .map((item) => item.trim())
        .filter(Boolean),
      price: Number(form.price),
      quantity: Number(form.quantity),
    };

    try {
      await request(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? "PUT" : "POST",
          body: JSON.stringify(payload),
        }
      );

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      setMessage(editingId ? "Đã cập nhật món ăn." : "Đã thêm món ăn.");
      await loadFoods(search);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(food) {
    if (!window.confirm(`Bạn có chắc muốn xóa "${food.name}" không?`)) return;

    setError("");
    setMessage("");

    try {
      await request(`${API_URL}/${getFoodId(food)}`, { method: "DELETE" });
      setMessage("Đã xóa món ăn.");
      await loadFoods(search);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="page">
      <header className="header">
        <div>
          <p className="eyebrow">QUẢN LÝ THỰC ĐƠN</p>
          <h1>Món ngon mỗi ngày</h1>
          <p className="subtitle">Danh sách món ăn được lưu trên MongoDB Atlas</p>
        </div>
        <button className="button primary" onClick={openAddForm}>
          + Thêm món ăn
        </button>
      </header>

      <section className="toolbar">
        <input
          className="search"
          type="search"
          placeholder="Tìm theo tên, loại món hoặc vùng miền..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <span>{foods.length} món ăn</span>
      </section>

      {message && <div className="notice success">{message}</div>}
      {error && <div className="notice error">{error}</div>}
      {loading && <p className="status">Đang tải danh sách món ăn...</p>}

      {!loading && !error && foods.length === 0 && (
        <p className="status">Không tìm thấy món ăn phù hợp.</p>
      )}

      <section className="food-grid">
        {foods.map((food) => (
          <article className="food-card" key={getFoodId(food)}>
            {food.imageUrl ? (
              <img className="food-image" src={food.imageUrl} alt={food.name} />
            ) : (
              <div className="food-placeholder">🍜</div>
            )}

            <div className="food-content">
              <div className="food-heading">
                <div>
                  <span className="category">{food.category}</span>
                  <h2>{food.name}</h2>
                </div>
                <strong className="price">
                  {Number(food.price).toLocaleString("vi-VN")} ₫
                </strong>
              </div>

              <p className="cuisine">{food.cuisine}</p>
              <p className="description">{food.description}</p>
              <p className="quantity">Còn {food.quantity} phần</p>

              <div className="actions">
                <button className="button" onClick={() => showDetails(food)}>
                  Chi tiết
                </button>
                <button className="button" onClick={() => openEditForm(food)}>
                  Sửa
                </button>
                <button
                  className="button danger"
                  onClick={() => handleDelete(food)}
                >
                  Xóa
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {showForm && (
        <div className="overlay" onClick={() => setShowForm(false)}>
          <section className="dialog" onClick={(event) => event.stopPropagation()}>
            <div className="dialog-header">
              <h2>{editingId ? "Cập nhật món ăn" : "Thêm món ăn"}</h2>
              <button className="close" onClick={() => setShowForm(false)}>
                ×
              </button>
            </div>

            <form className="food-form" onSubmit={handleSubmit}>
              <label>
                Mã món ăn
                <input
                  required
                  value={form.foodId}
                  onChange={(e) => setForm({ ...form, foodId: e.target.value })}
                />
              </label>
              <label>
                Tên món ăn
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label>
                Loại món ăn
                <input
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </label>
              <label>
                Ẩm thực / vùng miền
                <input
                  required
                  value={form.cuisine}
                  onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
                />
              </label>
              <label className="wide">
                Nguyên liệu (phân cách bằng dấu phẩy)
                <input
                  required
                  value={form.ingredients}
                  onChange={(e) =>
                    setForm({ ...form, ingredients: e.target.value })
                  }
                  placeholder="Ví dụ: bánh phở, thịt bò, hành"
                />
              </label>
              <label>
                Giá bán
                <input
                  required
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </label>
              <label>
                Số lượng
                <input
                  required
                  type="number"
                  min="0"
                  step="1"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: e.target.value })
                  }
                />
              </label>
              <label className="wide">
                Mô tả
                <textarea
                  required
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </label>
              <label className="wide">
                Đường dẫn hình ảnh
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({ ...form, imageUrl: e.target.value })
                  }
                  placeholder="https://..."
                />
              </label>

              <div className="form-actions wide">
                <button
                  type="button"
                  className="button"
                  onClick={() => setShowForm(false)}
                >
                  Hủy
                </button>
                <button className="button primary" type="submit">
                  {editingId ? "Lưu thay đổi" : "Thêm món"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {selectedFood && (
        <div className="overlay" onClick={() => setSelectedFood(null)}>
          <section className="dialog details" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h2>{selectedFood.name}</h2>
              <button className="close" onClick={() => setSelectedFood(null)}>
                ×
              </button>
            </div>
            <p><b>Mã món:</b> {selectedFood.foodId}</p>
            <p><b>Loại:</b> {selectedFood.category}</p>
            <p><b>Ẩm thực:</b> {selectedFood.cuisine}</p>
            <p><b>Nguyên liệu:</b> {(selectedFood.ingredients || []).join(", ")}</p>
            <p><b>Giá:</b> {Number(selectedFood.price).toLocaleString("vi-VN")} ₫</p>
            <p><b>Số lượng:</b> {selectedFood.quantity}</p>
            <p><b>Mô tả:</b> {selectedFood.description}</p>
          </section>
        </div>
      )}
    </main>
  );
}