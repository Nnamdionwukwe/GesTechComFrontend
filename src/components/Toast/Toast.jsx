import React, { useEffect } from "react";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";
import styles from "./Toast.module.css";

const Toast = ({ type = "success", message, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const Icon = icons[type] || icons.success;

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.toastIcon}>
        <Icon size={20} />
      </div>
      <div className={styles.toastMessage}>{message}</div>
      <button onClick={onClose} className={styles.toastClose}>
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;
