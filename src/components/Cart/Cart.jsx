import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Package,
  ShoppingBag,
  AlertCircle,
  ChevronRight,
  X,
} from "lucide-react";
import styles from "./Cart.module.css";
import { useToast } from "../Toast/Toastcontainer";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setCart(data.data);
      } else {
        setError(data.error);
        toast.error(data.error || "Failed to load cart");
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setError("Failed to load cart");
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdating(true);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cartItemId, quantity: newQuantity }),
      });

      const data = await response.json();

      if (data.success) {
        setCart(data.data);
        toast.success("Cart updated successfully");
      } else {
        setError(data.error);
        toast.error(data.error || "Failed to update quantity");
      }
    } catch (err) {
      console.error("Failed to update quantity:", err);
      setError("Failed to update quantity");
      toast.error("Failed to update quantity");
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (cartItemId) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/cart/remove/${cartItemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setCart(data.data);
        toast.success("Item removed from cart");
      } else {
        setError(data.error);
        toast.error(data.error || "Failed to remove item");
      }
    } catch (err) {
      console.error("Failed to remove item:", err);
      setError("Failed to remove item");
      toast.error("Failed to remove item");
    } finally {
      setUpdating(false);
    }
  };

  const clearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;

    setUpdating(true);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/cart/clear`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setCart(data.data);
        toast.success("Cart cleared successfully");
      } else {
        setError(data.error);
        toast.error(data.error || "Failed to clear cart");
      }
    } catch (err) {
      console.error("Failed to clear cart:", err);
      setError("Failed to clear cart");
      toast.error("Failed to clear cart");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <div className={styles.page}>
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}>
            <Link to="/">Home</Link>
            <ChevronRight size={16} />
            <span>Shopping Cart</span>
          </div>

          <h1 className={styles.title}>
            <ShoppingCart size={32} />
            Your Shopping Cart
          </h1>

          {!isEmpty && (
            <p className={styles.subtitle}>
              {cart.items.length} {cart.items.length === 1 ? "item" : "items"}{" "}
              in your cart
            </p>
          )}
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className={styles.error}>
          <div className={styles.container}>
            <AlertCircle size={20} />
            <span>{error}</span>
            <button onClick={() => setError(null)}>
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <section className={styles.mainSection}>
        <div className={styles.container}>
          {isEmpty ? (
            <div className={styles.emptyCart}>
              <div className={styles.emptyIcon}>
                <ShoppingBag size={64} />
              </div>
              <h2>Your cart is empty</h2>
              <p>Start shopping to add items to your cart</p>
              <Link to="/" className={styles.shopButton}>
                <Package size={20} />
                Browse Products
              </Link>
            </div>
          ) : (
            <div className={styles.cartGrid}>
              {/* Cart Items */}
              <div className={styles.itemsSection}>
                <div className={styles.sectionHeader}>
                  <h2>Items</h2>
                  <button
                    onClick={clearCart}
                    className={styles.clearBtn}
                    disabled={updating}
                  >
                    <Trash2 size={16} />
                    Clear Cart
                  </button>
                </div>

                <div className={styles.items}>
                  {cart.items.map((item) => (
                    <div key={item.id} className={styles.cartItem}>
                      <div className={styles.itemImage}>
                        {item.type === "product" &&
                        item.product?.images?.[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                          />
                        ) : (
                          <div className={styles.placeholder}>
                            <Package size={32} />
                          </div>
                        )}
                      </div>

                      <div className={styles.itemDetails}>
                        <h3>
                          {item.type === "product"
                            ? item.product?.name
                            : `${item.service?.name} - ${item.variant?.name}`}
                        </h3>
                        <p>
                          {item.type === "product"
                            ? item.product?.description
                            : item.variant?.description}
                        </p>
                        {item.type === "product" && item.product?.stock && (
                          <span className={styles.stock}>
                            {item.product.stock} in stock
                          </span>
                        )}
                      </div>

                      <div className={styles.itemActions}>
                        <div className={styles.price}>
                          ₦{parseFloat(item.price).toLocaleString()}
                        </div>

                        <div className={styles.quantity}>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={updating || item.quantity <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={updating}
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className={styles.subtotal}>
                          ₦
                          {(
                            parseFloat(item.price) * item.quantity
                          ).toLocaleString()}
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className={styles.removeBtn}
                          disabled={updating}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className={styles.summarySection}>
                <div className={styles.summary}>
                  <h2>Order Summary</h2>

                  <div className={styles.summaryRow}>
                    <span>Subtotal</span>
                    <span>₦{parseFloat(cart.subtotal).toLocaleString()}</span>
                  </div>

                  <div className={styles.divider}></div>

                  <div className={styles.summaryTotal}>
                    <span>Total</span>
                    <span>₦{parseFloat(cart.total).toLocaleString()}</span>
                  </div>

                  <Link to="/checkout" className={styles.checkoutBtn}>
                    Proceed to Checkout
                    <ArrowRight size={20} />
                  </Link>

                  <Link to="/" className={styles.continueBtn}>
                    Continue Shopping
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className={styles.trustBadges}>
                  <div className={styles.badge}>
                    <Package size={20} />
                    <span>Secure Service Delivery</span>
                  </div>
                  <div className={styles.badge}>
                    <ShoppingBag size={20} />
                    <span>Secure Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Cart;
