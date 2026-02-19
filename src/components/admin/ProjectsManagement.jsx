import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Star,
  ExternalLink,
  Github,
  Globe,
  Calendar,
  Users,
  Code,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  X,
  Save,
  AlertCircle,
  Filter,
} from "lucide-react";
import styles from "./ProjectsManagement.module.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const ProjectsManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create', 'edit', 'view'
  const [selectedProject, setSelectedProject] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    service_name: "",
    client_name: "",
    client_logo: "",
    description: "",
    challenge: "",
    solution: "",
    results: [],
    technologies: [],
    features: [],
    team_size: "",
    duration: "",
    year: new Date().getFullYear(),
    thumbnail: "",
    hero_image: "",
    gallery_images: [],
    demo_url: "",
    github_url: "",
    case_study_url: "",
    is_featured: false,
    is_published: true,
    display_order: 0,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/agency/portfolio`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setProjects(data.data.projects || data.data);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Auto-generate slug from title
    if (name === "title" && modalMode === "create") {
      setFormData((prev) => ({
        ...prev,
        slug: value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      }));
    }
  };

  const handleArrayInput = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      const url =
        modalMode === "create"
          ? `${API_URL}/api/admin/projects`
          : `${API_URL}/api/admin/projects/${selectedProject.id}`;

      const method = modalMode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(
          `Project ${modalMode === "create" ? "created" : "updated"} successfully!`,
        );
        setShowModal(false);
        resetForm();
        fetchProjects();
      } else {
        setError(data.error || "Operation failed");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("Failed to save project");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/admin/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Project deleted successfully!");
        fetchProjects();
      } else {
        setError(data.error || "Failed to delete project");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete project");
    }
  };

  const openModal = (mode, project = null) => {
    setModalMode(mode);
    setSelectedProject(project);

    if (mode === "create") {
      resetForm();
    } else if (project) {
      setFormData({
        title: project.title || "",
        slug: project.slug || "",
        category: project.category || "",
        service_name: project.service_name || "",
        client_name: project.client_name || "",
        client_logo: project.client_logo || "",
        description: project.description || "",
        challenge: project.challenge || "",
        solution: project.solution || "",
        results: Array.isArray(project.results) ? project.results : [],
        technologies: Array.isArray(project.technologies)
          ? project.technologies
          : [],
        features: Array.isArray(project.features) ? project.features : [],
        team_size: project.team_size || "",
        duration: project.duration || "",
        year: project.year || new Date().getFullYear(),
        thumbnail: project.thumbnail || "",
        hero_image: project.hero_image || "",
        gallery_images: Array.isArray(project.gallery_images)
          ? project.gallery_images
          : [],
        demo_url: project.demo_url || "",
        github_url: project.github_url || "",
        case_study_url: project.case_study_url || "",
        is_featured: project.is_featured || false,
        is_published: project.is_published !== false,
        display_order: project.display_order || 0,
      });
    }

    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      category: "",
      service_name: "",
      client_name: "",
      client_logo: "",
      description: "",
      challenge: "",
      solution: "",
      results: [],
      technologies: [],
      features: [],
      team_size: "",
      duration: "",
      year: new Date().getFullYear(),
      thumbnail: "",
      hero_image: "",
      gallery_images: [],
      demo_url: "",
      github_url: "",
      case_study_url: "",
      is_featured: false,
      is_published: true,
      display_order: 0,
    });
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || project.category === filterCategory;

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "published" && project.is_published) ||
      (filterStatus === "draft" && !project.is_published) ||
      (filterStatus === "featured" && project.is_featured);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [
    ...new Set(projects.map((p) => p.category).filter(Boolean)),
  ];

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>Portfolio Projects</h2>
          <p className={styles.subtitle}>
            {projects.length} total project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          className={styles.primaryBtn}
          onClick={() => openModal("create")}
        >
          <Plus size={20} />
          Add New Project
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className={styles.alert + " " + styles.alertError}>
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X size={18} />
          </button>
        </div>
      )}

      {success && (
        <div className={styles.alert + " " + styles.alertSuccess}>
          <CheckCircle size={20} />
          <span>{success}</span>
          <button onClick={() => setSuccess(null)}>
            <X size={18} />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <Filter size={18} />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="featured">Featured</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className={styles.projectsGrid}>
        {filteredProjects.length === 0 ? (
          <div className={styles.emptyState}>
            <ImageIcon size={48} />
            <h3>No projects found</h3>
            <p>
              {searchTerm || filterCategory !== "all" || filterStatus !== "all"
                ? "Try adjusting your filters"
                : "Get started by creating your first project"}
            </p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.projectImage}>
                {project.thumbnail ? (
                  <img src={project.thumbnail} alt={project.title} />
                ) : (
                  <div className={styles.placeholder}>
                    <ImageIcon size={40} />
                  </div>
                )}
                {project.is_featured && (
                  <span className={styles.featuredBadge}>
                    <Star size={14} />
                    Featured
                  </span>
                )}
              </div>

              <div className={styles.projectContent}>
                <div className={styles.projectMeta}>
                  {project.category && (
                    <span className={styles.category}>{project.category}</span>
                  )}
                  <span
                    className={`${styles.status} ${project.is_published ? styles.published : styles.draft}`}
                  >
                    {project.is_published ? (
                      <>
                        <CheckCircle size={14} /> Published
                      </>
                    ) : (
                      <>
                        <XCircle size={14} /> Draft
                      </>
                    )}
                  </span>
                </div>

                <h3 className={styles.projectTitle}>{project.title}</h3>

                {project.client_name && (
                  <p className={styles.projectClient}>
                    Client: {project.client_name}
                  </p>
                )}

                <p className={styles.projectDescription}>
                  {project.description?.substring(0, 100)}
                  {project.description?.length > 100 ? "..." : ""}
                </p>

                <div className={styles.projectStats}>
                  {project.year && (
                    <span>
                      <Calendar size={14} />
                      {project.year}
                    </span>
                  )}
                  {project.team_size && (
                    <span>
                      <Users size={14} />
                      {project.team_size}
                    </span>
                  )}
                  {project.technologies?.length > 0 && (
                    <span>
                      <Code size={14} />
                      {project.technologies.length} tech
                      {project.technologies.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                <div className={styles.projectLinks}>
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.linkBtn}
                    >
                      <Globe size={14} />
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.linkBtn}
                    >
                      <Github size={14} />
                    </a>
                  )}
                  {project.case_study_url && (
                    <a
                      href={project.case_study_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.linkBtn}
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>

                <div className={styles.projectActions}>
                  <button
                    className={styles.actionBtn}
                    onClick={() => openModal("view", project)}
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    className={styles.actionBtn}
                    onClick={() => openModal("edit", project)}
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    className={styles.actionBtn + " " + styles.danger}
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>
                {modalMode === "create" && "Add New Project"}
                {modalMode === "edit" && "Edit Project"}
                {modalMode === "view" && "Project Details"}
              </h3>
              <button
                className={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className={styles.modalContent}>
              {modalMode === "view" ? (
                <ProjectView project={selectedProject} formData={formData} />
              ) : (
                <ProjectForm
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleArrayInput={handleArrayInput}
                  handleSubmit={handleSubmit}
                  modalMode={modalMode}
                  onCancel={() => setShowModal(false)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Project View Component
const ProjectView = ({ formData }) => (
  <div className={styles.viewContainer}>
    <div className={styles.viewSection}>
      <h4>Basic Information</h4>
      <div className={styles.viewGrid}>
        <div className={styles.viewItem}>
          <span className={styles.viewLabel}>Title:</span>
          <span>{formData.title}</span>
        </div>
        <div className={styles.viewItem}>
          <span className={styles.viewLabel}>Slug:</span>
          <span>{formData.slug}</span>
        </div>
        <div className={styles.viewItem}>
          <span className={styles.viewLabel}>Category:</span>
          <span>{formData.category}</span>
        </div>
        <div className={styles.viewItem}>
          <span className={styles.viewLabel}>Service:</span>
          <span>{formData.service_name}</span>
        </div>
        <div className={styles.viewItem}>
          <span className={styles.viewLabel}>Client:</span>
          <span>{formData.client_name}</span>
        </div>
        <div className={styles.viewItem}>
          <span className={styles.viewLabel}>Year:</span>
          <span>{formData.year}</span>
        </div>
      </div>
    </div>

    {formData.description && (
      <div className={styles.viewSection}>
        <h4>Description</h4>
        <p>{formData.description}</p>
      </div>
    )}

    {formData.challenge && (
      <div className={styles.viewSection}>
        <h4>Challenge</h4>
        <p>{formData.challenge}</p>
      </div>
    )}

    {formData.solution && (
      <div className={styles.viewSection}>
        <h4>Solution</h4>
        <p>{formData.solution}</p>
      </div>
    )}

    {formData.technologies?.length > 0 && (
      <div className={styles.viewSection}>
        <h4>Technologies</h4>
        <div className={styles.tagList}>
          {formData.technologies.map((tech, idx) => (
            <span key={idx} className={styles.tag}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    )}

    {formData.features?.length > 0 && (
      <div className={styles.viewSection}>
        <h4>Features</h4>
        <ul>
          {formData.features.map((feature, idx) => (
            <li key={idx}>{feature}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

// Project Form Component
const ProjectForm = ({
  formData,
  handleInputChange,
  handleArrayInput,
  handleSubmit,
  modalMode,
  onCancel,
}) => (
  <form onSubmit={handleSubmit} className={styles.form}>
    <div className={styles.formGrid}>
      {/* Basic Info */}
      <div className={styles.formGroup}>
        <label>
          Title <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          placeholder="E.g., E-Commerce Platform"
        />
      </div>

      <div className={styles.formGroup}>
        <label>
          Slug <span className={styles.required}>*</span>
        </label>
        <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleInputChange}
          required
          placeholder="e-commerce-platform"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
        >
          <option value="">Select category</option>
          <option value="Web Development">Web Development</option>
          <option value="Mobile App">Mobile App</option>
          <option value="E-Commerce">E-Commerce</option>
          <option value="Enterprise Software">Enterprise Software</option>
          <option value="UI/UX Design">UI/UX Design</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Service Name</label>
        <input
          type="text"
          name="service_name"
          value={formData.service_name}
          onChange={handleInputChange}
          placeholder="E.g., Custom Web Development"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Client Name</label>
        <input
          type="text"
          name="client_name"
          value={formData.client_name}
          onChange={handleInputChange}
          placeholder="Acme Corporation"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Year</label>
        <input
          type="number"
          name="year"
          value={formData.year}
          onChange={handleInputChange}
          min="2000"
          max="2100"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Team Size</label>
        <input
          type="text"
          name="team_size"
          value={formData.team_size}
          onChange={handleInputChange}
          placeholder="E.g., 5 members"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Duration</label>
        <input
          type="text"
          name="duration"
          value={formData.duration}
          onChange={handleInputChange}
          placeholder="E.g., 3 months"
        />
      </div>
    </div>

    {/* Description */}
    <div className={styles.formGroup}>
      <label>Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        rows="3"
        placeholder="Brief project description..."
      />
    </div>

    <div className={styles.formGroup}>
      <label>Challenge</label>
      <textarea
        name="challenge"
        value={formData.challenge}
        onChange={handleInputChange}
        rows="3"
        placeholder="What challenges did the project face?"
      />
    </div>

    <div className={styles.formGroup}>
      <label>Solution</label>
      <textarea
        name="solution"
        value={formData.solution}
        onChange={handleInputChange}
        rows="3"
        placeholder="How were the challenges solved?"
      />
    </div>

    {/* Arrays */}
    <div className={styles.formGroup}>
      <label>Technologies (comma-separated)</label>
      <input
        type="text"
        value={formData.technologies.join(", ")}
        onChange={(e) => handleArrayInput("technologies", e.target.value)}
        placeholder="React, Node.js, MongoDB"
      />
    </div>

    <div className={styles.formGroup}>
      <label>Features (comma-separated)</label>
      <input
        type="text"
        value={formData.features.join(", ")}
        onChange={(e) => handleArrayInput("features", e.target.value)}
        placeholder="User authentication, Real-time chat, Analytics"
      />
    </div>

    {/* Images & URLs */}
    <div className={styles.formGrid}>
      <div className={styles.formGroup}>
        <label>Thumbnail URL</label>
        <input
          type="url"
          name="thumbnail"
          value={formData.thumbnail}
          onChange={handleInputChange}
          placeholder="https://example.com/thumb.jpg"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Hero Image URL</label>
        <input
          type="url"
          name="hero_image"
          value={formData.hero_image}
          onChange={handleInputChange}
          placeholder="https://example.com/hero.jpg"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Demo URL</label>
        <input
          type="url"
          name="demo_url"
          value={formData.demo_url}
          onChange={handleInputChange}
          placeholder="https://demo.example.com"
        />
      </div>

      <div className={styles.formGroup}>
        <label>GitHub URL</label>
        <input
          type="url"
          name="github_url"
          value={formData.github_url}
          onChange={handleInputChange}
          placeholder="https://github.com/user/repo"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Case Study URL</label>
        <input
          type="url"
          name="case_study_url"
          value={formData.case_study_url}
          onChange={handleInputChange}
          placeholder="https://example.com/case-study"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Display Order</label>
        <input
          type="number"
          name="display_order"
          value={formData.display_order}
          onChange={handleInputChange}
          min="0"
        />
      </div>
    </div>

    {/* Checkboxes */}
    <div className={styles.checkboxGroup}>
      <label className={styles.checkbox}>
        <input
          type="checkbox"
          name="is_featured"
          checked={formData.is_featured}
          onChange={handleInputChange}
        />
        <span>Featured Project</span>
      </label>

      <label className={styles.checkbox}>
        <input
          type="checkbox"
          name="is_published"
          checked={formData.is_published}
          onChange={handleInputChange}
        />
        <span>Published</span>
      </label>
    </div>

    {/* Actions */}
    <div className={styles.formActions}>
      <button type="button" className={styles.cancelBtn} onClick={onCancel}>
        Cancel
      </button>
      <button type="submit" className={styles.submitBtn}>
        <Save size={20} />
        {modalMode === "create" ? "Create Project" : "Update Project"}
      </button>
    </div>
  </form>
);

export default ProjectsManagement;
