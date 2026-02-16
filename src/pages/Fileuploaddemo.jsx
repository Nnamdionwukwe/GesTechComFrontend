import React, { useState } from "react";
import FileUpload from "./FileUpload";
import { Sun, Moon } from "lucide-react";
import styles from "./FileUploadDemo.module.css";

const FileUploadDemo = () => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const handleUploadSuccess = (data) => {
    console.log("Upload successful:", data);
    // You can add toast notifications, refresh lists, etc.
  };

  const handleUploadError = (error) => {
    console.error("Upload failed:", error);
    // You can add error notifications
  };

  return (
    <div className={styles.page}>
      {/* Theme Toggle */}
      <button
        className={styles.themeToggle}
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </button>

      {/* Header */}
      <header className={styles.header}>
        <h1>File Upload Manager</h1>
        <p>Upload and manage your files with ease</p>
      </header>

      {/* Single File Upload */}
      <section className={styles.section}>
        <h2>Single File Upload</h2>
        <p className={styles.description}>
          Upload a single file to the services directory
        </p>
        <FileUpload
          type="services"
          multiple={false}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />
      </section>

      {/* Multiple Files Upload */}
      <section className={styles.section}>
        <h2>Multiple Files Upload</h2>
        <p className={styles.description}>
          Upload up to 5 files to the projects directory
        </p>
        <FileUpload
          type="projects"
          multiple={true}
          maxFiles={5}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />
      </section>

      {/* Blog Images Upload */}
      <section className={styles.section}>
        <h2>Blog Images</h2>
        <p className={styles.description}>Upload images for your blog posts</p>
        <FileUpload
          type="blog"
          multiple={true}
          maxFiles={3}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />
      </section>
    </div>
  );
};

export default FileUploadDemo;
