import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  CreditCard,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  Mail,
  User,
  Home,
  ChevronRight,
  Loader,
  Shield,
} from "lucide-react";
import styles from "./Checkout.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("paystack");

  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
    postalCode: "",
  });

  const [billingAddress, setBillingAddress] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "Nigeria",
    postalCode: "",
    phone: "",
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [notes, setNotes] = useState("");

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
        if (!data.data.items || data.data.items.length === 0) {
          navigate("/cart");
          return;
        }
        setCart(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleShippingChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleBillingChange = (e) => {
    setBillingAddress({
      ...billingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const validateShipping = () => {
    const required = ["name", "email", "phone", "address", "city", "state"];
    for (let field of required) {
      if (!shippingAddress[field]) {
        setError(
          `Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`,
        );
        return false;
      }
    }
    return true;
  };

  const handleContinueToReview = () => {
    if (!validateShipping()) return;
    setError(null);
    setStep(2);
  };

  const handlePaystackCheckout = async () => {
    setProcessing(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/checkout/paystack/initialize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: shippingAddress.email,
            shippingAddress,
            billingAddress: sameAsShipping ? shippingAddress : billingAddress,
            notes,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        // Redirect to Paystack
        window.location.href = data.data.authorizationUrl;
      } else {
        setError(data.message || "Payment initialization failed");
      }
    } catch (err) {
      console.error("Paystack checkout error:", err);
      setError("Failed to initialize payment");
    } finally {
      setProcessing(false);
    }
  };

  const handleBankTransferCheckout = async () => {
    setProcessing(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/checkout/bank-transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          shippingAddress,
          billingAddress: sameAsShipping ? shippingAddress : billingAddress,
          notes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Navigate to bank transfer instructions page
        navigate("/order-confirmation", {
          state: {
            order: data.data.order,
            bankDetails: data.data.bankDetails,
            instructions: data.data.instructions,
          },
        });
      } else {
        setError(data.message || "Checkout failed");
      }
    } catch (err) {
      console.error("Bank transfer checkout error:", err);
      setError("Failed to complete checkout");
    } finally {
      setProcessing(false);
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === "paystack") {
      handlePaystackCheckout();
    } else {
      handleBankTransferCheckout();
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}>
            <Link to="/">Home</Link>
            <ChevronRight size={16} />
            <Link to="/cart">Cart</Link>
            <ChevronRight size={16} />
            <span>Checkout</span>
          </div>

          <h1 className={styles.title}>Checkout</h1>

          {/* Progress Steps */}
          <div className={styles.steps}>
            <div
              className={`${styles.stepItem} ${step >= 1 ? styles.active : ""}`}
            >
              <div className={styles.stepNumber}>1</div>
              <span>Shipping</span>
            </div>
            <div className={styles.stepLine}></div>
            <div
              className={`${styles.stepItem} ${step >= 2 ? styles.active : ""}`}
            >
              <div className={styles.stepNumber}>2</div>
              <span>Review & Pay</span>
            </div>
          </div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className={styles.error}>
          <div className={styles.container}>
            <AlertCircle size={20} />
            <span>{error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <section className={styles.mainSection}>
        <div className={styles.container}>
          <div className={styles.checkoutGrid}>
            {/* Left Column - Forms */}
            <div className={styles.formsSection}>
              {step === 1 ? (
                <>
                  {/* Shipping Information */}
                  <div className={styles.formCard}>
                    <h2>
                      <MapPin size={24} />
                      Shipping Information
                    </h2>

                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label>
                          <User size={16} />
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={shippingAddress.name}
                          onChange={handleShippingChange}
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>
                          <Mail size={16} />
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={shippingAddress.email}
                          onChange={handleShippingChange}
                          placeholder="john@example.com"
                          required
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>
                          <Phone size={16} />
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={shippingAddress.phone}
                          onChange={handleShippingChange}
                          placeholder="+234 800 000 0000"
                          required
                        />
                      </div>

                      <div
                        className={`${styles.formGroup} ${styles.fullWidth}`}
                      >
                        <label>
                          <Home size={16} />
                          Street Address *
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={shippingAddress.address}
                          onChange={handleShippingChange}
                          placeholder="123 Main Street, Apartment 4B"
                          required
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>City *</label>
                        <input
                          type="text"
                          name="city"
                          value={shippingAddress.city}
                          onChange={handleShippingChange}
                          placeholder="Lagos"
                          required
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>State *</label>
                        <input
                          type="text"
                          name="state"
                          value={shippingAddress.state}
                          onChange={handleShippingChange}
                          placeholder="Lagos State"
                          required
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>Postal Code</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={shippingAddress.postalCode}
                          onChange={handleShippingChange}
                          placeholder="100001"
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>Country</label>
                        <input
                          type="text"
                          name="country"
                          value={shippingAddress.country}
                          onChange={handleShippingChange}
                          readOnly
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleContinueToReview}
                      className={styles.continueBtn}
                    >
                      Continue to Review
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Review Order */}
                  <div className={styles.formCard}>
                    <h2>
                      <Package size={24} />
                      Review Your Order
                    </h2>

                    {/* Shipping Address Summary */}
                    <div className={styles.addressSummary}>
                      <h3>Shipping Address</h3>
                      <p>{shippingAddress.name}</p>
                      <p>{shippingAddress.address}</p>
                      <p>
                        {shippingAddress.city}, {shippingAddress.state}{" "}
                        {shippingAddress.postalCode}
                      </p>
                      <p>{shippingAddress.country}</p>
                      <p>{shippingAddress.phone}</p>
                      <p>{shippingAddress.email}</p>
                      <button
                        onClick={() => setStep(1)}
                        className={styles.editBtn}
                      >
                        Edit
                      </button>
                    </div>

                    {/* Payment Method Selection */}
                    <div className={styles.paymentMethods}>
                      <h3>Payment Method</h3>

                      <div className={styles.paymentOptions}>
                        <label
                          className={`${styles.paymentOption} ${paymentMethod === "paystack" ? styles.selected : ""}`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="paystack"
                            checked={paymentMethod === "paystack"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          />
                          <div className={styles.paymentContent}>
                            <CreditCard size={24} />
                            <div>
                              <strong>Card Payment (Paystack)</strong>
                              <p>Pay securely with your debit/credit card</p>
                            </div>
                          </div>
                        </label>

                        <label
                          className={`${styles.paymentOption} ${paymentMethod === "bank_transfer" ? styles.selected : ""}`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="bank_transfer"
                            checked={paymentMethod === "bank_transfer"}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          />
                          <div className={styles.paymentContent}>
                            <Building2 size={24} />
                            <div>
                              <strong>Bank Transfer</strong>
                              <p>Transfer directly to our bank account</p>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Order Notes */}
                    <div className={styles.formGroup}>
                      <label>Order Notes (Optional)</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any special instructions for your order?"
                        rows="4"
                      />
                    </div>

                    <div className={styles.actionButtons}>
                      <button
                        onClick={() => setStep(1)}
                        className={styles.backBtn}
                      >
                        <ArrowLeft size={20} />
                        Back to Shipping
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        className={styles.placeOrderBtn}
                        disabled={processing}
                      >
                        {processing ? (
                          <>
                            <Loader size={20} className={styles.spinIcon} />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Shield size={20} />
                            Place Order
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right Column - Order Summary */}
            <div className={styles.summarySection}>
              <div className={styles.summary}>
                <h2>Order Summary</h2>

                <div className={styles.summaryItems}>
                  {cart?.items?.map((item) => (
                    <div key={item.id} className={styles.summaryItem}>
                      <div className={styles.itemInfo}>
                        <span className={styles.itemName}>
                          {item.type === "product"
                            ? item.product?.name
                            : `${item.service?.name} - ${item.variant?.name}`}
                        </span>
                        <span className={styles.itemQty}>
                          × {item.quantity}
                        </span>
                      </div>
                      <span className={styles.itemPrice}>
                        #
                        {parseFloat(
                          item.price * item.quantity,
                        )?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={styles.summaryTotals}>
                  <div className={styles.summaryRow}>
                    <span>Subtotal</span>
                    <span>#{parseFloat(cart?.subtotal)?.toLocaleString()}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Shipping</span>
                    <span>Calculated at next step</span>
                  </div>
                  <div className={styles.divider}></div>
                  <div className={styles.summaryTotal}>
                    <span>Total</span>
                    <span>#{parseFloat(cart?.total)?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className={styles.securityBadge}>
                <Shield size={20} />
                <div>
                  <strong>Secure Checkout</strong>
                  <p>Your information is protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Checkout;
