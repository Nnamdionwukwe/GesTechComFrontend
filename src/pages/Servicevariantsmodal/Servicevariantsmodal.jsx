import React, { useState } from "react";
import { X, Check, Clock, ShoppingCart } from "lucide-react";
import styles from "./Servicevariantsmodal.module.css";
import { useToast } from "../../components/Toast/Toastcontainer";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const ServiceVariantsModal = ({ service, isOpen, onClose, onAddToCart }) => {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  if (!isOpen) return null;

  const handleAddToCart = async (variant) => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.warning("Please login to add items to cart");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
        return;
      }

      const response = await fetch(`${API_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceVariantId: variant.id,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Call parent callback to update cart count
        if (onAddToCart) {
          onAddToCart(data.data);
        }

        // Show success toast
        toast.success(`${variant.name} added to cart successfully!`);
        onClose();
      } else {
        const errorMessage =
          data.error || data.message || "Failed to add to cart";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("💥 Exception occurred:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasVariants = service.variants && service.variants.length > 0;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>{service.name}</h2>
            <p className={styles.modalSubtitle}>
              {hasVariants
                ? "Choose the perfect variant for your needs"
                : service.tagline}
            </p>
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.modalBody}>
          {hasVariants ? (
            <div className={styles.variantsGrid}>
              {service.variants.map((variant) => (
                <div
                  key={variant.id}
                  className={`${styles.variantCard} ${
                    selectedVariant?.id === variant.id ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedVariant(variant)}
                >
                  <div className={styles.variantHeader}>
                    <h3 className={styles.variantName}>{variant.name}</h3>
                    <div className={styles.variantPrice}>
                      ₦{parseFloat(variant.price).toLocaleString()}
                    </div>
                  </div>

                  <p className={styles.variantDescription}>
                    {variant.description}
                  </p>

                  {variant.duration && (
                    <div className={styles.variantDuration}>
                      <Clock size={16} />
                      <span>{variant.duration}</span>
                    </div>
                  )}

                  {variant.features && variant.features.length > 0 && (
                    <div className={styles.variantFeatures}>
                      <h4 className={styles.featuresTitle}>What's Included:</h4>
                      <ul className={styles.featuresList}>
                        {variant.features.slice(0, 5).map((feature, idx) => (
                          <li key={idx} className={styles.featureItem}>
                            <Check size={16} />
                            <span>{feature}</span>
                          </li>
                        ))}
                        {variant.features.length > 5 && (
                          <li className={styles.moreFeatures}>
                            +{variant.features.length - 5} more features
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  <button
                    className={styles.addToCartButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(variant);
                    }}
                    disabled={loading}
                  >
                    <ShoppingCart size={18} />
                    {loading ? "Adding..." : "Add to Cart"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noVariants}>
              <div className={styles.noVariantsContent}>
                <ShoppingCart size={48} className={styles.noVariantsIcon} />
                <h3>Contact Us for Pricing</h3>
                <p>
                  This service requires a custom quote based on your specific
                  needs. Get in touch with our team for a personalized
                  consultation.
                </p>
                <div className={styles.contactButtons}>
                  <button
                    className={styles.contactButton}
                    onClick={() => {
                      window.location.href = "/contact";
                    }}
                  >
                    Contact Us
                  </button>
                  <button
                    className={styles.learnMoreButton}
                    onClick={() => {
                      window.location.href = `/services/${service.slug}`;
                    }}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceVariantsModal;
