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
  FaEye,
  FaCheck,
  FaEnvelopeOpen,
  FaSpinner,
  FaFilePdf,
  FaUpload,
  FaDownload,
  FaExternalLinkAlt,
  FaCertificate,
  FaBriefcase,
  FaImage,
  FaSave,
  FaLink,
  FaEyeSlash,
  FaGripVertical,
} from 'react-icons/fa';

import { useAuth } from '../context/AuthContext';
import API from '../utils/axios';
import ProjectForm from '../components/admin/ProjectForm';
import ProfileManager from '../components/admin/ProfileManager';
import ExperienceEducationManager from '../components/admin/ExperienceEducationManager';
import Loader from '../components/ui/Loader';


function AdminDashboard() {
  const { admin, logout } = useAuth();

  // =========================================================
  // PROJECT STATE
  // =========================================================

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);


  // =========================================================
  // MESSAGE STATE
  // =========================================================

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const [selectedMessage, setSelectedMessage] = useState(null);

  const [messagesError, setMessagesError] = useState('');


  // =========================================================
  // DASHBOARD STATE
  // =========================================================

  const [activeSection, setActiveSection] =
    useState('overview');

  const [sidebarOpen, setSidebarOpen] =
    useState(false);


  // =========================================================
  // SETTINGS STATE
  // =========================================================

  const defaultSettings = {
    dashboard: {
      defaultSection: 'overview',
      compactSidebar: false,
      confirmBeforeDelete: true,
      autoRefreshMessages: true,
    },
    notifications: {
      newMessageBadge: true,
      successNotifications: true,
      browserNotifications: false,
    },
  };

  const [settings, setSettings] =
    useState(defaultSettings);

  const [settingsLoading, setSettingsLoading] =
    useState(false);

  const [settingsSaving, setSettingsSaving] =
    useState(false);

  const [settingsError, setSettingsError] =
    useState('');


  // =========================================================
  // RESUME STATE
  // =========================================================

  const [resumeInfo, setResumeInfo] =
    useState(null);

  const [resumeLoading, setResumeLoading] =
    useState(false);

  const [resumeUploading, setResumeUploading] =
    useState(false);


  // =========================================================
  // CERTIFICATE STATE
  // =========================================================

  const [certificates, setCertificates] = useState([]);
  const [certificatesLoading, setCertificatesLoading] = useState(true);
  const [certificateSubmitting, setCertificateSubmitting] = useState(false);
  const [certificateUploading, setCertificateUploading] = useState(false);
  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);

  const emptyCertificate = {
    title: '',
    issuer: '',
    issueDate: '',
    description: '',
    image: '',
    credentialUrl: '',
    skills: '',
    featured: false,
    displayOrder: 0,
    isVisible: true,
  };

  const [certificateForm, setCertificateForm] =
    useState(emptyCertificate);

  const [certificateImageFile, setCertificateImageFile] =
    useState(null);

  const [certificateImagePreview, setCertificateImagePreview] =
    useState('');


  // =========================================================
  // FETCH PROJECTS
  // =========================================================

  const fetchProjects = async () => {
    try {
      setProjectsLoading(true);

      const response = await API.get('/projects');

      setProjects(
        response.data?.data || []
      );
    } catch (error) {
      console.error(
        'Projects fetch error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
        'Failed to load projects'
      );
    } finally {
      setProjectsLoading(false);
    }
  };


  // =========================================================
  // FETCH RESUME INFO
  // =========================================================

  const fetchResumeInfo = async () => {
    try {
      setResumeLoading(true);

      const response = await API.get('/portfolio');

      const portfolio =
        response.data?.data || response.data || {};

      const resume = portfolio?.resume;

      if (resume?.url) {
        setResumeInfo({
          exists: true,
          url: resume.url,
          filename:
            resume.originalName ||
            resume.fileName ||
            'Resume.pdf',
          fileName: resume.fileName,
          originalName: resume.originalName,
          updatedAt: resume.uploadedAt,
        });
      } else {
        setResumeInfo(null);
      }
    } catch (error) {
      console.error('Resume info fetch error:', error);
      setResumeInfo(null);
    } finally {
      setResumeLoading(false);
    }
  };


  // =========================================================
  // UPLOAD / REPLACE RESUME
  // =========================================================

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];

    // Same file ko dobara select karne ke liye input reset.
    event.target.value = '';

    if (!file) {
      return;
    }

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Please select a PDF resume file.');
      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error('Resume must be 10 MB or smaller.');
      return;
    }

    const confirmed = window.confirm(
      resumeInfo?.exists
        ? 'Replace your current resume with this PDF?'
        : 'Upload this PDF as your portfolio resume?'
    );

    if (!confirmed) {
      return;
    }

    try {
      setResumeUploading(true);

      const formData = new FormData();

      formData.append('resume', file);

      await API.post(
        '/portfolio/upload/resume',
        formData
      );

      await fetchResumeInfo();

      toast.success(
        resumeInfo?.exists
          ? 'Resume replaced successfully.'
          : 'Resume uploaded successfully.'
      );
    } catch (error) {
      console.error('Resume upload error:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to upload resume'
      );
    } finally {
      setResumeUploading(false);
    }
  };


  // =========================================================
  // FETCH MESSAGES
  // =========================================================

  const fetchMessages = async () => {
    try {
      setMessagesLoading(true);
      setMessagesError('');

      /*
       * Backend:
       *
       * GET /api/contact
       *
       * Axios baseURL already contains /api.
       */

      const response =
        await API.get('/contact');


      /*
       * Backend response ko flexible rakha gaya hai.
       *
       * Possible responses:
       *
       * {
       *   data: [...]
       * }
       *
       * OR
       *
       * {
       *   contacts: [...]
       * }
       *
       * OR
       *
       * [...]
       */

      const responseData =
        response.data;


      let messageData = [];


      if (
        Array.isArray(responseData)
      ) {
        messageData = responseData;
      } else if (
        Array.isArray(
          responseData?.data
        )
      ) {
        messageData =
          responseData.data;
      } else if (
        Array.isArray(
          responseData?.contacts
        )
      ) {
        messageData =
          responseData.contacts;
      } else if (
        Array.isArray(
          responseData?.messages
        )
      ) {
        messageData =
          responseData.messages;
      }


      setMessages(messageData);
    } catch (error) {
      console.error(
        'Messages fetch error:',
        error
      );

      const message =
        error.response?.data?.message ||
        'Failed to load messages';

      setMessagesError(message);

      toast.error(message);
    } finally {
      setMessagesLoading(false);
    }
  };


  // =========================================================
  // FETCH CERTIFICATES
  // =========================================================

  const fetchCertificates = async () => {
    try {
      setCertificatesLoading(true);

      const response = await API.get('/certificates/admin');

      const responseData = response.data;

      let certificateData = [];

      if (Array.isArray(responseData)) {
        certificateData = responseData;
      } else if (Array.isArray(responseData?.data)) {
        certificateData = responseData.data;
      } else if (Array.isArray(responseData?.certificates)) {
        certificateData = responseData.certificates;
      }

      certificateData.sort((a, b) => {
        const orderDifference =
          Number(a.displayOrder || 0) - Number(b.displayOrder || 0);

        if (orderDifference !== 0) {
          return orderDifference;
        }

        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });

      setCertificates(certificateData);
    } catch (error) {
      console.error('Certificates fetch error:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to load certificates'
      );
    } finally {
      setCertificatesLoading(false);
    }
  };


  // =========================================================
  // CERTIFICATE FORM HELPERS
  // =========================================================

  const resetCertificateForm = () => {
    setCertificateForm({ ...emptyCertificate });
    setCertificateImageFile(null);
    setCertificateImagePreview('');
    setEditingCertificate(null);
  };


  const openCertificateCreateForm = () => {
    resetCertificateForm();
    setShowCertificateForm(true);
  };


  const openCertificateEditForm = (certificate) => {
    setEditingCertificate(certificate);

    setCertificateForm({
      title: certificate.title || '',
      issuer: certificate.issuer || '',
      issueDate: certificate.issueDate || '',
      description: certificate.description || '',
      image: certificate.image || '',
      credentialUrl: certificate.credentialUrl || '',
      skills: Array.isArray(certificate.skills)
        ? certificate.skills.join(', ')
        : '',
      featured: Boolean(certificate.featured),
      displayOrder: certificate.displayOrder ?? 0,
      isVisible: certificate.isVisible !== false,
    });

    setCertificateImageFile(null);
    setCertificateImagePreview(certificate.image || '');
    setShowCertificateForm(true);
  };


  const closeCertificateForm = () => {
    if (certificateSubmitting || certificateUploading) {
      return;
    }

    setShowCertificateForm(false);
    resetCertificateForm();
  };


  const handleCertificateFormChange = (event) => {
    const { name, value, type, checked } = event.target;

    setCertificateForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };


  const handleCertificateImageChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a JPG, JPEG, PNG or WEBP image.');
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error('Certificate image must be 5 MB or smaller.');
      return;
    }

    setCertificateImageFile(file);
    setCertificateImagePreview(URL.createObjectURL(file));
  };


  // =========================================================
  // SAVE CERTIFICATE
  // =========================================================

  const handleCertificateSubmit = async (event) => {
    event.preventDefault();

    if (!certificateForm.title.trim()) {
      toast.error('Certificate title is required.');
      return;
    }

    if (!certificateForm.issuer.trim()) {
      toast.error('Certificate issuer is required.');
      return;
    }

    try {
      setCertificateSubmitting(true);

      let imageUrl = certificateForm.image || '';

      // Certificate image has its own protected upload endpoint.
      if (certificateImageFile) {
        setCertificateUploading(true);

        const imageData = new FormData();
        imageData.append('certificateImage', certificateImageFile);

        const uploadResponse = await API.post(
          '/certificates/upload-image',
          imageData
        );

        imageUrl =
          uploadResponse.data?.data?.image ||
          uploadResponse.data?.data?.url ||
          uploadResponse.data?.image ||
          uploadResponse.data?.url ||
          '';

        if (!imageUrl) {
          throw new Error('Certificate image URL was not returned by the server.');
        }
      }

      const payload = {
        title: certificateForm.title.trim(),
        issuer: certificateForm.issuer.trim(),
        issueDate: certificateForm.issueDate.trim(),
        description: certificateForm.description.trim(),
        image: imageUrl,
        credentialUrl: certificateForm.credentialUrl.trim(),
        skills: certificateForm.skills
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean),
        featured: Boolean(certificateForm.featured),
        displayOrder: Number(certificateForm.displayOrder) || 0,
        isVisible: Boolean(certificateForm.isVisible),
      };

      if (editingCertificate?._id) {
        await API.put(
          `/certificates/${editingCertificate._id}`,
          payload
        );

        toast.success('Certificate updated successfully.');
      } else {
        await API.post('/certificates', payload);

        toast.success('Certificate added successfully.');
      }

      await fetchCertificates();
      setShowCertificateForm(false);
      resetCertificateForm();
    } catch (error) {
      console.error('Certificate save error:', error);

      toast.error(
        error.response?.data?.message ||
        error.message ||
        'Failed to save certificate'
      );
    } finally {
      setCertificateSubmitting(false);
      setCertificateUploading(false);
    }
  };


  // =========================================================
  // DELETE CERTIFICATE
  // =========================================================

  const handleDeleteCertificate = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this certificate?'
    );

    if (!confirmed) {
      return;
    }

    try {
      await API.delete(`/certificates/${id}`);

      setCertificates((previous) =>
        previous.filter((certificate) => certificate._id !== id)
      );

      toast.success('Certificate deleted successfully.');
    } catch (error) {
      console.error('Certificate delete error:', error);

      toast.error(
        error.response?.data?.message ||
        'Failed to delete certificate'
      );
    }
  };


  // =========================================================
  // SETTINGS
  // =========================================================

  const fetchSettings = async (
    applyDefaultSection = false
  ) => {
    try {
      setSettingsLoading(true);
      setSettingsError('');

      const response =
        await API.get('/settings');

      const serverSettings =
        response.data?.data;

      if (!serverSettings) {
        return;
      }

      const nextSettings = {
        dashboard: {
          ...defaultSettings.dashboard,
          ...(serverSettings.dashboard || {}),
        },
        notifications: {
          ...defaultSettings.notifications,
          ...(serverSettings.notifications || {}),
        },
      };

      setSettings(nextSettings);

      if (
        applyDefaultSection &&
        nextSettings.dashboard.defaultSection
      ) {
        setActiveSection(
          nextSettings.dashboard.defaultSection
        );
      }
    } catch (error) {
      console.error(
        'Settings fetch error:',
        error
      );

      setSettingsError(
        error.response?.data?.message ||
        'Settings API is not available yet.'
      );
    } finally {
      setSettingsLoading(false);
    }
  };


  const updateSetting = (
    section,
    key,
    value
  ) => {
    setSettings((previous) => ({
      ...previous,
      [section]: {
        ...previous[section],
        [key]: value,
      },
    }));
  };


  const saveSettings = async () => {
    try {
      setSettingsSaving(true);

      const response =
        await API.put(
          '/settings',
          settings
        );

      const saved =
        response.data?.data;

      if (saved) {
        setSettings({
          dashboard: {
            ...defaultSettings.dashboard,
            ...(saved.dashboard || {}),
          },
          notifications: {
            ...defaultSettings.notifications,
            ...(saved.notifications || {}),
          },
        });
      }

      if (
        settings.notifications.browserNotifications &&
        'Notification' in window &&
        Notification.permission === 'default'
      ) {
        await Notification.requestPermission();
      }

      toast.success(
        'Settings saved successfully.'
      );
    } catch (error) {
      console.error(
        'Settings save error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
        'Failed to save settings.'
      );
    } finally {
      setSettingsSaving(false);
    }
  };


  const resetSettings = async () => {
    const confirmed =
      window.confirm(
        'Reset all settings to default values?'
      );

    if (!confirmed) {
      return;
    }

    try {
      setSettingsSaving(true);

      const response =
        await API.put(
          '/settings/reset'
        );

      const reset =
        response.data?.data;

      setSettings({
        dashboard: {
          ...defaultSettings.dashboard,
          ...(reset?.dashboard || {}),
        },
        notifications: {
          ...defaultSettings.notifications,
          ...(reset?.notifications || {}),
        },
      });

      setActiveSection('overview');

      toast.success(
        'Settings reset successfully.'
      );
    } catch (error) {
      console.error(
        'Settings reset error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
        'Failed to reset settings.'
      );
    } finally {
      setSettingsSaving(false);
    }
  };


  // =========================================================
  // INITIAL DATA
  // =========================================================

  useEffect(() => {
    fetchProjects();
    fetchMessages();
    fetchResumeInfo();
    fetchCertificates();
    fetchSettings(true);
  }, []);


  useEffect(() => {
    if (!settings.dashboard.autoRefreshMessages) {
      return undefined;
    }

    const intervalId =
      window.setInterval(() => {
        fetchMessages();
      }, 30000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    settings.dashboard.autoRefreshMessages,
  ]);


  // =========================================================
  // PROJECT ACTIONS
  // =========================================================

  const handleDelete = async (id) => {
    const confirmed =
      window.confirm(
        'Are you sure you want to delete this project?'
      );

    if (!confirmed) {
      return;
    }


    try {
      await API.delete(
        `/projects/${id}`
      );

      toast.success(
        'Project deleted successfully'
      );

      fetchProjects();
    } catch (error) {
      console.error(
        'Project delete error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
        'Failed to delete project'
      );
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


  // =========================================================
  // MESSAGE ACTIONS
  // =========================================================

  const handleViewMessage = async (message) => {
    setSelectedMessage(message);


    /*
     * Agar message unread hai,
     * backend ko read mark karenge.
     */

    if (!message.isRead) {
      await handleMarkAsRead(
        message._id,
        false
      );
    }
  };


  const handleMarkAsRead = async (
    id,
    showToast = true
  ) => {
    try {
      await API.put(
        `/contact/${id}/read`
      );


      /*
       * UI ko immediately update karna.
       */

      setMessages((previousMessages) =>
        previousMessages.map(
          (message) =>
            message._id === id
              ? {
                  ...message,
                  isRead: true,
                }
              : message
        )
      );


      /*
       * Selected message bhi update.
       */

      setSelectedMessage((previous) =>
        previous?._id === id
          ? {
              ...previous,
              isRead: true,
            }
          : previous
      );


      if (showToast) {
        toast.success(
          'Message marked as read'
        );
      }
    } catch (error) {
      console.error(
        'Mark message read error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
        'Failed to mark message as read'
      );
    }
  };


  const handleDeleteMessage = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        'Are you sure you want to delete this message?'
      );

    if (!confirmed) {
      return;
    }


    try {
      await API.delete(
        `/contact/${id}`
      );


      setMessages((previousMessages) =>
        previousMessages.filter(
          (message) =>
            message._id !== id
        )
      );


      if (
        selectedMessage?._id === id
      ) {
        setSelectedMessage(null);
      }


      toast.success(
        'Message deleted successfully'
      );
    } catch (error) {
      console.error(
        'Delete message error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
        'Failed to delete message'
      );
    }
  };


  // =========================================================
  // MESSAGE STATISTICS
  // =========================================================

  const totalMessages =
    messages.length;


  const unreadMessages =
    messages.filter(
      (message) =>
        !message.isRead
    ).length;


  const readMessages =
    totalMessages -
    unreadMessages;


  // =========================================================
  // PROJECT STATISTICS
  // =========================================================

  const totalProjects =
    projects.length;


  const featuredProjects =
    projects.filter(
      (project) =>
        project.featured
    ).length;


  const regularProjects =
    totalProjects -
    featuredProjects;


  // =========================================================
  // NAVIGATION
  // =========================================================

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
      id: 'certificates',
      label: 'Certificates',
      icon: <FaCertificate />,
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
      id: 'experienceEducation',
      label: 'Experience & Education',
      icon: <FaBriefcase />,
    },

    {
      id: 'settings',
      label: 'Settings',
      icon: <FaCog />,
    },

    {
      id: 'resume',
      label: 'Resume',
      icon: <FaFilePdf />,
    },
  ];


  const handleNavigation = (
    section
  ) => {
    setActiveSection(section);

    setSidebarOpen(false);


    /*
     * Messages open karte hi
     * latest messages reload karenge.
     */

    if (section === 'messages') {
      fetchMessages();
    }

    if (section === 'settings') {
      fetchSettings(false);
    }
  };


  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return '—';
    }


    try {
      return new Date(
        date
      ).toLocaleDateString(
        'en-IN',
        {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }
      );
    } catch {
      return '—';
    }
  };


  const formatDateTime = (
    date
  ) => {
    if (!date) {
      return '—';
    }


    try {
      return new Date(
        date
      ).toLocaleString(
        'en-IN',
        {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }
      );
    } catch {
      return '—';
    }
  };


  // =========================================================
  // MESSAGE NAME
  // =========================================================

  const getMessageName = (
    message
  ) => {
    return (
      message.name ||
      message.fullName ||
      message.username ||
      'Unknown Visitor'
    );
  };


  // =========================================================
  // MESSAGE EMAIL
  // =========================================================

  const getMessageEmail = (
    message
  ) => {
    return (
      message.email ||
      message.senderEmail ||
      'No email'
    );
  };


  // =========================================================
  // MESSAGE SUBJECT
  // =========================================================

  const getMessageSubject = (
    message
  ) => {
    return (
      message.subject ||
      'No Subject'
    );
  };


  // =========================================================
  // MESSAGE CONTENT
  // =========================================================

  const getMessageContent = (
    message
  ) => {
    return (
      message.message ||
      message.content ||
      message.text ||
      'No message content'
    );
  };


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-[100dvh] w-full overflow-x-hidden bg-gray-100 text-gray-900 transition-colors duration-500 dark:bg-gray-950 dark:text-white">


      {/* =====================================================
          MOBILE TOP BAR
      ====================================================== */}

      <header
        className="
          sticky
          top-0
          z-40
          border-b
          border-gray-200
          bg-white/90
          px-4
          py-4
          backdrop-blur-xl
          dark:border-gray-800
          dark:bg-gray-950/90
          lg:hidden
        "
      >

        <div className="flex min-w-0 items-center justify-between gap-3">

          <div className="min-w-0">

            <p
              className="
                text-xs
                font-medium
                uppercase
                tracking-wider
                text-indigo-600
                dark:text-indigo-400
              "
            >
              Admin Panel
            </p>

            <h1 className="truncate text-lg font-bold">
              Portfolio Dashboard
            </h1>

          </div>


          <button
            type="button"
            onClick={() =>
              setSidebarOpen(true)
            }
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              text-gray-700
              transition-colors
              hover:bg-gray-100
              dark:border-gray-800
              dark:bg-gray-900
              dark:text-gray-300
              dark:hover:bg-gray-800
            "
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
          onClick={() =>
            setSidebarOpen(false)
          }
          className="
            fixed
            inset-0
            z-40
            bg-black/50
            lg:hidden
          "
        />
      )}


      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          w-[85vw]
          max-w-72
          flex-col
          border-r
          border-gray-200
          bg-white
          transition-transform
          duration-300
          dark:border-gray-800
          dark:bg-gray-950
          lg:translate-x-0
          ${
            sidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }
        `}
      >


        {/* Sidebar Header */}

        <div
          className="
            flex
            h-20
            items-center
            justify-between
            border-b
            border-gray-200
            px-6
            dark:border-gray-800
          "
        >

          <div>

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.2em]
                text-indigo-600
                dark:text-indigo-400
              "
            >
              Admin
            </p>

            <h2
              className="
                text-lg
                font-bold
                text-gray-900
                dark:text-white
              "
            >
              Portfolio Panel
            </h2>

          </div>


          <button
            type="button"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-lg
              text-gray-500
              hover:bg-gray-100
              dark:hover:bg-gray-900
              lg:hidden
            "
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>

        </div>


        {/* Admin Profile */}

        <div
          className="
            border-b
            border-gray-200
            p-5
            dark:border-gray-800
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
              rounded-2xl
              bg-gray-50
              p-3
              dark:bg-gray-900
            "
          >

            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-indigo-100
                text-indigo-600
                dark:bg-indigo-500/10
                dark:text-indigo-400
              "
            >
              <FaUserCircle
                className="text-2xl"
              />
            </div>


            <div className="min-w-0">

              <p
                className="
                  truncate
                  text-sm
                  font-bold
                  text-gray-900
                  dark:text-white
                "
              >
                {admin?.username ||
                  'Admin'}
              </p>

              <p
                className="
                  truncate
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Administrator
              </p>

            </div>

          </div>

        </div>


        {/* Navigation */}

        <nav
          className="
            flex-1
            space-y-1
            overflow-y-auto
            p-4
          "
        >

          <p
            className="
              mb-3
              px-3
              text-[10px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-gray-400
            "
          >
            Dashboard
          </p>


          {navigation.map(
            (item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  handleNavigation(
                    item.id
                  )
                }
                className={`
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-medium
                  transition-all
                  duration-200
                  ${
                    activeSection ===
                    item.id
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white'
                  }
                `}
              >

                <span className="text-base">
                  {item.icon}
                </span>

                {item.label}


                {item.id ===
                  'messages' &&
                  unreadMessages > 0 && (
                    <span
                      className="
                        ml-auto
                        min-w-6
                        rounded-full
                        bg-red-500
                        px-2
                        py-0.5
                        text-center
                        text-[10px]
                        font-bold
                        text-white
                      "
                    >
                      {unreadMessages}
                    </span>
                  )}

              </button>
            )
          )}

        </nav>


        {/* Logout */}

        <div
          className="
            border-t
            border-gray-200
            p-4
            dark:border-gray-800
          "
        >

          <button
            type="button"
            onClick={logout}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              font-medium
              text-red-600
              transition-colors
              hover:bg-red-50
              dark:text-red-400
              dark:hover:bg-red-500/10
            "
          >

            <FaSignOutAlt />

            Logout

          </button>

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main
        className="
          min-h-[100dvh]
          w-full
          lg:ml-72
          lg:w-[calc(100%-18rem)]
        "
      >


        {/* ===================================================
            DESKTOP HEADER
        ==================================================== */}

        <header
          className="
            hidden
            border-b
            border-gray-200
            bg-white/80
            px-8
            py-5
            backdrop-blur-xl
            dark:border-gray-800
            dark:bg-gray-950/80
            lg:block
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <h1
                className="
                  text-xl
                  font-bold
                  text-gray-900
                  dark:text-white
                "
              >

                {activeSection ===
                  'overview' &&
                  'Dashboard Overview'}

                {activeSection ===
                  'projects' &&
                  'Projects'}

                {activeSection ===
                  'certificates' &&
                  'Certificates'}

                {activeSection ===
                  'messages' &&
                  'Messages'}

                {activeSection ===
                  'profile' &&
                  'Admin Profile'}

                {activeSection ===
                  'experienceEducation' &&
                  'Experience & Education'}

                {activeSection ===
                  'settings' &&
                  'Settings'}

              </h1>


              <p
                className="
                  mt-1
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Manage your portfolio
                from one place.
              </p>

            </div>


            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <span
                className="
                  hidden
                  text-sm
                  text-gray-500
                  xl:block
                  dark:text-gray-400
                "
              >
                Welcome back,
              </span>


              <span
                className="
                  rounded-full
                  bg-indigo-50
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  text-indigo-600
                  dark:bg-indigo-500/10
                  dark:text-indigo-400
                "
              >
                {admin?.username ||
                  'Admin'}
              </span>

            </div>

          </div>

        </header>


        {/* ===================================================
            PAGE CONTENT
        ==================================================== */}

        <div
          className="
            p-4
            sm:p-6
            lg:p-8
          "
        >


          {/* =================================================
              OVERVIEW
          ================================================== */}

          {activeSection ===
            'overview' && (
            <section>

              <div className="mb-8">

                <p
                  className="
                    mb-2
                    text-sm
                    font-semibold
                    text-indigo-600
                    dark:text-indigo-400
                  "
                >
                  Welcome back 👋
                </p>


                <h2
                  className="
                    text-2xl
                    font-extrabold
                    text-gray-900
                    sm:text-3xl
                    dark:text-white
                  "
                >
                  Portfolio Overview
                </h2>


                <p
                  className="
                    mt-2
                    max-w-2xl
                    text-sm
                    leading-6
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Keep track of your
                  portfolio projects
                  and manage visitor
                  messages.
                </p>

              </div>


              {/* Statistics */}

              <div
                className="
                  grid
                  gap-4
                  sm:grid-cols-2
                  xl:grid-cols-4
                "
              >


                {/* Total Projects */}

                <div
                  className="
                    group
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    p-5
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-lg
                    dark:border-gray-800
                    dark:bg-gray-900
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <div>

                      <p
                        className="
                          text-sm
                          font-medium
                          text-gray-500
                          dark:text-gray-400
                        "
                      >
                        Total Projects
                      </p>


                      <p
                        className="
                          mt-2
                          text-3xl
                          font-extrabold
                          text-gray-900
                          dark:text-white
                        "
                      >
                        {totalProjects}
                      </p>

                    </div>


                    <div
                      className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-2xl
                        bg-indigo-50
                        text-indigo-600
                        dark:bg-indigo-500/10
                        dark:text-indigo-400
                      "
                    >
                      <FaFolderOpen />
                    </div>

                  </div>

                </div>


                {/* Featured Projects */}

                <div
                  className="
                    group
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    p-5
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-lg
                    dark:border-gray-800
                    dark:bg-gray-900
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <div>

                      <p
                        className="
                          text-sm
                          font-medium
                          text-gray-500
                          dark:text-gray-400
                        "
                      >
                        Featured Projects
                      </p>


                      <p
                        className="
                          mt-2
                          text-3xl
                          font-extrabold
                          text-gray-900
                          dark:text-white
                        "
                      >
                        {featuredProjects}
                      </p>

                    </div>


                    <div
                      className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-2xl
                        bg-yellow-50
                        text-yellow-500
                        dark:bg-yellow-500/10
                      "
                    >
                      <FaStar />
                    </div>

                  </div>

                </div>


                {/* Total Messages */}

                <div
                  className="
                    group
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    p-5
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-lg
                    dark:border-gray-800
                    dark:bg-gray-900
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <div>

                      <p
                        className="
                          text-sm
                          font-medium
                          text-gray-500
                          dark:text-gray-400
                        "
                      >
                        Total Messages
                      </p>


                      <p
                        className="
                          mt-2
                          text-3xl
                          font-extrabold
                          text-gray-900
                          dark:text-white
                        "
                      >
                        {totalMessages}
                      </p>


                      <button
                        type="button"
                        onClick={() =>
                          handleNavigation(
                            'messages'
                          )
                        }
                        className="
                          mt-2
                          text-xs
                          font-semibold
                          text-indigo-600
                          hover:underline
                          dark:text-indigo-400
                        "
                      >
                        View Messages →
                      </button>

                    </div>


                    <div
                      className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-2xl
                        bg-indigo-50
                        text-indigo-600
                        dark:bg-indigo-500/10
                        dark:text-indigo-400
                      "
                    >
                      <FaEnvelope />
                    </div>

                  </div>

                </div>


                {/* Unread Messages */}

                <div
                  className="
                    group
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    p-5
                    shadow-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-lg
                    dark:border-gray-800
                    dark:bg-gray-900
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <div>

                      <p
                        className="
                          text-sm
                          font-medium
                          text-gray-500
                          dark:text-gray-400
                        "
                      >
                        Unread Messages
                      </p>


                      <p
                        className="
                          mt-2
                          text-3xl
                          font-extrabold
                          text-gray-900
                          dark:text-white
                        "
                      >
                        {unreadMessages}
                      </p>


                      {unreadMessages >
                        0 && (
                        <p
                          className="
                            mt-2
                            text-xs
                            font-semibold
                            text-red-500
                          "
                        >
                          Needs attention
                        </p>
                      )}

                    </div>


                    <div
                      className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-2xl
                        bg-red-50
                        text-red-500
                        dark:bg-red-500/10
                        dark:text-red-400
                      "
                    >
                      <FaEnvelopeOpen />
                    </div>

                  </div>

                </div>

              </div>


              {/* Quick Actions */}

              <div
                className="
                  mt-8
                  rounded-3xl
                  border
                  border-gray-200
                  bg-white
                  p-6
                  shadow-sm
                  dark:border-gray-800
                  dark:bg-gray-900
                "
              >

                <div className="mb-5">

                  <h3
                    className="
                      text-lg
                      font-bold
                      text-gray-900
                      dark:text-white
                    "
                  >
                    Quick Actions
                  </h3>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    Frequently used
                    portfolio actions.
                  </p>

                </div>


                <div
                  className="
                    grid
                    gap-3
                    sm:grid-cols-3
                  "
                >

                  <button
                    type="button"
                    onClick={
                      handleAddNew
                    }
                    className="
                      group
                      flex
                      items-center
                      justify-between
                      rounded-2xl
                      border
                      border-gray-200
                      p-4
                      text-left
                      transition-all
                      hover:-translate-y-1
                      hover:border-indigo-300
                      hover:shadow-md
                      dark:border-gray-800
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >

                      <div
                        className="
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-xl
                          bg-indigo-50
                          text-indigo-600
                          dark:bg-indigo-500/10
                          dark:text-indigo-400
                        "
                      >
                        <FaPlus />
                      </div>


                      <div>

                        <p
                          className="
                            font-semibold
                            text-gray-900
                            dark:text-white
                          "
                        >
                          Add Project
                        </p>

                        <p
                          className="
                            text-xs
                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          Create project
                        </p>

                      </div>

                    </div>


                    <FaArrowRight
                      className="
                        text-gray-400
                      "
                    />

                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      handleNavigation(
                        'projects'
                      )
                    }
                    className="
                      group
                      flex
                      items-center
                      justify-between
                      rounded-2xl
                      border
                      border-gray-200
                      p-4
                      text-left
                      transition-all
                      hover:-translate-y-1
                      hover:border-indigo-300
                      hover:shadow-md
                      dark:border-gray-800
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >

                      <div
                        className="
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-xl
                          bg-blue-50
                          text-blue-600
                          dark:bg-blue-500/10
                          dark:text-blue-400
                        "
                      >
                        <FaFolderOpen />
                      </div>


                      <div>

                        <p
                          className="
                            font-semibold
                            text-gray-900
                            dark:text-white
                          "
                        >
                          Manage Projects
                        </p>

                        <p
                          className="
                            text-xs
                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          Edit or delete
                        </p>

                      </div>

                    </div>


                    <FaArrowRight
                      className="
                        text-gray-400
                      "
                    />

                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      handleNavigation(
                        'messages'
                      )
                    }
                    className="
                      group
                      flex
                      items-center
                      justify-between
                      rounded-2xl
                      border
                      border-gray-200
                      p-4
                      text-left
                      transition-all
                      hover:-translate-y-1
                      hover:border-indigo-300
                      hover:shadow-md
                      dark:border-gray-800
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                      "
                    >

                      <div
                        className="
                          relative
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-xl
                          bg-indigo-50
                          text-indigo-600
                          dark:bg-indigo-500/10
                          dark:text-indigo-400
                        "
                      >

                        <FaEnvelope />


                        {unreadMessages >
                          0 && (
                          <span
                            className="
                              absolute
                              -right-1
                              -top-1
                              h-4
                              min-w-4
                              rounded-full
                              bg-red-500
                              px-1
                              text-center
                              text-[9px]
                              font-bold
                              text-white
                            "
                          >
                            {unreadMessages}
                          </span>
                        )}

                      </div>


                      <div>

                        <p
                          className="
                            font-semibold
                            text-gray-900
                            dark:text-white
                          "
                        >
                          Messages
                        </p>

                        <p
                          className="
                            text-xs
                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          View visitor
                          messages
                        </p>

                      </div>

                    </div>


                    <FaArrowRight
                      className="
                        text-gray-400
                      "
                    />

                  </button>

                </div>

              </div>

            </section>
          )}


          {/* =================================================
              PROJECTS
          ================================================== */}

          {activeSection ===
            'projects' && (
            <section>

              <div
                className="
                  mb-7
                  flex
                  flex-col
                  justify-between
                  gap-4
                  sm:flex-row
                  sm:items-center
                "
              >

                <div>

                  <h2
                    className="
                      text-2xl
                      font-extrabold
                      text-gray-900
                      dark:text-white
                    "
                  >
                    Projects
                  </h2>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    Add, edit and manage
                    your portfolio
                    projects.
                  </p>

                </div>


                <button
                  type="button"
                  onClick={
                    handleAddNew
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-indigo-600
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    shadow-lg
                    shadow-indigo-600/20
                    transition-all
                    hover:-translate-y-0.5
                    hover:bg-indigo-700
                  "
                >

                  <FaPlus />

                  Add New Project

                </button>

              </div>


              {/* Loading */}

              {projectsLoading && (
                <div
                  className="
                    flex
                    min-h-64
                    items-center
                    justify-center
                    rounded-3xl
                    border
                    border-gray-200
                    bg-white
                    dark:border-gray-800
                    dark:bg-gray-900
                  "
                >
                  <Loader />
                </div>
              )}


              {/* Empty */}

              {!projectsLoading &&
                projects.length ===
                  0 && (
                  <div
                    className="
                      rounded-3xl
                      border
                      border-dashed
                      border-gray-300
                      bg-white
                      p-10
                      text-center
                      dark:border-gray-700
                      dark:bg-gray-900
                    "
                  >

                    <div
                      className="
                        mx-auto
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-2xl
                        bg-gray-100
                        text-gray-400
                        dark:bg-gray-800
                      "
                    >
                      <FaFolderOpen
                        className="text-2xl"
                      />
                    </div>


                    <h3
                      className="
                        mt-5
                        text-lg
                        font-bold
                        text-gray-900
                        dark:text-white
                      "
                    >
                      No projects yet
                    </h3>


                    <p
                      className="
                        mx-auto
                        mt-2
                        max-w-md
                        text-sm
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      Add your first
                      project to start
                      building your
                      portfolio.
                    </p>


                    <button
                      type="button"
                      onClick={
                        handleAddNew
                      }
                      className="
                        mt-5
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-indigo-600
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        hover:bg-indigo-700
                      "
                    >

                      <FaPlus />

                      Add Project

                    </button>

                  </div>
                )}


              {/* Project List */}

              {!projectsLoading &&
                projects.length >
                  0 && (
                  <div className="grid gap-4">

                    {projects.map(
                      (project) => (
                        <article
                          key={
                            project._id
                          }
                          className="
                            group
                            rounded-2xl
                            border
                            border-gray-200
                            bg-white
                            p-5
                            shadow-sm
                            transition-all
                            duration-300
                            hover:-translate-y-1
                            hover:shadow-lg
                            dark:border-gray-800
                            dark:bg-gray-900
                          "
                        >

                          <div
                            className="
                              flex
                              flex-col
                              gap-5
                              md:flex-row
                              md:items-center
                              md:justify-between
                            "
                          >

                            <div
                              className="
                                min-w-0
                                flex-1
                              "
                            >

                              <div
                                className="
                                  flex
                                  flex-wrap
                                  items-center
                                  gap-2
                                "
                              >

                                <h3
                                  className="
                                    text-base
                                    font-bold
                                    text-gray-900
                                    dark:text-white
                                  "
                                >
                                  {
                                    project.title
                                  }
                                </h3>


                                {project.featured && (
                                  <span
                                    className="
                                      inline-flex
                                      items-center
                                      gap-1
                                      rounded-full
                                      bg-yellow-50
                                      px-2.5
                                      py-1
                                      text-[11px]
                                      font-bold
                                      text-yellow-600
                                      dark:bg-yellow-500/10
                                      dark:text-yellow-400
                                    "
                                  >

                                    <FaStar />

                                    Featured

                                  </span>
                                )}

                              </div>


                              <p
                                className="
                                  mt-2
                                  line-clamp-2
                                  text-sm
                                  leading-6
                                  text-gray-500
                                  dark:text-gray-400
                                "
                              >
                                {
                                  project.description
                                }
                              </p>

                            </div>


                            <div
                              className="
                                grid
                                w-full
                                grid-cols-2
                                gap-2
                                md:flex
                                md:w-auto
                                md:shrink-0
                                md:items-center
                              "
                            >

                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(
                                    project
                                  )
                                }
                                className="
                                  inline-flex
                                  w-full
                                  items-center
                                  justify-center
                                  gap-2
                                  rounded-xl
                                  bg-gray-100
                                  px-4
                                  py-2.5
                                  text-sm
                                  font-semibold
                                  text-gray-700
                                  hover:bg-indigo-50
                                  hover:text-indigo-600
                                  dark:bg-gray-800
                                  dark:text-gray-300
                                "
                              >

                                <FaEdit />

                                Edit

                              </button>


                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    project._id
                                  )
                                }
                                className="
                                  inline-flex
                                  w-full
                                  items-center
                                  justify-center
                                  gap-2
                                  rounded-xl
                                  bg-red-50
                                  px-4
                                  py-2.5
                                  text-sm
                                  font-semibold
                                  text-red-600
                                  hover:bg-red-100
                                  dark:bg-red-500/10
                                  dark:text-red-400
                                "
                              >

                                <FaTrash />

                                Delete

                              </button>

                            </div>

                          </div>

                        </article>
                      )
                    )}

                  </div>
                )}

            </section>
          )}


          {/* =================================================
              MESSAGES
          ================================================== */}

          {activeSection ===
            'messages' && (
            <section>

              {/* Message Header */}

              <div
                className="
                  mb-7
                  flex
                  flex-col
                  justify-between
                  gap-4
                  sm:flex-row
                  sm:items-center
                "
              >

                <div>

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >

                    <h2
                      className="
                        text-2xl
                        font-extrabold
                        text-gray-900
                        dark:text-white
                      "
                    >
                      Messages
                    </h2>


                    {unreadMessages >
                      0 && (
                      <span
                        className="
                          rounded-full
                          bg-red-100
                          px-3
                          py-1
                          text-xs
                          font-bold
                          text-red-600
                          dark:bg-red-500/10
                          dark:text-red-400
                        "
                      >
                        {unreadMessages}
                        {' '}
                        unread
                      </span>
                    )}

                  </div>


                  <p
                    className="
                      mt-1
                      text-sm
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    Manage messages
                    received from your
                    portfolio contact
                    form.
                  </p>

                </div>


                <button
                  type="button"
                  onClick={
                    fetchMessages
                  }
                  disabled={
                    messagesLoading
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-gray-700
                    transition-colors
                    hover:bg-gray-50
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    dark:border-gray-800
                    dark:bg-gray-900
                    dark:text-gray-300
                    dark:hover:bg-gray-800
                  "
                >

                  {messagesLoading ? (
                    <FaSpinner
                      className="
                        animate-spin
                      "
                    />
                  ) : (
                    <FaEnvelope />
                  )}

                  Refresh

                </button>

              </div>


              {/* Message Statistics */}

              <div
                className="
                  mb-6
                  grid
                  gap-4
                  sm:grid-cols-3
                "
              >

                <div
                  className="
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    p-5
                    dark:border-gray-800
                    dark:bg-gray-900
                  "
                >

                  <p
                    className="
                      text-sm
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    Total Messages
                  </p>

                  <p
                    className="
                      mt-2
                      text-3xl
                      font-extrabold
                      text-gray-900
                      dark:text-white
                    "
                  >
                    {totalMessages}
                  </p>

                </div>


                <div
                  className="
                    rounded-2xl
                    border
                    border-red-200
                    bg-red-50
                    p-5
                    dark:border-red-500/20
                    dark:bg-red-500/10
                  "
                >

                  <p
                    className="
                      text-sm
                      text-red-600
                      dark:text-red-400
                    "
                  >
                    Unread
                  </p>

                  <p
                    className="
                      mt-2
                      text-3xl
                      font-extrabold
                      text-red-600
                      dark:text-red-400
                    "
                  >
                    {unreadMessages}
                  </p>

                </div>


                <div
                  className="
                    rounded-2xl
                    border
                    border-green-200
                    bg-green-50
                    p-5
                    dark:border-green-500/20
                    dark:bg-green-500/10
                  "
                >

                  <p
                    className="
                      text-sm
                      text-green-600
                      dark:text-green-400
                    "
                  >
                    Read
                  </p>

                  <p
                    className="
                      mt-2
                      text-3xl
                      font-extrabold
                      text-green-600
                      dark:text-green-400
                    "
                  >
                    {readMessages}
                  </p>

                </div>

              </div>


              {/* Loading */}

              {messagesLoading && (
                <div
                  className="
                    flex
                    min-h-64
                    items-center
                    justify-center
                    rounded-3xl
                    border
                    border-gray-200
                    bg-white
                    dark:border-gray-800
                    dark:bg-gray-900
                  "
                >

                  <div className="text-center">

                    <FaSpinner
                      className="
                        mx-auto
                        animate-spin
                        text-3xl
                        text-indigo-600
                      "
                    />

                    <p
                      className="
                        mt-4
                        text-sm
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      Loading messages...
                    </p>

                  </div>

                </div>
              )}


              {/* Error */}

              {!messagesLoading &&
                messagesError && (
                  <div
                    className="
                      rounded-3xl
                      border
                      border-red-200
                      bg-red-50
                      p-6
                      dark:border-red-500/20
                      dark:bg-red-500/10
                    "
                  >

                    <h3
                      className="
                        font-bold
                        text-red-700
                        dark:text-red-400
                      "
                    >
                      Failed to load
                      messages
                    </h3>


                    <p
                      className="
                        mt-2
                        text-sm
                        text-red-600
                        dark:text-red-400
                      "
                    >
                      {messagesError}
                    </p>


                    <button
                      type="button"
                      onClick={
                        fetchMessages
                      }
                      className="
                        mt-4
                        rounded-xl
                        bg-red-600
                        px-4
                        py-2
                        text-sm
                        font-semibold
                        text-white
                        hover:bg-red-700
                      "
                    >
                      Try Again
                    </button>

                  </div>
                )}


              {/* Empty */}

              {!messagesLoading &&
                !messagesError &&
                messages.length ===
                  0 && (
                  <div
                    className="
                      rounded-3xl
                      border
                      border-dashed
                      border-gray-300
                      bg-white
                      p-10
                      text-center
                      dark:border-gray-700
                      dark:bg-gray-900
                    "
                  >

                    <div
                      className="
                        mx-auto
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-2xl
                        bg-gray-100
                        text-gray-400
                        dark:bg-gray-800
                      "
                    >
                      <FaEnvelope
                        className="text-2xl"
                      />
                    </div>


                    <h3
                      className="
                        mt-5
                        text-lg
                        font-bold
                        text-gray-900
                        dark:text-white
                      "
                    >
                      No messages yet
                    </h3>


                    <p
                      className="
                        mx-auto
                        mt-2
                        max-w-md
                        text-sm
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      Messages submitted
                      through your
                      portfolio contact
                      form will appear
                      here.
                    </p>

                  </div>
                )}


              {/* Messages List */}

              {!messagesLoading &&
                !messagesError &&
                messages.length >
                  0 && (
                  <div
                    className="
                      space-y-3
                    "
                  >

                    {messages.map(
                      (message) => (
                        <article
                          key={
                            message._id
                          }
                          className={`
                            rounded-2xl
                            border
                            p-5
                            transition-all
                            duration-200
                            hover:shadow-md
                            ${
                              message.isRead
                                ? 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'
                                : 'border-indigo-200 bg-indigo-50/50 dark:border-indigo-500/20 dark:bg-indigo-500/5'
                            }
                          `}
                        >

                          <div
                            className="
                              flex
                              flex-col
                              gap-5
                              lg:flex-row
                              lg:items-center
                              lg:justify-between
                            "
                          >

                            {/* Message Info */}

                            <div
                              className="
                                min-w-0
                                flex-1
                              "
                            >

                              <div
                                className="
                                  flex
                                  flex-wrap
                                  items-center
                                  gap-2
                                "
                              >

                                {!message.isRead && (
                                  <span
                                    className="
                                      h-2
                                      w-2
                                      rounded-full
                                      bg-red-500
                                    "
                                  />
                                )}


                                <h3
                                  className="
                                    font-bold
                                    text-gray-900
                                    dark:text-white
                                  "
                                >
                                  {getMessageName(
                                    message
                                  )}
                                </h3>


                                {!message.isRead && (
                                  <span
                                    className="
                                      rounded-full
                                      bg-indigo-100
                                      px-2.5
                                      py-1
                                      text-[10px]
                                      font-bold
                                      uppercase
                                      text-indigo-600
                                      dark:bg-indigo-500/10
                                      dark:text-indigo-400
                                    "
                                  >
                                    New
                                  </span>
                                )}

                              </div>


                              <p
                                className="
                                  mt-1
                                  text-sm
                                  text-gray-500
                                  dark:text-gray-400
                                "
                              >
                                {getMessageEmail(
                                  message
                                )}
                              </p>


                              <p
                                className="
                                  mt-3
                                  font-semibold
                                  text-gray-800
                                  dark:text-gray-200
                                "
                              >
                                {getMessageSubject(
                                  message
                                )}
                              </p>


                              <p
                                className="
                                  mt-1
                                  line-clamp-2
                                  text-sm
                                  leading-6
                                  text-gray-500
                                  dark:text-gray-400
                                "
                              >
                                {getMessageContent(
                                  message
                                )}
                              </p>


                              <p
                                className="
                                  mt-3
                                  text-xs
                                  text-gray-400
                                "
                              >
                                {formatDateTime(
                                  message.createdAt
                                )}
                              </p>

                            </div>


                            {/* Actions */}

                            <div
                              className="
                                grid
                                w-full
                                grid-cols-1
                                gap-2
                                sm:flex
                                sm:w-auto
                                sm:flex-wrap
                                sm:items-center
                              "
                            >

                              <button
                                type="button"
                                onClick={() =>
                                  handleViewMessage(
                                    message
                                  )
                                }
                                className="
                                  inline-flex
                                  w-full
                                  items-center
                                  justify-center
                                  gap-2
                                  rounded-xl
                                  bg-indigo-50
                                  px-4
                                  py-2.5
                                  text-sm
                                  font-semibold
                                  text-indigo-600
                                  hover:bg-indigo-100
                                  dark:bg-indigo-500/10
                                  dark:text-indigo-400
                                  dark:hover:bg-indigo-500/20
                                "
                              >

                                <FaEye />

                                View

                              </button>


                              {!message.isRead && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleMarkAsRead(
                                      message._id
                                    )
                                  }
                                  className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    bg-green-50
                                    px-4
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-green-600
                                    hover:bg-green-100
                                    dark:bg-green-500/10
                                    dark:text-green-400
                                  "
                                >

                                  <FaCheck />

                                  Read

                                </button>
                              )}


                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteMessage(
                                    message._id
                                  )
                                }
                                className="
                                  inline-flex
                                  w-full
                                  items-center
                                  justify-center
                                  gap-2
                                  rounded-xl
                                  bg-red-50
                                  px-4
                                  py-2.5
                                  text-sm
                                  font-semibold
                                  text-red-600
                                  hover:bg-red-100
                                  dark:bg-red-500/10
                                  dark:text-red-400
                                "
                              >

                                <FaTrash />

                                Delete

                              </button>

                            </div>

                          </div>

                        </article>
                      )
                    )}

                  </div>
                )}

            </section>
          )}


          {/* =================================================
              CERTIFICATES
          ================================================== */}

          {activeSection ===
            'certificates' && (
            <section>

              {/* Certificate Header */}

              <div
                className="
                  mb-7
                  flex
                  flex-col
                  justify-between
                  gap-4
                  sm:flex-row
                  sm:items-center
                "
              >

                <div>

                  <p
                    className="
                      flex
                      items-center
                      gap-2
                      text-sm
                      font-semibold
                      text-indigo-600
                      dark:text-indigo-400
                    "
                  >
                    <FaCertificate />
                    Credentials
                  </p>

                  <h2
                    className="
                      mt-1
                      text-2xl
                      font-extrabold
                      text-gray-900
                      dark:text-white
                    "
                  >
                    Certificates
                  </h2>

                  <p
                    className="
                      mt-1
                      max-w-2xl
                      text-sm
                      leading-6
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    Add, edit, delete and control the certificates displayed
                    on your public portfolio.
                  </p>

                </div>

                <div className="flex flex-wrap gap-2">

                  <button
                    type="button"
                    onClick={fetchCertificates}
                    disabled={certificatesLoading}
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      text-gray-700
                      transition-colors
                      hover:bg-gray-50
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                      dark:border-gray-800
                      dark:bg-gray-900
                      dark:text-gray-300
                      dark:hover:bg-gray-800
                    "
                  >
                    <FaSpinner className={certificatesLoading ? 'animate-spin' : ''} />
                    Refresh
                  </button>

                  <button
                    type="button"
                    onClick={openCertificateCreateForm}
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-indigo-600
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-white
                      shadow-lg
                      shadow-indigo-600/20
                      transition-all
                      hover:-translate-y-0.5
                      hover:bg-indigo-700
                    "
                  >
                    <FaPlus />
                    Add Certificate
                  </button>

                </div>

              </div>


              {/* Certificate Statistics */}

              <div className="mb-6 grid gap-4 sm:grid-cols-3">

                <div
                  className="
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    p-5
                    shadow-sm
                    dark:border-gray-800
                    dark:bg-gray-900
                  "
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total Certificates
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">
                    {certificates.length}
                  </p>
                </div>

                <div
                  className="
                    rounded-2xl
                    border
                    border-green-200
                    bg-green-50
                    p-5
                    dark:border-green-500/20
                    dark:bg-green-500/10
                  "
                >
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Visible
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-green-600 dark:text-green-400">
                    {certificates.filter((certificate) => certificate.isVisible !== false).length}
                  </p>
                </div>

                <div
                  className="
                    rounded-2xl
                    border
                    border-yellow-200
                    bg-yellow-50
                    p-5
                    dark:border-yellow-500/20
                    dark:bg-yellow-500/10
                  "
                >
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    Featured
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-yellow-600 dark:text-yellow-400">
                    {certificates.filter((certificate) => certificate.featured).length}
                  </p>
                </div>

              </div>


              {/* Certificate Form */}

              {showCertificateForm && (
                <div
                  className="
                    mb-7
                    rounded-3xl
                    border
                    border-indigo-200
                    bg-white
                    p-5
                    shadow-sm
                    dark:border-indigo-500/20
                    dark:bg-gray-900
                    sm:p-7
                  "
                >

                  <div className="mb-6 flex items-start justify-between gap-4">

                    <div>
                      <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                        {editingCertificate ? 'Edit Certificate' : 'New Certificate'}
                      </p>
                      <h3 className="mt-1 text-xl font-extrabold text-gray-900 dark:text-white">
                        {editingCertificate ? 'Update certificate details' : 'Add a new certificate'}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={closeCertificateForm}
                      disabled={certificateSubmitting || certificateUploading}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-white"
                      aria-label="Close certificate form"
                    >
                      <FaTimes />
                    </button>

                  </div>


                  <form onSubmit={handleCertificateSubmit} className="space-y-5">

                    <div className="grid gap-5 md:grid-cols-2">

                      <div>
                        <label
                          htmlFor="certificate-title"
                          className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                        >
                          Certificate Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="certificate-title"
                          name="title"
                          type="text"
                          value={certificateForm.title}
                          onChange={handleCertificateFormChange}
                          placeholder="JavaScript Certification"
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="certificate-issuer"
                          className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                        >
                          Issuing Organization <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="certificate-issuer"
                          name="issuer"
                          type="text"
                          value={certificateForm.issuer}
                          onChange={handleCertificateFormChange}
                          placeholder="Amity University Online"
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                        />
                      </div>

                    </div>


                    <div className="grid gap-5 md:grid-cols-2">

                      <div>
                        <label
                          htmlFor="certificate-issue-date"
                          className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                        >
                          Issue Date
                        </label>
                        <input
                          id="certificate-issue-date"
                          name="issueDate"
                          type="text"
                          value={certificateForm.issueDate}
                          onChange={handleCertificateFormChange}
                          placeholder="August 2026"
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="certificate-credential-url"
                          className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                        >
                          Credential / Verification URL
                        </label>
                        <div className="relative">
                          <FaLink className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            id="certificate-credential-url"
                            name="credentialUrl"
                            type="url"
                            value={certificateForm.credentialUrl}
                            onChange={handleCertificateFormChange}
                            placeholder="https://..."
                            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                          />
                        </div>
                      </div>

                    </div>


                    <div>
                      <label
                        htmlFor="certificate-description"
                        className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                      >
                        Description
                      </label>
                      <textarea
                        id="certificate-description"
                        name="description"
                        rows={4}
                        value={certificateForm.description}
                        onChange={handleCertificateFormChange}
                        placeholder="Describe what this certificate represents..."
                        className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                      />
                    </div>


                    <div>
                      <label
                        htmlFor="certificate-skills"
                        className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                      >
                        Skills / Technologies
                      </label>
                      <input
                        id="certificate-skills"
                        name="skills"
                        type="text"
                        value={certificateForm.skills}
                        onChange={handleCertificateFormChange}
                        placeholder="JavaScript, ES6+, Programming"
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                      />
                      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                        Separate multiple skills with commas.
                      </p>
                    </div>


                    {/* Certificate Image */}

                    <div
                      className="
                        rounded-2xl
                        border
                        border-gray-200
                        bg-gray-50
                        p-4
                        dark:border-gray-800
                        dark:bg-gray-950
                      "
                    >

                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div>
                          <p className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                            <FaImage className="text-indigo-500" />
                            Certificate Image
                          </p>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            JPG, JPEG, PNG or WEBP — maximum 5 MB.
                          </p>
                        </div>

                        {certificateImagePreview && (
                          <span className="rounded-full bg-green-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-green-600 dark:bg-green-500/10 dark:text-green-400">
                            Image selected
                          </span>
                        )}
                      </div>

                      <div className="grid gap-4 sm:grid-cols-[180px_1fr] sm:items-center">

                        <div className="flex h-36 w-full items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                          {certificateImagePreview ? (
                            <img
                              src={certificateImagePreview}
                              alt="Certificate preview"
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <div className="text-center text-gray-400 dark:text-gray-600">
                              <FaImage className="mx-auto text-3xl" />
                              <p className="mt-2 text-xs">No image</p>
                            </div>
                          )}
                        </div>

                        <div>
                          <label
                            className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 transition-colors hover:border-indigo-300 hover:bg-indigo-100 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 sm:w-auto"
                          >
                            <FaUpload />
                            {certificateImageFile ? 'Choose Different Image' : 'Choose Certificate Image'}
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              className="hidden"
                              disabled={certificateSubmitting || certificateUploading}
                              onChange={handleCertificateImageChange}
                            />
                          </label>

                          {certificateImageFile && (
                            <p className="mt-3 break-all text-xs text-gray-500 dark:text-gray-400">
                              {certificateImageFile.name}
                            </p>
                          )}

                          <p className="mt-2 text-xs leading-5 text-gray-400 dark:text-gray-500">
                            Existing certificate image will stay unchanged if you do not choose a new image while editing.
                          </p>
                        </div>

                      </div>

                    </div>


                    <div className="grid gap-5 md:grid-cols-2">

                      <div>
                        <label
                          htmlFor="certificate-display-order"
                          className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                        >
                          Display Order
                        </label>
                        <input
                          id="certificate-display-order"
                          name="displayOrder"
                          type="number"
                          min="0"
                          value={certificateForm.displayOrder}
                          onChange={handleCertificateFormChange}
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                        />
                      </div>

                      <div className="flex flex-col justify-end gap-3 sm:flex-row sm:items-center">

                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
                          <input
                            type="checkbox"
                            name="featured"
                            checked={certificateForm.featured}
                            onChange={handleCertificateFormChange}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Featured Certificate
                          </span>
                        </label>

                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
                          <input
                            type="checkbox"
                            name="isVisible"
                            checked={certificateForm.isVisible}
                            onChange={handleCertificateFormChange}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Visible on Portfolio
                          </span>
                        </label>

                      </div>

                    </div>


                    <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 dark:border-gray-800 sm:flex-row sm:justify-end">

                      <button
                        type="button"
                        onClick={closeCertificateForm}
                        disabled={certificateSubmitting || certificateUploading}
                        className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-900"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={certificateSubmitting || certificateUploading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {certificateUploading ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            Uploading Image...
                          </>
                        ) : certificateSubmitting ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <FaSave />
                            {editingCertificate ? 'Update Certificate' : 'Save Certificate'}
                          </>
                        )}
                      </button>

                    </div>

                  </form>

                </div>
              )}


              {/* Certificate List */}

              {certificatesLoading ? (
                <div
                  className="
                    flex
                    min-h-64
                    items-center
                    justify-center
                    rounded-3xl
                    border
                    border-gray-200
                    bg-white
                    dark:border-gray-800
                    dark:bg-gray-900
                  "
                >
                  <Loader />
                </div>
              ) : certificates.length === 0 ? (
                <div
                  className="
                    rounded-3xl
                    border
                    border-dashed
                    border-gray-300
                    bg-white
                    p-10
                    text-center
                    dark:border-gray-700
                    dark:bg-gray-900
                  "
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    <FaCertificate className="text-2xl" />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-gray-900 dark:text-white">
                    No certificates yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
                    Add your first certificate with its image and credential details.
                  </p>

                  <button
                    type="button"
                    onClick={openCertificateCreateForm}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    <FaPlus />
                    Add Certificate
                  </button>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                  {certificates.map((certificate) => (
                    <article
                      key={certificate._id}
                      className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
                    >

                      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-950">
                        {certificate.image ? (
                          <img
                            src={certificate.image}
                            alt={certificate.title || 'Certificate'}
                            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-gray-400 dark:text-gray-600">
                            <div className="text-center">
                              <FaCertificate className="mx-auto text-4xl" />
                              <p className="mt-2 text-xs">No certificate image</p>
                            </div>
                          </div>
                        )}

                        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                          {certificate.featured && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-lg">
                              <FaStar />
                              Featured
                            </span>
                          )}

                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold text-white shadow-lg ${
                              certificate.isVisible === false
                                ? 'bg-gray-600'
                                : 'bg-green-600'
                            }`}
                          >
                            {certificate.isVisible === false ? <FaEyeSlash /> : <FaEye />}
                            {certificate.isVisible === false ? 'Hidden' : 'Visible'}
                          </span>
                        </div>

                      </div>

                      <div className="p-5">

                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="line-clamp-2 text-lg font-extrabold text-gray-900 dark:text-white">
                              {certificate.title}
                            </h3>
                            <p className="mt-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                              {certificate.issuer}
                            </p>
                          </div>

                          <span className="shrink-0 rounded-lg bg-gray-100 px-2 py-1 text-[10px] font-bold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                            #{certificate.displayOrder ?? 0}
                          </span>
                        </div>

                        {certificate.issueDate && (
                          <p className="mt-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                            Issued: {certificate.issueDate}
                          </p>
                        )}

                        {certificate.description && (
                          <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                            {certificate.description}
                          </p>
                        )}

                        {Array.isArray(certificate.skills) && certificate.skills.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {certificate.skills.slice(0, 5).map((skill) => (
                              <span
                                key={`${certificate._id}-${skill}`}
                                className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="mt-5 grid grid-cols-2 gap-2">

                          <button
                            type="button"
                            onClick={() => openCertificateEditForm(certificate)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-3 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                          >
                            <FaEdit />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteCertificate(certificate._id)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                          >
                            <FaTrash />
                            Delete
                          </button>

                        </div>

                        {certificate.credentialUrl && (
                          <a
                            href={certificate.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-800 dark:text-gray-400 dark:hover:border-indigo-500/30 dark:hover:text-indigo-400"
                          >
                            <FaExternalLinkAlt className="text-xs" />
                            Verify Credential
                          </a>
                        )}

                      </div>

                    </article>
                  ))}

                </div>
              )}

            </section>
          )}


          {/* =================================================
              PROFILE
          ================================================== */}

          {activeSection ===
            'profile' && (
            <ProfileManager />
          )}


          {/* =================================================
              EXPERIENCE & EDUCATION MANAGEMENT
          ================================================== */}

          {activeSection ===
            'experienceEducation' && (
            <ExperienceEducationManager />
          )}


          {/* =================================================
              RESUME MANAGEMENT
          ================================================== */}

          {activeSection ===
            'resume' && (
            <section>

              <div
                className="
                  max-w-3xl
                  rounded-3xl
                  border
                  border-gray-200
                  bg-white
                  p-5
                  shadow-sm
                  dark:border-gray-800
                  dark:bg-gray-900
                  sm:p-8
                "
              >

                <div className="mb-7">

                  <p
                    className="
                      flex
                      items-center
                      gap-2
                      text-sm
                      font-semibold
                      text-indigo-600
                      dark:text-indigo-400
                    "
                  >
                    <FaFilePdf />
                    Portfolio Resume
                  </p>

                  <h2
                    className="
                      mt-1
                      text-2xl
                      font-extrabold
                      text-gray-900
                      dark:text-white
                    "
                  >
                    Manage Resume
                  </h2>

                  <p
                    className="
                      mt-2
                      max-w-2xl
                      text-sm
                      leading-6
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    Upload a new PDF whenever you update your resume.
                    The portfolio will automatically use the latest uploaded
                    resume.
                  </p>

                </div>


                <div
                  className="
                    rounded-2xl
                    border
                    border-gray-200
                    bg-gray-50
                    p-4
                    dark:border-gray-800
                    dark:bg-gray-950
                    sm:p-5
                  "
                >

                  <div
                    className="
                      flex
                      flex-col
                      gap-4
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >

                    <div className="flex min-w-0 items-center gap-3">

                      <div
                        className="
                          flex
                          h-12
                          w-12
                          shrink-0
                          items-center
                          justify-center
                          rounded-2xl
                          bg-red-50
                          text-red-500
                          dark:bg-red-500/10
                        "
                      >
                        <FaFilePdf className="text-xl" />
                      </div>

                      <div className="min-w-0">

                        <p
                          className="
                            truncate
                            text-sm
                            font-bold
                            text-gray-900
                            dark:text-white
                          "
                        >
                          {resumeInfo?.filename || 'No resume uploaded yet'}
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          {resumeLoading
                            ? 'Checking current resume...'
                            : resumeInfo?.exists
                              ? `${resumeInfo.sizeFormatted || 'PDF'}${resumeInfo.updatedAt ? ` • Updated ${formatDateTime(resumeInfo.updatedAt)}` : ''}`
                              : 'Upload your first resume from this dashboard.'}
                        </p>

                      </div>

                    </div>


                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                        resumeInfo?.exists
                          ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400'
                          : 'bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400'
                      }`}
                    >
                      {resumeInfo?.exists ? 'Active' : 'Not Uploaded'}
                    </span>

                  </div>


                  <div
                    className="
                      mt-5
                      grid
                      gap-3
                      sm:grid-cols-2
                    "
                  >

                    {resumeInfo?.exists && (
                      <>

                        <a
                          href={resumeInfo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-indigo-500/30 dark:hover:text-indigo-400"
                        >
                          <FaExternalLinkAlt className="text-xs" />
                          View Resume
                        </a>

                        <a
                          href={resumeInfo.url}
                          download={resumeInfo.originalName || 'Vivek-Rana-Resume.pdf'}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                        >
                          <FaDownload />
                          Download Resume
                        </a>

                      </>
                    )}

                    <label
                      className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 transition-colors hover:border-indigo-300 hover:bg-indigo-100 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 ${resumeInfo?.exists ? 'sm:col-span-2' : 'sm:col-span-2'}`}
                    >
                      {resumeUploading ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Uploading Resume...
                        </>
                      ) : (
                        <>
                          <FaUpload />
                          {resumeInfo?.exists ? 'Replace Resume' : 'Upload Resume'}
                        </>
                      )}

                      <input
                        type="file"
                        accept="application/pdf,.pdf"
                        className="hidden"
                        disabled={resumeUploading}
                        onChange={handleResumeUpload}
                      />
                    </label>

                  </div>

                </div>


                <div
                  className="
                    mt-5
                    rounded-2xl
                    border
                    border-indigo-100
                    bg-indigo-50
                    p-4
                    text-xs
                    leading-5
                    text-indigo-700
                    dark:border-indigo-500/10
                    dark:bg-indigo-500/10
                    dark:text-indigo-300
                  "
                >
                  <p className="font-semibold">How it works</p>
                  <p className="mt-1">
                    Upload a PDF here → it is stored securely in the backend
                    database → your public portfolio automatically starts
                    using the latest version. Your old static resume remains
                    as a fallback until the first upload.
                  </p>
                </div>

              </div>

            </section>
          )}


          {/* =================================================
              SETTINGS
          ================================================== */}

          {activeSection ===
            'settings' && (
            <section className="space-y-6">

              <div
                className="
                  rounded-3xl
                  border
                  border-gray-200
                  bg-white
                  p-6
                  shadow-sm
                  dark:border-gray-800
                  dark:bg-gray-900
                  sm:p-8
                "
              >

                <div
                  className="
                    flex
                    flex-col
                    gap-5
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                  "
                >

                  <div>
                    <p
                      className="
                        text-sm
                        font-semibold
                        text-indigo-600
                        dark:text-indigo-400
                      "
                    >
                      Preferences
                    </p>

                    <h2
                      className="
                        mt-1
                        text-2xl
                        font-extrabold
                        text-gray-900
                        dark:text-white
                      "
                    >
                      Settings
                    </h2>

                    <p
                      className="
                        mt-2
                        text-sm
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      Manage your dashboard preferences.
                    </p>
                  </div>


                  <div className="flex gap-3">

                    <button
                      type="button"
                      onClick={resetSettings}
                      disabled={
                        settingsSaving ||
                        settingsLoading
                      }
                      className="
                        rounded-xl
                        border
                        border-gray-200
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-gray-700
                        hover:bg-gray-50
                        disabled:opacity-50
                        dark:border-gray-700
                        dark:text-gray-300
                        dark:hover:bg-gray-800
                      "
                    >
                      Reset
                    </button>

                    <button
                      type="button"
                      onClick={saveSettings}
                      disabled={
                        settingsSaving ||
                        settingsLoading
                      }
                      className="
                        rounded-xl
                        bg-indigo-600
                        px-5
                        py-2.5
                        text-sm
                        font-semibold
                        text-white
                        hover:bg-indigo-700
                        disabled:opacity-50
                      "
                    >
                      {settingsSaving
                        ? 'Saving...'
                        : 'Save Changes'}
                    </button>

                  </div>

                </div>


                {settingsError && (
                  <div
                    className="
                      mt-5
                      rounded-2xl
                      border
                      border-amber-200
                      bg-amber-50
                      p-4
                      text-sm
                      text-amber-700
                      dark:border-amber-500/20
                      dark:bg-amber-500/10
                      dark:text-amber-300
                    "
                  >
                    {settingsError}
                  </div>
                )}

              </div>


              {settingsLoading ? (
                <div
                  className="
                    flex
                    min-h-64
                    items-center
                    justify-center
                    rounded-3xl
                    border
                    border-gray-200
                    bg-white
                    dark:border-gray-800
                    dark:bg-gray-900
                  "
                >
                  <Loader />
                </div>
              ) : (
                <div className="grid gap-6 xl:grid-cols-2">

                  <div
                    className="
                      rounded-3xl
                      border
                      border-gray-200
                      bg-white
                      p-6
                      shadow-sm
                      dark:border-gray-800
                      dark:bg-gray-900
                    "
                  >

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-indigo-600
                        dark:text-indigo-400
                      "
                    >
                      Dashboard
                    </p>

                    <h3
                      className="
                        mt-1
                        text-xl
                        font-extrabold
                        text-gray-900
                        dark:text-white
                      "
                    >
                      Dashboard Preferences
                    </h3>


                    <div className="mt-6 space-y-4">

                      <div>
                        <label
                          htmlFor="defaultDashboardSection"
                          className="
                            mb-2
                            block
                            text-sm
                            font-semibold
                            text-gray-900
                            dark:text-white
                          "
                        >
                          Default Dashboard Section
                        </label>

                        <select
                          id="defaultDashboardSection"
                          value={
                            settings.dashboard.defaultSection
                          }
                          onChange={(event) =>
                            updateSetting(
                              'dashboard',
                              'defaultSection',
                              event.target.value
                            )
                          }
                          className="
                            w-full
                            rounded-xl
                            border
                            border-gray-200
                            bg-white
                            px-4
                            py-3
                            text-sm
                            outline-none
                            dark:border-gray-700
                            dark:bg-gray-950
                            dark:text-white
                          "
                        >
                          <option value="overview">
                            Overview
                          </option>
                          <option value="projects">
                            Projects
                          </option>
                          <option value="certificates">
                            Certificates
                          </option>
                          <option value="messages">
                            Messages
                          </option>
                          <option value="profile">
                            Profile
                          </option>
                          <option value="settings">
                            Settings
                          </option>
                          <option value="resume">
                            Resume
                          </option>
                        </select>
                      </div>


                      <label
                        className="
                          flex
                          items-center
                          justify-between
                          gap-4
                          rounded-2xl
                          border
                          border-gray-200
                          p-4
                          dark:border-gray-800
                        "
                      >
                        <span>
                          <span
                            className="
                              block
                              text-sm
                              font-semibold
                              text-gray-900
                              dark:text-white
                            "
                          >
                            Compact Sidebar
                          </span>

                          <span
                            className="
                              mt-1
                              block
                              text-xs
                              text-gray-500
                              dark:text-gray-400
                            "
                          >
                            Save compact sidebar preference.
                          </span>
                        </span>

                        <input
                          type="checkbox"
                          checked={
                            settings.dashboard.compactSidebar
                          }
                          onChange={(event) =>
                            updateSetting(
                              'dashboard',
                              'compactSidebar',
                              event.target.checked
                            )
                          }
                          className="h-5 w-5"
                        />
                      </label>


                      <label
                        className="
                          flex
                          items-center
                          justify-between
                          gap-4
                          rounded-2xl
                          border
                          border-gray-200
                          p-4
                          dark:border-gray-800
                        "
                      >
                        <span>
                          <span
                            className="
                              block
                              text-sm
                              font-semibold
                              text-gray-900
                              dark:text-white
                            "
                          >
                            Confirm Before Delete
                          </span>

                          <span
                            className="
                              mt-1
                              block
                              text-xs
                              text-gray-500
                              dark:text-gray-400
                            "
                          >
                            Ask before delete actions.
                          </span>
                        </span>

                        <input
                          type="checkbox"
                          checked={
                            settings.dashboard.confirmBeforeDelete
                          }
                          onChange={(event) =>
                            updateSetting(
                              'dashboard',
                              'confirmBeforeDelete',
                              event.target.checked
                            )
                          }
                          className="h-5 w-5"
                        />
                      </label>


                      <label
                        className="
                          flex
                          items-center
                          justify-between
                          gap-4
                          rounded-2xl
                          border
                          border-gray-200
                          p-4
                          dark:border-gray-800
                        "
                      >
                        <span>
                          <span
                            className="
                              block
                              text-sm
                              font-semibold
                              text-gray-900
                              dark:text-white
                            "
                          >
                            Auto Refresh Messages
                          </span>

                          <span
                            className="
                              mt-1
                              block
                              text-xs
                              text-gray-500
                              dark:text-gray-400
                            "
                          >
                            Refresh messages every 30 seconds.
                          </span>
                        </span>

                        <input
                          type="checkbox"
                          checked={
                            settings.dashboard.autoRefreshMessages
                          }
                          onChange={(event) =>
                            updateSetting(
                              'dashboard',
                              'autoRefreshMessages',
                              event.target.checked
                            )
                          }
                          className="h-5 w-5"
                        />
                      </label>

                    </div>

                  </div>


                  <div
                    className="
                      rounded-3xl
                      border
                      border-gray-200
                      bg-white
                      p-6
                      shadow-sm
                      dark:border-gray-800
                      dark:bg-gray-900
                    "
                  >

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-indigo-600
                        dark:text-indigo-400
                      "
                    >
                      Notifications
                    </p>

                    <h3
                      className="
                        mt-1
                        text-xl
                        font-extrabold
                        text-gray-900
                        dark:text-white
                      "
                    >
                      Notification Preferences
                    </h3>


                    <div className="mt-6 space-y-4">

                      <label
                        className="
                          flex
                          items-center
                          justify-between
                          gap-4
                          rounded-2xl
                          border
                          border-gray-200
                          p-4
                          dark:border-gray-800
                        "
                      >
                        <span>
                          <span
                            className="
                              block
                              text-sm
                              font-semibold
                              text-gray-900
                              dark:text-white
                            "
                          >
                            New Message Badge
                          </span>

                          <span
                            className="
                              mt-1
                              block
                              text-xs
                              text-gray-500
                              dark:text-gray-400
                            "
                          >
                            Show unread message count.
                          </span>
                        </span>

                        <input
                          type="checkbox"
                          checked={
                            settings.notifications.newMessageBadge
                          }
                          onChange={(event) =>
                            updateSetting(
                              'notifications',
                              'newMessageBadge',
                              event.target.checked
                            )
                          }
                          className="h-5 w-5"
                        />
                      </label>


                      <label
                        className="
                          flex
                          items-center
                          justify-between
                          gap-4
                          rounded-2xl
                          border
                          border-gray-200
                          p-4
                          dark:border-gray-800
                        "
                      >
                        <span>
                          <span
                            className="
                              block
                              text-sm
                              font-semibold
                              text-gray-900
                              dark:text-white
                            "
                          >
                            Success Notifications
                          </span>

                          <span
                            className="
                              mt-1
                              block
                              text-xs
                              text-gray-500
                              dark:text-gray-400
                            "
                          >
                            Show success notifications.
                          </span>
                        </span>

                        <input
                          type="checkbox"
                          checked={
                            settings.notifications.successNotifications
                          }
                          onChange={(event) =>
                            updateSetting(
                              'notifications',
                              'successNotifications',
                              event.target.checked
                            )
                          }
                          className="h-5 w-5"
                        />
                      </label>


                      <label
                        className="
                          flex
                          items-center
                          justify-between
                          gap-4
                          rounded-2xl
                          border
                          border-gray-200
                          p-4
                          dark:border-gray-800
                        "
                      >
                        <span>
                          <span
                            className="
                              block
                              text-sm
                              font-semibold
                              text-gray-900
                              dark:text-white
                            "
                          >
                            Browser Notifications
                          </span>

                          <span
                            className="
                              mt-1
                              block
                              text-xs
                              text-gray-500
                              dark:text-gray-400
                            "
                          >
                            Allow browser notifications.
                          </span>
                        </span>

                        <input
                          type="checkbox"
                          checked={
                            settings.notifications.browserNotifications
                          }
                          onChange={(event) =>
                            updateSetting(
                              'notifications',
                              'browserNotifications',
                              event.target.checked
                            )
                          }
                          className="h-5 w-5"
                        />
                      </label>

                    </div>

                  </div>


                  <div
                    className="
                      rounded-3xl
                      border
                      border-gray-200
                      bg-white
                      p-6
                      shadow-sm
                      dark:border-gray-800
                      dark:bg-gray-900
                      xl:col-span-2
                    "
                  >

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-indigo-600
                        dark:text-indigo-400
                      "
                    >
                      Account
                    </p>

                    <h3
                      className="
                        mt-1
                        text-xl
                        font-extrabold
                        text-gray-900
                        dark:text-white
                      "
                    >
                      Admin Account
                    </h3>


                    <div
                      className="
                        mt-5
                        grid
                        gap-4
                        md:grid-cols-2
                      "
                    >

                      <div
                        className="
                          rounded-2xl
                          border
                          border-gray-200
                          bg-gray-50
                          p-4
                          dark:border-gray-800
                          dark:bg-gray-950
                        "
                      >
                        <p
                          className="
                            text-xs
                            font-semibold
                            uppercase
                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          Username
                        </p>

                        <p
                          className="
                            mt-2
                            text-sm
                            font-semibold
                            text-gray-900
                            dark:text-white
                          "
                        >
                          {admin?.username || 'Admin'}
                        </p>
                      </div>


                      <div
                        className="
                          rounded-2xl
                          border
                          border-gray-200
                          bg-gray-50
                          p-4
                          dark:border-gray-800
                          dark:bg-gray-950
                        "
                      >
                        <p
                          className="
                            text-xs
                            font-semibold
                            uppercase
                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          Email
                        </p>

                        <p
                          className="
                            mt-2
                            break-all
                            text-sm
                            font-semibold
                            text-gray-900
                            dark:text-white
                          "
                        >
                          {admin?.email || 'Not available'}
                        </p>
                      </div>

                    </div>

                  </div>

                </div>
              )}

            </section>
          )}


        </div>

      </main>


      {/* =====================================================
          MESSAGE VIEW MODAL
      ====================================================== */}

      {selectedMessage && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/60
            p-4
            backdrop-blur-sm
          "
        >

          <div
            className="
              max-h-[90vh]
              w-full
              max-w-2xl
              overflow-hidden
              rounded-3xl
              border
              border-gray-200
              bg-white
              shadow-2xl
              dark:border-gray-800
              dark:bg-gray-900
            "
          >

            {/* Modal Header */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-gray-200
                px-6
                py-5
                dark:border-gray-800
              "
            >

              <div>

                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-indigo-600
                    dark:text-indigo-400
                  "
                >
                  Visitor Message
                </p>


                <h2
                  className="
                    mt-1
                    text-xl
                    font-bold
                    text-gray-900
                    dark:text-white
                  "
                >
                  {getMessageSubject(
                    selectedMessage
                  )}
                </h2>

              </div>


              <button
                type="button"
                onClick={() =>
                  setSelectedMessage(null)
                }
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  text-gray-500
                  hover:bg-gray-100
                  dark:hover:bg-gray-800
                "
              >
                <FaTimes />
              </button>

            </div>


            {/* Modal Content */}

            <div
              className="
                max-h-[65vh]
                overflow-y-auto
                p-6
              "
            >

              {/* Sender */}

              <div
                className="
                  rounded-2xl
                  border
                  border-gray-200
                  bg-gray-50
                  p-4
                  dark:border-gray-800
                  dark:bg-gray-950
                "
              >

                <div
                  className="
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >

                  <div>

                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-wider
                        text-gray-400
                      "
                    >
                      From
                    </p>


                    <p
                      className="
                        mt-1
                        font-bold
                        text-gray-900
                        dark:text-white
                      "
                    >
                      {getMessageName(
                        selectedMessage
                      )}
                    </p>


                    <p
                      className="
                        mt-1
                        text-sm
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      {getMessageEmail(
                        selectedMessage
                      )}
                    </p>

                  </div>


                  <div
                    className="
                      text-left
                      sm:text-right
                    "
                  >

                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-wider
                        text-gray-400
                      "
                    >
                      Received
                    </p>


                    <p
                      className="
                        mt-1
                        text-sm
                        font-medium
                        text-gray-700
                        dark:text-gray-300
                      "
                    >
                      {formatDateTime(
                        selectedMessage.createdAt
                      )}
                    </p>

                  </div>

                </div>

              </div>


              {/* Subject */}

              <div className="mt-6">

                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-400
                  "
                >
                  Subject
                </p>


                <p
                  className="
                    mt-2
                    text-base
                    font-semibold
                    text-gray-900
                    dark:text-white
                  "
                >
                  {getMessageSubject(
                    selectedMessage
                  )}
                </p>

              </div>


              {/* Message */}

              <div className="mt-6">

                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-gray-400
                  "
                >
                  Message
                </p>


                <div
                  className="
                    mt-2
                    whitespace-pre-wrap
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    p-5
                    text-sm
                    leading-7
                    text-gray-700
                    dark:border-gray-800
                    dark:bg-gray-950
                    dark:text-gray-300
                  "
                >
                  {getMessageContent(
                    selectedMessage
                  )}
                </div>

              </div>

            </div>


            {/* Modal Footer */}

            <div
              className="
                flex
                flex-wrap
                justify-end
                gap-2
                border-t
                border-gray-200
                px-6
                py-4
                dark:border-gray-800
              "
            >

              {!selectedMessage.isRead && (
                <button
                  type="button"
                  onClick={() =>
                    handleMarkAsRead(
                      selectedMessage._id
                    )
                  }
                  className="
                    inline-flex
                    w-full
                    sm:w-auto
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-green-600
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    hover:bg-green-700
                  "
                >

                  <FaCheck />

                  Mark as Read

                </button>
              )}


              <button
                type="button"
                onClick={() =>
                  handleDeleteMessage(
                    selectedMessage._id
                  )
                }
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-red-600
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  hover:bg-red-700
                "
              >

                <FaTrash />

                Delete

              </button>


              <button
                type="button"
                onClick={() =>
                  setSelectedMessage(null)
                }
                className="
                  rounded-xl
                  border
                  border-gray-200
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-gray-700
                  hover:bg-gray-50
                  dark:border-gray-700
                  dark:text-gray-300
                  dark:hover:bg-gray-800
                "
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}


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
