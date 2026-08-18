import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import API from '../utils/axios';
import ProjectForm from '../components/admin/ProjectForm';
import Loader from '../components/ui/Loader';

function AdminDashboard() {
  const { admin, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects');
      setProjects(res.data.data);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await API.delete(`/projects/${id}`);
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProject(null);
    fetchProjects();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-6 py-8 transition-colors">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Welcome, {admin?.username}</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Projects ({projects.length})</h2>
          <button
            onClick={handleAddNew}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            + Add New Project
          </button>
        </div>

        {loading && <Loader />}

        {!loading && projects.length === 0 && (
          <p className="text-gray-600 dark:text-gray-400">No projects yet. Add your first one!</p>
        )}

        {!loading && projects.length > 0 && (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project._id} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5 flex items-center justify-between gap-4 shadow-sm dark:shadow-none">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-gray-900 dark:text-white font-semibold">{project.title}</h3>
                    {project.featured && (
                      <span className="text-xs bg-indigo-100 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded">Featured</span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-1">{project.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(project)}
                    className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-3 py-1.5 rounded text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="bg-red-600/80 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <ProjectForm
          project={editingProject}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

export default AdminDashboard;