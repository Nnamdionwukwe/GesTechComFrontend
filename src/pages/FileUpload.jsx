import React, { useState, useRef } from "react";
import {
  Upload,
  X,
  File,
  Image as ImageIcon,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader,
  Trash2,
  Download,
} from "lucide-react";
import styles from "./FileUpload.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const FileUpload = ({
  type = "general",
  multiple = false,
  maxFiles = 5,
  onUploadSuccess,
  onUploadError,
}) => {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Get file icon based on type
  const getFileIcon = (file) => {
    if (file.type?.startsWith("image/")) return ImageIcon;
    if (file.type?.includes("pdf")) return FileText;
    return File;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Handle file selection
  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList);

    if (!multiple && newFiles.length > 1) {
      setError("Please select only one file");
      return;
    }

    if (multiple && newFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setError(null);
    setFiles(newFiles);
  };

  // Remove file from selection
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // Upload files
  const uploadFiles = async () => {
    if (files.length === 0) {
      setError("Please select files to upload");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();

      if (multiple) {
        files.forEach((file) => formData.append("files", file));
      } else {
        formData.append("file", files[0]);
      }

      const endpoint = multiple ? "multiple" : "single";
      const token = localStorage.getItem("token"); // Adjust based on your auth setup

      const response = await fetch(
        `${API_URL}/api/upload/${type}/${endpoint}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      // Handle success
      const uploaded = multiple ? data.files : [data.file];
      setUploadedFiles([...uploadedFiles, ...uploaded]);
      setFiles([]);

      if (onUploadSuccess) {
        onUploadSuccess(data);
      }
    } catch (err) {
      setError(err.message);
      if (onUploadError) {
        onUploadError(err);
      }
    } finally {
      setUploading(false);
    }
  };

  // Delete uploaded file
  const deleteFile = async (filename) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/upload/${type}/${filename}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      setUploadedFiles(uploadedFiles.filter((f) => f.filename !== filename));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      {/* Upload Area */}
      <div
        className={`${styles.dropzone} ${dragActive ? styles.active : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className={styles.fileInput}
          accept="image/*,.pdf,.doc,.docx"
        />

        <div className={styles.dropzoneContent}>
          <div className={styles.uploadIcon}>
            <Upload size={48} />
          </div>
          <h3>Drop files here or click to browse</h3>
          <p className={styles.hint}>
            {multiple
              ? `Upload up to ${maxFiles} files (Images, PDFs, Documents)`
              : "Upload a single file (Images, PDFs, Documents)"}
          </p>
          <p className={styles.sizeLimit}>Maximum file size: 10MB</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className={styles.error}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Selected Files */}
      {files.length > 0 && (
        <div className={styles.selectedFiles}>
          <div className={styles.sectionHeader}>
            <h4>Selected Files ({files.length})</h4>
          </div>

          <div className={styles.fileList}>
            {files.map((file, index) => {
              const Icon = getFileIcon(file);
              return (
                <div key={index} className={styles.fileItem}>
                  <div className={styles.fileIcon}>
                    <Icon size={24} />
                  </div>
                  <div className={styles.fileInfo}>
                    <p className={styles.fileName}>{file.name}</p>
                    <p className={styles.fileSize}>
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className={styles.removeBtn}
                  >
                    <X size={18} />
                  </button>
                </div>
              );
            })}
          </div>

          <button
            onClick={uploadFiles}
            disabled={uploading}
            className={styles.uploadBtn}
          >
            {uploading ? (
              <>
                <Loader size={20} className={styles.spinner} />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={20} />
                Upload {files.length} {files.length === 1 ? "File" : "Files"}
              </>
            )}
          </button>
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className={styles.uploadedFiles}>
          <div className={styles.sectionHeader}>
            <h4>Uploaded Files ({uploadedFiles.length})</h4>
          </div>

          <div className={styles.fileList}>
            {uploadedFiles.map((file, index) => (
              <div key={index} className={styles.fileItem}>
                <div className={styles.fileIcon}>
                  <CheckCircle size={24} className={styles.successIcon} />
                </div>
                <div className={styles.fileInfo}>
                  <p className={styles.fileName}>{file.originalName}</p>
                  <p className={styles.fileSize}>{formatFileSize(file.size)}</p>
                </div>
                <div className={styles.fileActions}>
                  <a
                    href={`${API_URL}${file.url}`}
                    download
                    className={styles.actionBtn}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download size={18} />
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(file.filename);
                    }}
                    className={styles.actionBtn}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
