const { useState, useMemo } = React;

const PRODUCTS = [
  { id: 1, title: "Echo Dot (5th Gen) | Smart speaker with Alexa", price: 49.99, rating: 4.7, reviews: 12430, category: "Electronics", image: "https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=400&q=80", prime: true },
  { id: 2, title: "Kindle Paperwhite (16 GB) - 6.8\" display, waterproof", price: 139.99, rating: 4.8, reviews: 8920, category: "Electronics", image: "https://images.unsplash.com/photo-1592496001020-d31bd830651f?auto=format&fit=crop&w=400&q=80", prime: true },
  { id: 3, title: "Apple AirPods Pro (2nd Generation) Wireless Earbuds", price: 199.00, rating: 4.6, reviews: 45210, category: "Electronics", image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=400&q=80", prime: true },
  { id: 4, title: "Classic Ceramic Coffee Mug Set - 4 Pack (16 oz)", price: 24.99, rating: 4.4, reviews: 1205, category: "Home & Kitchen", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80", prime: false },
  { id: 5, title: "Men's Crewneck Fleece Sweatshirt", price: 18.50, rating: 4.3, reviews: 31200, category: "Fashion", image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&q=80", prime: true },
  { id: 6, title: "Ergonomic Office Chair with Lumbar Support", price: 159.99, rating: 4.5, reviews: 5412, category: "Furniture", image: "https://images.unsplash.com/photo-1580481077114-1e0e85496a79?auto=format&fit=crop&w=400&q=80", prime: false }
];

function App() {
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(item => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="bg-gray-900 text-white sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-2 gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setShowCart(false)}>
            <span className="text-2xl font-bold tracking-tight text-white">amazon<span className="text-amber-500">.clone</span></span>
          </div>
          <div className="flex-1 max-w-2xl flex">
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-gray-200 text-gray-800 text-sm px-3 rounded-l-md border-r border-gray-300 focus:outline-none"
            >
              <option value="All">All</option>
              <option value="Electronics">Electronics</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Fashion">Fashion</option>
              <option value="Furniture">Furniture</option>
            </select>
            <input 
              type="text"
              placeholder="Search Amazon"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 focus:outline-none"
            />
            <button className="bg-amber-500 hover:bg-amber-600 px-5 text-gray-900 rounded-r-md transition-colors">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:block cursor-pointer">
              <p className="text-xs text-gray-300">Hello, sign in</p>
              <p className="text-sm font-bold">Account & Lists</p>
            </div>
            <button onClick={() => setShowCart(!showCart)} className="flex items-center gap-2 text-white relative">
              <div className="relative">
                <i className="fa-solid fa-cart-shopping text-2xl"></i>
                <span className="absolute -top-2 -right-2 bg-amber-500 text-gray-900 font-bold rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              </div>
              <span className="font-bold text-sm hidden sm:inline">Cart</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4">
        {showCart ? (
          <div className="bg-white p-6 rounded-md shadow">
            <h2 className="text-2xl font-bold border-b pb-4 mb-4">Shopping Cart</h2>
            {cart.length === 0 ? (
              <p className="text-gray-600">Your Cart is empty.</p>
            ) : (
              <div>
                <div className="divide-y">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-4 gap-4">
                      <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{item.title}</h3>
                        <p className="text-sm text-green-700">In Stock</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 bg-gray-200 rounded text-sm">-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 bg-gray-200 rounded text-sm">+</button>
                          <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-600 ml-4 hover:underline">Delete</button>
                        </div>
                      </div>
                      <div className="text-right font-bold text-lg">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-right mt-6 pt-4 border-t">
                  <span className="text-lg">Subtotal ({totalItems} items): <strong className="text-xl">${totalPrice}</strong></span>
                  <div className="mt-4">
                    <button className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-6 py-2 rounded-lg">
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white p-4 rounded border flex flex-col justify-between hover:shadow-lg transition-shadow">
                <div>
                  <img src={product.image} alt={product.title} className="w-full h-48 object-cover mb-4 rounded" />
                  <h3 className="font-medium text-gray-900 line-clamp-2 leading-snug mb-1">{product.title}</h3>
                  <div className="flex items-center gap-1 text-sm text-amber-500 mb-1">
                    {"★".repeat(Math.floor(product.rating))}
                    <span className="text-gray-500 text-xs ml-1">({product.reviews})</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900 mb-1">
                    <span className="text-xs align-top">$</span>{product.price.toFixed(2)}
                  </div>
                  {product.prime && (
                    <div className="text-xs font-bold text-cyan-700 mb-4">
                      <i className="fa-solid fa-check text-amber-500"></i> prime
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium py-1.5 px-4 rounded-full transition-colors text-sm shadow-sm"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);