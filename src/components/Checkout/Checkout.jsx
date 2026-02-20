import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  CreditCard,
  Building2,
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
  Lock,
  CheckCircle,
} from "lucide-react";
import styles from "./Checkout.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

// ── Load Paystack script once ──────────────────────────────────────────────
const loadPaystackScript = () =>
  new Promise((resolve) => {
    if (document.getElementById("paystack-script")) return resolve(true);
    const script = document.createElement("script");
    script.id = "paystack-script";
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const [paystackReady, setPaystackReady] = useState(false);

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
    loadPaystackScript().then(setPaystackReady);
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
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
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const handleShippingChange = (e) =>
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });

  const handleBillingChange = (e) =>
    setBillingAddress({ ...billingAddress, [e.target.name]: e.target.value });

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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingAddress.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleContinueToReview = () => {
    if (!validateShipping()) return;
    setError(null);
    setStep(2);
  };

  // ── Create order in backend ──────────────────────────────────────────────
  const createOrder = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        shippingAddress,
        billingAddress: sameAsShipping ? shippingAddress : billingAddress,
        paymentMethod,
        notes,
      }),
    });
    const data = await response.json();
    if (!data.success)
      throw new Error(data.message || data.error || "Failed to create order");
    return data.data;
  };

  // ── Paystack inline popup ────────────────────────────────────────────────
  const handlePaystackCheckout = useCallback(async () => {
    if (!paystackReady || !window.PaystackPop) {
      setError("Payment system not ready. Please refresh and try again.");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // 1. Create order first
      const order = await createOrder();

      // 2. Get Paystack public key + initialize reference from your backend
      const token = localStorage.getItem("token");
      const initRes = await fetch(`${API_URL}/api/paystack/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: order.id,
          email: shippingAddress.email,
          amount: cart.total,
        }),
      });

      const initData = await initRes.json();

      if (!initData.success) {
        throw new Error(initData.error || "Payment initialization failed");
      }

      const { reference, public_key } = initData.data;

      // 3. Open Paystack popup — card details are entered here on Paystack's UI
      const handler = window.PaystackPop.setup({
        key: public_key,
        email: shippingAddress.email,
        amount: Math.round(parseFloat(cart.total) * 100), // Paystack needs kobo
        currency: "NGN",
        ref: reference,
        metadata: {
          order_id: order.id,
          order_number: order.order_number,
          customer_name: shippingAddress.name,
          phone: shippingAddress.phone,
        },
        onClose: () => {
          setProcessing(false);
          setError(
            "Payment cancelled. Your order has been saved — you can complete payment anytime.",
          );
        },
        callback: (response) => {
          // Payment successful — verify on backend
          verifyPayment(response.reference, order);
        },
      });

      handler.openIframe();
    } catch (err) {
      console.error("Paystack checkout error:", err);
      setError(err.message || "Failed to initialize payment");
      setProcessing(false);
    }
  }, [
    paystackReady,
    cart,
    shippingAddress,
    notes,
    sameAsShipping,
    billingAddress,
  ]);

  // ── Verify payment with backend after Paystack callback ─────────────────
  const verifyPayment = async (reference, order) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/paystack/verify/${reference}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        navigate("/order-confirmation", {
          state: {
            order,
            paymentMethod: "paystack",
            paymentReference: reference,
          },
        });
      } else {
        setError(
          "Payment verification failed. Please contact support with your reference: " +
            reference,
        );
        setProcessing(false);
      }
    } catch {
      setError(
        "Could not verify payment. Please contact support with reference: " +
          reference,
      );
      setProcessing(false);
    }
  };

  // ── Bank transfer flow ───────────────────────────────────────────────────
  const handleBankTransferCheckout = async () => {
    setProcessing(true);
    setError(null);

    try {
      const order = await createOrder();
      navigate("/order-confirmation", {
        state: {
          order,
          paymentMethod: "bank_transfer",
          bankDetails: {
            bankName: "Access Bank",
            accountName: "GesTechCom Limited",
            accountNumber: "0123456789",
          },
          instructions:
            "Please transfer the exact amount and use your order number as reference.",
        },
      });
    } catch (err) {
      setError(err.message || "Failed to complete checkout");
      setProcessing(false);
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === "paystack") handlePaystackCheckout();
    else handleBankTransferCheckout();
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
          <div className={styles.steps}>
            <div
              className={`${styles.stepItem} ${step >= 1 ? styles.active : ""}`}
            >
              <div className={styles.stepNumber}>
                {step > 1 ? <CheckCircle size={20} /> : "1"}
              </div>
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

      {/* Error */}
      {error && (
        <div className={styles.error}>
          <div className={styles.container}>
            <AlertCircle size={20} />
            <span>{error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        </div>
      )}

      {/* Main */}
      <section className={styles.mainSection}>
        <div className={styles.container}>
          <div className={styles.checkoutGrid}>
            {/* Left: Forms */}
            <div className={styles.formsSection}>
              {step === 1 ? (
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
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
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
                    Continue to Review <ArrowRight size={20} />
                  </button>
                </div>
              ) : (
                <div className={styles.formCard}>
                  <h2>
                    <Package size={24} />
                    Review & Payment
                  </h2>

                  {/* Shipping Summary */}
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

                  {/* Payment Method */}
                  <div className={styles.paymentMethods}>
                    <h3>Payment Method</h3>
                    <div className={styles.paymentOptions}>
                      {/* Paystack Option */}
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
                            <strong>Pay with Card (Paystack)</strong>
                            <p>Debit/credit card via secure Paystack popup</p>
                            <div className={styles.cardBadges}>
                              <span className={styles.cardBadge}>Visa</span>
                              <span className={styles.cardBadge}>
                                Mastercard
                              </span>
                              <span className={styles.cardBadge}>Verve</span>
                            </div>
                          </div>
                        </div>
                      </label>

                      {/* Paystack info panel — shows when selected */}
                      {paymentMethod === "paystack" && (
                        <div className={styles.paystackInfoPanel}>
                          <div className={styles.paystackInfoIcon}>
                            <Lock size={20} />
                          </div>
                          <div>
                            <strong>How it works</strong>
                            <p>
                              When you click <em>"Pay Now"</em>, a secure
                              Paystack popup will open where you enter your card
                              details. Your card information is handled entirely
                              by Paystack and never touches our servers.
                            </p>
                            <div className={styles.paystackBadgeRow}>
                              <Shield size={14} />
                              <span>
                                256-bit SSL · PCI DSS Compliant · 3D Secure
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Bank Transfer Option */}
                      {/* <label
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
                            <small
                              style={{
                                color: "var(--text-secondary)",
                                fontSize: "0.8rem",
                              }}
                            >
                              Manual verification required (1–24 hours)
                            </small>
                          </div>
                        </div>
                      </label> */}

                      {/* Bank transfer info panel */}
                      {/* {paymentMethod === "bank_transfer" && (
                        <div className={styles.bankInfoPanel}>
                          <h4>Bank Account Details</h4>
                          <div className={styles.bankDetail}>
                            <span>Bank Name</span>
                            <strong>Access Bank</strong>
                          </div>
                          <div className={styles.bankDetail}>
                            <span>Account Name</span>
                            <strong>GesTechCom Limited</strong>
                          </div>
                          <div className={styles.bankDetail}>
                            <span>Account Number</span>
                            <strong className={styles.accountNumber}>
                              0123456789
                            </strong>
                          </div>
                          <p className={styles.bankNote}>
                            ⚠️ Use your order number as payment reference after
                            placing the order.
                          </p>
                        </div>
                      )} */}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className={styles.formGroup}>
                    <label>Order Notes (Optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special instructions for your order?"
                      rows="3"
                    />
                  </div>

                  {/* Actions */}
                  <div className={styles.actionButtons}>
                    <button
                      onClick={() => setStep(1)}
                      className={styles.backBtn}
                      disabled={processing}
                    >
                      <ArrowLeft size={20} /> Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      className={styles.placeOrderBtn}
                      disabled={processing}
                    >
                      {processing ? (
                        <>
                          <Loader size={20} className={styles.spinIcon} />
                          {paymentMethod === "paystack"
                            ? "Opening payment..."
                            : "Processing..."}
                        </>
                      ) : (
                        <>
                          {paymentMethod === "paystack" ? (
                            <>
                              <CreditCard size={20} />
                              Pay ₦{parseFloat(cart?.total)?.toLocaleString()}
                            </>
                          ) : (
                            <>
                              <Shield size={20} />
                              Place Order
                            </>
                          )}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Order Summary */}
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
                            : `${item.service?.name} — ${item.variant?.name}`}
                        </span>
                        <span className={styles.itemQty}>
                          × {item.quantity}
                        </span>
                      </div>
                      <span className={styles.itemPrice}>
                        ₦
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
                    <span>₦{parseFloat(cart?.subtotal)?.toLocaleString()}</span>
                  </div>
                  <div className={styles.divider}></div>
                  <div className={styles.summaryTotal}>
                    <span>Total</span>
                    <span>₦{parseFloat(cart?.total)?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className={styles.securityBadge}>
                <Shield size={20} />
                <div>
                  <strong>Secure Checkout</strong>
                  <p>Your information is always protected</p>
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
