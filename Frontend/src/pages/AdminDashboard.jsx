import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  FaChartPie,
  FaFolderOpen,
  FaEnvelope,
  FaUserCircle,
  FaCog,
  FaPlus,
  FaEdit,
  FaTrash,
  FaStar,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaArrowRight,
} from 'react-icons/fa';

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

  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      const res = await API.get('/projects');

      setProjects(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  /* =========================================================
     PROJECT ACTIONS
  ========================================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project?'
    );

    if (!confirmed) {
      return;
    }

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

  /* =========================================================
     DASHBOARD STATISTICS
  ========================================================= */

  const totalProjects = projects.length;

  const featuredProjects = projects.filter(
    (project) => project.featured
  ).length;

  const regularProjects =
    totalProjects - featuredProjects;

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const navigation = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <FaChartPie />,
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <FaFolderOpen />,
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: <FaEnvelope />,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <FaUserCircle />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <FaCog />,
    },
  ];

  const handleNavigation = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 transition-colors duration-500 dark:bg-gray-950 dark:text-white">

      {/* =====================================================
          MOBILE TOP BAR
      ====================================================== */}

      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 px-4 py-4 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/90 lg:hidden">
        <div className="flex items-center justify-between">

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Admin Panel
            </p>

            <h1 className="text-lg font-bold">
              Portfolio Dashboard
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Open sidebar"
          >
            <FaBars />
          </button>
        </div>
      </header>

      {/* =====================================================
          MOBILE SIDEBAR OVERLAY
      ====================================================== */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-200 bg-white transition-transform duration-300 dark:border-gray-800 dark:bg-gray-950 lg:translate-x-0 ${
          sidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full'
        }`}
      >

        {/* Sidebar Header */}

        <div className="flex h-20 items-center justify-between border-b border-gray-200 px-6 dark:border-gray-800">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              Admin
            </p>

            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Portfolio Panel
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 lg:hidden"
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>

        {/* Admin Profile */}

        <div className="border-b border-gray-200 p-5 dark:border-gray-800">
          <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-3 dark:bg-gray-900">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <FaUserCircle className="text-2xl" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                {admin?.username || 'Admin'}
              </p>

              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                Administrator
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">

          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            Dashboard
          </p>

          {navigation.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigation(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                activeSection === item.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white'
              }`}
            >
              <span className="text-base">
                {item.icon}
              </span>

              {item.label}

              {item.id === 'messages' && (
                <span className="ml-auto rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-bold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  Soon
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}

        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            <FaSignOutAlt />

            Logout
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="min-h-screen lg:ml-72">

        {/* ===================================================
            DESKTOP HEADER
        ==================================================== */}

        <header className="hidden border-b border-gray-200 bg-white/80 px-8 py-5 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/80 lg:block">
          <div className="flex items-center justify-between">

            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {activeSection === 'overview' &&
                  'Dashboard Overview'}

                {activeSection === 'projects' &&
                  'Projects'}

                {activeSection === 'messages' &&
                  'Messages'}

                {activeSection === 'profile' &&
                  'Admin Profile'}

                {activeSection === 'settings' &&
                  'Settings'}
              </h1>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage your portfolio from one place.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-gray-500 xl:block dark:text-gray-400">
                Welcome back,
              </span>

              <span className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                {admin?.username || 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* ===================================================
            PAGE CONTENT
        ==================================================== */}

        <div className="p-4 sm:p-6 lg:p-8">

          {/* =================================================
              OVERVIEW
          ================================================== */}

          {activeSection === 'overview' && (
            <section>

              <div className="mb-8">
                <p className="mb-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  Welcome back 👋
                </p>

                <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                  Portfolio Overview
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
                  Keep track of your portfolio projects and
                  manage your content from the admin panel.
                </p>
              </div>

              {/* Statistics */}

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

                {/* Total Projects */}

                <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Total Projects
                      </p>

                      <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">
                        {totalProjects}
                      </p>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-transform duration-300 group-hover:scale-110 dark:bg-indigo-500/10 dark:text-indigo-400">
                      <FaFolderOpen />
                    </div>
                  </div>
                </div>

                {/* Featured Projects */}

                <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Featured Projects
                      </p>

                      <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">
                        {featuredProjects}
                      </p>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-50 text-yellow-500 transition-transform duration-300 group-hover:scale-110 dark:bg-yellow-500/10">
                      <FaStar />
                    </div>
                  </div>
                </div>

                {/* Regular Projects */}

                <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Regular Projects
                      </p>

                      <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">
                        {regularProjects}
                      </p>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-transform duration-300 group-hover:scale-110 dark:bg-blue-500/10 dark:text-blue-400">
                      <FaChartPie />
                    </div>
                  </div>
                </div>

              </div>

              {/* Quick Actions */}

              <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">

                <div className="mb-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Quick Actions
                  </h3>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Frequently used portfolio actions.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">

                  <button
                    type="button"
                    onClick={handleAddNew}
                    className="group flex items-center justify-between rounded-2xl border border-gray-200 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md dark:border-gray-800 dark:hover:border-indigo-500/30"
                  >
                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                        <FaPlus />
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          Add New Project
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Create a portfolio project
                        </p>
                      </div>
                    </div>

                    <FaArrowRight className="text-gray-400 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNavigation('projects')}
                    className="group flex items-center justify-between rounded-2xl border border-gray-200 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md dark:border-gray-800 dark:hover:border-indigo-500/30"
                  >
                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                        <FaFolderOpen />
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          Manage Projects
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Edit or delete projects
                        </p>
                      </div>
                    </div>

                    <FaArrowRight className="text-gray-400 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>

                </div>
              </div>

            </section>
          )}

          {/* =================================================
              PROJECTS
          ================================================== */}

          {activeSection === 'projects' && (
            <section>

              <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                    Projects
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Add, edit and manage your portfolio projects.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddNew}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl"
                >
                  <FaPlus />

                  Add New Project
                </button>

              </div>

              {/* Loading */}

              {loading && (
                <div className="flex min-h-64 items-center justify-center rounded-3xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                  <Loader />
                </div>
              )}

              {/* Empty */}

              {!loading && projects.length === 0 && (
                <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-900">

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800">
                    <FaFolderOpen className="text-2xl" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-gray-900 dark:text-white">
                    No projects yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
                    Add your first project to start building
                    your portfolio.
                  </p>

                  <button
                    type="button"
                    onClick={handleAddNew}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    <FaPlus />
                    Add Project
                  </button>
                </div>
              )}

              {/* Project List */}

              {!loading && projects.length > 0 && (
                <div className="grid gap-4">

                  {projects.map((project) => (
                    <article
                      key={project._id}
                      className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
                    >

                      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                        {/* Project Info */}

                        <div className="min-w-0 flex-1">

                          <div className="flex flex-wrap items-center gap-2">

                            <h3 className="text-base font-bold text-gray-900 dark:text-white">
                              {project.title}
                            </h3>

                            {project.featured && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-1 text-[11px] font-bold text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400">
                                <FaStar />

                                Featured
                              </span>
                            )}

                          </div>

                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                            {project.description}
                          </p>

                        </div>

                        {/* Actions */}

                        <div className="flex shrink-0 items-center gap-2">

                          <button
                            type="button"
                            onClick={() => handleEdit(project)}
                            className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                          >
                            <FaEdit />

                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(project._id)
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                          >
                            <FaTrash />

                            Delete
                          </button>

                        </div>

                      </div>
                    </article>
                  ))}

                </div>
              )}

            </section>
          )}

          {/* =================================================
              MESSAGES
          ================================================== */}

          {activeSection === 'messages' && (
            <section>

              <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <FaEnvelope className="text-2xl" />
                </div>

                <h2 className="mt-5 text-2xl font-extrabold text-gray-900 dark:text-white">
                  Messages
                </h2>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500 dark:text-gray-400">
                  The Messages section is ready for integration,
                  but no messages API is currently connected to
                  the dashboard.
                </p>

                <div className="mx-auto mt-6 max-w-md rounded-2xl border border-yellow-200 bg-yellow-50 p-4 text-left dark:border-yellow-500/20 dark:bg-yellow-500/10">
                  <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                    Backend integration required
                  </p>

                  <p className="mt-1 text-xs leading-5 text-yellow-600/80 dark:text-yellow-400/70">
                    We won't show fake message statistics or
                    create an API endpoint that doesn't exist.
                  </p>
                </div>

              </div>

            </section>
          )}

          {/* =================================================
              PROFILE
          ================================================== */}

          {activeSection === 'profile' && (
            <section>

              <div className="max-w-2xl rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">

                <div className="mb-7">
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    Account
                  </p>

                  <h2 className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">
                    Admin Profile
                  </h2>

                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Current authenticated administrator information.
                  </p>
                </div>

                <div className="space-y-4">

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Username
                    </p>

                    <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                      {admin?.username || 'Not available'}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                      Account Status
                    </p>

                    <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600 dark:bg-green-500/10 dark:text-green-400">
                      <span className="h-2 w-2 rounded-full bg-green-500" />

                      Authenticated
                    </div>
                  </div>

                </div>

              </div>

            </section>
          )}

          {/* =================================================
              SETTINGS
          ================================================== */}

          {activeSection === 'settings' && (
            <section>

              <div className="max-w-2xl rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">

                <div className="mb-7">
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    Preferences
                  </p>

                  <h2 className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">
                    Settings
                  </h2>

                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Dashboard settings will be added as more
                    admin functionality is connected.
                  </p>
                </div>

                <div className="space-y-3">

                  <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-4 dark:border-gray-800">

                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Project Management
                      </p>

                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Add, edit and delete portfolio projects.
                      </p>
                    </div>

                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600 dark:bg-green-500/10 dark:text-green-400">
                      Active
                    </span>

                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-4 dark:border-gray-800">

                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        Messages
                      </p>

                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Waiting for backend API integration.
                      </p>
                    </div>

                    <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400">
                      Pending
                    </span>

                  </div>

                </div>

              </div>

            </section>
          )}

        </div>
      </main>

      {/* =====================================================
          PROJECT FORM MODAL
      ====================================================== */}

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