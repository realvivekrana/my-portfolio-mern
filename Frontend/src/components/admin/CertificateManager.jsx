import { useEffect, useRef, useState } from 'react';

import { toast } from 'react-toastify';

import {
  FaAward,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaStar,
  FaRegStar,
  FaUpload,
  FaExternalLinkAlt,
  FaTimes,
  FaSave,
  FaSpinner,
  FaImage,
  FaCalendarAlt,
  FaBuilding,
  FaLink,
  FaTags,
} from 'react-icons/fa';

import API from '../../utils/axios';

function CertificateManager() {
  /*
  |--------------------------------------------------------------------------
  | Certificate State
  |--------------------------------------------------------------------------
  */

  const [certificates, setCertificates] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Modal State
  |--------------------------------------------------------------------------
  */

  const [showModal, setShowModal] = useState(false);

  const [editingCertificate, setEditingCertificate] =
    useState(null);

  /*
  |--------------------------------------------------------------------------
  | Image Preview
  |--------------------------------------------------------------------------
  */

  const [imagePreview, setImagePreview] = useState('');

  const imageInputRef = useRef(null);

  /*
  |--------------------------------------------------------------------------
  | Empty Form
  |--------------------------------------------------------------------------
  */

  const emptyForm = {
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

  /*
  |--------------------------------------------------------------------------
  | Form State
  |--------------------------------------------------------------------------
  */

  const [formData, setFormData] =
    useState(emptyForm);

  /*
  |--------------------------------------------------------------------------
  | Fetch Certificates
  |--------------------------------------------------------------------------
  */

  const fetchCertificates = async () => {
    try {
      setLoading(true);

      const response = await API.get(
        '/certificates/admin'
      );

      setCertificates(
        response.data?.data || []
      );
    } catch (error) {
      console.error(
        'Certificates fetch error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
          'Failed to load certificates'
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Initial Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchCertificates();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Open Add Modal
  |--------------------------------------------------------------------------
  */

  const handleAddCertificate = () => {
    setEditingCertificate(null);

    setFormData({
      ...emptyForm,
    });

    setImagePreview('');

    setShowModal(true);
  };

  /*
  |--------------------------------------------------------------------------
  | Open Edit Modal
  |--------------------------------------------------------------------------
  */

  const handleEditCertificate = (
    certificate
  ) => {
    setEditingCertificate(
      certificate
    );

    setFormData({
      title:
        certificate.title || '',

      issuer:
        certificate.issuer || '',

      issueDate:
        certificate.issueDate || '',

      description:
        certificate.description || '',

      image:
        certificate.image || '',

      credentialUrl:
        certificate.credentialUrl || '',

      skills:
        Array.isArray(
          certificate.skills
        )
          ? certificate.skills.join(', ')
          : '',

      featured:
        Boolean(
          certificate.featured
        ),

      displayOrder:
        certificate.displayOrder || 0,

      isVisible:
        certificate.isVisible !== false,
    });

    setImagePreview(
      certificate.image || ''
    );

    setShowModal(true);
  };

  /*
  |--------------------------------------------------------------------------
  | Close Modal
  |--------------------------------------------------------------------------
  */

  const handleCloseModal = () => {
    if (
      saving ||
      uploadingImage
    ) {
      return;
    }

    setShowModal(false);

    setEditingCertificate(null);

    setFormData({
      ...emptyForm,
    });

    setImagePreview('');
  };

  /*
  |--------------------------------------------------------------------------
  | Form Change
  |--------------------------------------------------------------------------
  */

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,

        [name]:
          type === 'checkbox'
            ? checked
            : value,
      })
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Certificate Image Upload
  |--------------------------------------------------------------------------
  */

  const handleImageUpload = async (
    event
  ) => {
    const file =
      event.target.files?.[0];

    event.target.value = '';

    if (!file) {
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | File Type Validation
    |--------------------------------------------------------------------------
    */

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      toast.error(
        'Only JPG, JPEG, PNG and WEBP images are allowed.'
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | File Size Validation
    |--------------------------------------------------------------------------
    */

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error(
        'Certificate image must be 5 MB or smaller.'
      );

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Local Preview
    |--------------------------------------------------------------------------
    */

    const localPreview =
      URL.createObjectURL(file);

    setImagePreview(
      localPreview
    );

    /*
    |--------------------------------------------------------------------------
    | Upload To Backend
    |--------------------------------------------------------------------------
    */

    try {
      setUploadingImage(true);

      const uploadData =
        new FormData();

      uploadData.append(
        'certificateImage',
        file
      );

      if (
        editingCertificate?._id
      ) {
        uploadData.append(
          'certificateId',
          editingCertificate._id
        );
      }

      const response =
        await API.post(
          '/certificates/upload-image',
          uploadData
        );

      const uploadedImage =
        response.data?.data?.image;

      if (!uploadedImage) {
        throw new Error(
          'Image URL was not returned by server.'
        );
      }

      setFormData(
        (previous) => ({
          ...previous,
          image:
            uploadedImage,
        })
      );

      setImagePreview(
        uploadedImage
      );

      /*
      |--------------------------------------------------------------------------
      | Update Existing Certificate State
      |--------------------------------------------------------------------------
      */

      if (
        editingCertificate?._id
      ) {
        setCertificates(
          (previous) =>
            previous.map(
              (certificate) =>
                certificate._id ===
                editingCertificate._id
                  ? {
                      ...certificate,
                      image:
                        uploadedImage,
                    }
                  : certificate
            )
        );

        setEditingCertificate(
          (previous) =>
            previous
              ? {
                  ...previous,
                  image:
                    uploadedImage,
                }
              : previous
        );
      }

      toast.success(
        'Certificate image uploaded successfully.'
      );
    } catch (error) {
      console.error(
        'Certificate image upload error:',
        error
      );

      setImagePreview(
        formData.image || ''
      );

      toast.error(
        error.response?.data?.message ||
          'Failed to upload certificate image'
      );
    } finally {
      setUploadingImage(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Save Certificate
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    /*
    |--------------------------------------------------------------------------
    | Required Validation
    |--------------------------------------------------------------------------
    */

    if (!formData.title.trim()) {
      toast.error(
        'Certificate title is required.'
      );

      return;
    }

    if (!formData.issuer.trim()) {
      toast.error(
        'Certificate issuer is required.'
      );

      return;
    }

    try {
      setSaving(true);

      const payload = {
        title:
          formData.title.trim(),

        issuer:
          formData.issuer.trim(),

        issueDate:
          formData.issueDate.trim(),

        description:
          formData.description.trim(),

        image:
          formData.image.trim(),

        credentialUrl:
          formData.credentialUrl.trim(),

        skills:
          formData.skills
            .split(',')
            .map(
              (skill) =>
                skill.trim()
            )
            .filter(Boolean),

        featured:
          Boolean(
            formData.featured
          ),

        displayOrder:
          Number(
            formData.displayOrder
          ) || 0,

        isVisible:
          Boolean(
            formData.isVisible
          ),
      };

      /*
      |--------------------------------------------------------------------------
      | UPDATE
      |--------------------------------------------------------------------------
      */

      if (
        editingCertificate?._id
      ) {
        const response =
          await API.put(
            `/certificates/${editingCertificate._id}`,
            payload
          );

        const updatedCertificate =
          response.data?.data;

        setCertificates(
          (previous) =>
            previous.map(
              (certificate) =>
                certificate._id ===
                editingCertificate._id
                  ? updatedCertificate
                  : certificate
            )
        );

        toast.success(
          'Certificate updated successfully.'
        );
      }

      /*
      |--------------------------------------------------------------------------
      | CREATE
      |--------------------------------------------------------------------------
      */

      else {
        const response =
          await API.post(
            '/certificates',
            payload
          );

        const newCertificate =
          response.data?.data;

        setCertificates(
          (previous) => [
            newCertificate,
            ...previous,
          ]
        );

        toast.success(
          'Certificate added successfully.'
        );
      }

      handleCloseModal();
    } catch (error) {
      console.error(
        'Save certificate error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
          'Failed to save certificate'
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete Certificate
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        'Are you sure you want to delete this certificate?'
      );

    if (!confirmed) {
      return;
    }

    try {
      await API.delete(
        `/certificates/${id}`
      );

      setCertificates(
        (previous) =>
          previous.filter(
            (certificate) =>
              certificate._id !== id
          )
      );

      toast.success(
        'Certificate deleted successfully.'
      );
    } catch (error) {
      console.error(
        'Delete certificate error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
          'Failed to delete certificate'
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Toggle Visibility
  |--------------------------------------------------------------------------
  */

  const handleToggleVisibility =
    async (certificate) => {
      try {
        const response =
          await API.put(
            `/certificates/${certificate._id}`,
            {
              isVisible:
                !certificate.isVisible,
            }
          );

        const updatedCertificate =
          response.data?.data;

        setCertificates(
          (previous) =>
            previous.map(
              (item) =>
                item._id ===
                certificate._id
                  ? updatedCertificate
                  : item
            )
        );

        toast.success(
          updatedCertificate.isVisible
            ? 'Certificate is now visible.'
            : 'Certificate hidden successfully.'
        );
      } catch (error) {
        console.error(
          'Toggle visibility error:',
          error
        );

        toast.error(
          error.response?.data?.message ||
            'Failed to update visibility'
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Toggle Featured
  |--------------------------------------------------------------------------
  */

  const handleToggleFeatured =
    async (certificate) => {
      try {
        const response =
          await API.put(
            `/certificates/${certificate._id}`,
            {
              featured:
                !certificate.featured,
            }
          );

        const updatedCertificate =
          response.data?.data;

        setCertificates(
          (previous) =>
            previous.map(
              (item) =>
                item._id ===
                certificate._id
                  ? updatedCertificate
                  : item
            )
        );

        toast.success(
          updatedCertificate.featured
            ? 'Certificate marked as featured.'
            : 'Certificate removed from featured.'
        );
      } catch (error) {
        console.error(
          'Toggle featured error:',
          error
        );

        toast.error(
          error.response?.data?.message ||
            'Failed to update featured status'
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Format Date
  |--------------------------------------------------------------------------
  */

  const formatDate = (
    date
  ) => {
    if (!date) {
      return 'No date';
    }

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
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <FaSpinner className="animate-spin text-3xl text-indigo-500" />

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading certificates...
          </p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="w-full">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <FaAward className="text-xl" />
            </div>

            <div>

              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                Certificates
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage your professional certificates.
              </p>

            </div>

          </div>

        </div>

        <button
          type="button"
          onClick={
            handleAddCertificate
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl"
        >
          <FaPlus />

          Add Certificate
        </button>

      </div>

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {certificates.length ===
        0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-400">
            <FaAward />
          </div>

          <h3 className="mt-5 text-lg font-bold text-gray-900 dark:text-white">
            No certificates yet
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
            Add your first professional certificate and it will appear on your portfolio.
          </p>

          <button
            type="button"
            onClick={
              handleAddCertificate
            }
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <FaPlus />

            Add Your First Certificate
          </button>

        </div>
      ) : (

        /* ===================================================
           CERTIFICATE GRID
        ==================================================== */

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {certificates.map(
            (certificate) => (
              <article
                key={
                  certificate._id
                }
                className={`group overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-900 ${
                  certificate.isVisible
                    ? 'border-gray-200 dark:border-gray-800'
                    : 'border-red-200 opacity-75 dark:border-red-500/20'
                }`}
              >

                {/* Image */}

                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 dark:bg-gray-950">

                  {certificate.image ? (
                    <img
                      src={
                        certificate.image
                      }
                      alt={
                        certificate.title
                      }
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center text-gray-400">

                      <FaImage className="text-4xl" />

                      <span className="mt-2 text-xs">
                        No certificate image
                      </span>

                    </div>
                  )}

                  {/* Status */}

                  <div className="absolute left-3 top-3 flex flex-wrap gap-2">

                    {certificate.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                        <FaStar />

                        Featured
                      </span>
                    )}

                    {!certificate.isVisible && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                        <FaEyeSlash />

                        Hidden
                      </span>
                    )}

                  </div>

                </div>

                {/* Content */}

                <div className="p-5">

                  <h3 className="line-clamp-2 text-lg font-extrabold text-gray-900 dark:text-white">
                    {certificate.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400">

                    <FaBuilding className="shrink-0 text-indigo-500" />

                    <span className="truncate">
                      {certificate.issuer}
                    </span>

                  </div>

                  {certificate.issueDate && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">

                      <FaCalendarAlt />

                      {formatDate(
                        certificate.issueDate
                      )}

                    </div>
                  )}

                  {certificate.description && (
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                      {
                        certificate.description
                      }
                    </p>
                  )}

                  {/* Skills */}

                  {certificate.skills
                    ?.length >
                    0 && (
                    <div className="mt-4 flex flex-wrap gap-2">

                      {certificate.skills
                        .slice(
                          0,
                          5
                        )
                        .map(
                          (skill) => (
                            <span
                              key={`${certificate._id}-${skill}`}
                              className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400"
                            >
                              {
                                skill
                              }
                            </span>
                          )
                        )}

                    </div>
                  )}

                  {/* Actions */}

                  <div className="mt-5 grid grid-cols-2 gap-2">

                    <button
                      type="button"
                      onClick={() =>
                        handleEditCertificate(
                          certificate
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                    >
                      <FaEdit />

                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          certificate._id
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-400 dark:hover:bg-red-500/10"
                    >
                      <FaTrash />

                      Delete
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleToggleVisibility(
                          certificate
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800"
                    >
                      {certificate.isVisible ? (
                        <>
                          <FaEye />

                          Visible
                        </>
                      ) : (
                        <>
                          <FaEyeSlash />

                          Hidden
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleToggleFeatured(
                          certificate
                        )
                      }
                      className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors ${
                        certificate.featured
                          ? 'border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/5 dark:text-amber-400'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800'
                      }`}
                    >
                      {certificate.featured ? (
                        <FaStar />
                      ) : (
                        <FaRegStar />
                      )}

                      Featured
                    </button>

                  </div>

                  {/* Credential */}

                  {certificate.credentialUrl && (
                    <a
                      href={
                        certificate.credentialUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
                    >
                      <FaExternalLinkAlt />

                      View Credential
                    </a>
                  )}

                </div>

              </article>
            )
          )}

        </div>
      )}

      {/* =====================================================
          ADD / EDIT MODAL
      ====================================================== */}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:items-center">

          <div className="my-4 w-full max-w-3xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5 sm:px-7 dark:border-gray-800">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
                  Certificate Manager
                </p>

                <h3 className="mt-1 text-xl font-extrabold text-gray-900 dark:text-white">
                  {editingCertificate
                    ? 'Edit Certificate'
                    : 'Add Certificate'}
                </h3>

              </div>

              <button
                type="button"
                onClick={
                  handleCloseModal
                }
                disabled={
                  saving ||
                  uploadingImage
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                <FaTimes />
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={
                handleSubmit
              }
              className="max-h-[calc(100dvh-120px)] overflow-y-auto p-5 sm:p-7"
            >

              <div className="grid gap-6 lg:grid-cols-2">

                {/* IMAGE */}

                <div className="lg:col-span-2">

                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Certificate Image
                  </label>

                  <div className="overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-950">

                    {imagePreview ? (
                      <div className="relative">

                        <img
                          src={
                            imagePreview
                          }
                          alt="Certificate preview"
                          className="max-h-72 w-full object-contain"
                        />

                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(
                              ''
                            );

                            setFormData(
                              (
                                previous
                              ) => ({
                                ...previous,
                                image:
                                  '',
                              })
                            );
                          }}
                          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600"
                        >
                          <FaTimes />
                        </button>

                      </div>
                    ) : (
                      <div className="flex min-h-48 flex-col items-center justify-center p-6 text-center">

                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-xl text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                          <FaImage />
                        </div>

                        <p className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Upload Certificate Image
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          JPG, PNG or WEBP · Max 5 MB
                        </p>

                      </div>
                    )}

                    <div className="border-t border-gray-200 p-3 dark:border-gray-800">

                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700">

                        {uploadingImage ? (
                          <>
                            <FaSpinner className="animate-spin" />

                            Uploading...
                          </>
                        ) : (
                          <>
                            <FaUpload />

                            {imagePreview
                              ? 'Change Image'
                              : 'Choose Image'}
                          </>
                        )}

                        <input
                          ref={
                            imageInputRef
                          }
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          disabled={
                            uploadingImage ||
                            saving
                          }
                          onChange={
                            handleImageUpload
                          }
                        />

                      </label>

                    </div>

                  </div>

                </div>

                {/* TITLE */}

                <div>

                  <label
                    htmlFor="certificate-title"
                    className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Certificate Title *
                  </label>

                  <input
                    id="certificate-title"
                    name="title"
                    type="text"
                    value={
                      formData.title
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="JavaScript Certification"
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />

                </div>

                {/* ISSUER */}

                <div>

                  <label
                    htmlFor="certificate-issuer"
                    className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Issuing Organization *
                  </label>

                  <input
                    id="certificate-issuer"
                    name="issuer"
                    type="text"
                    value={
                      formData.issuer
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Amity University Online"
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />

                </div>

                {/* ISSUE DATE */}

                <div>

                  <label
                    htmlFor="certificate-date"
                    className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    <FaCalendarAlt className="text-indigo-500" />

                    Issue Date
                  </label>

                  <input
                    id="certificate-date"
                    name="issueDate"
                    type="date"
                    value={
                      formData.issueDate
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />

                </div>

                {/* DISPLAY ORDER */}

                <div>

                  <label
                    htmlFor="certificate-order"
                    className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Display Order
                  </label>

                  <input
                    id="certificate-order"
                    name="displayOrder"
                    type="number"
                    min="0"
                    value={
                      formData.displayOrder
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />

                </div>

                {/* CREDENTIAL URL */}

                <div className="lg:col-span-2">

                  <label
                    htmlFor="certificate-url"
                    className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    <FaLink className="text-indigo-500" />

                    Certificate / Credential URL
                  </label>

                  <input
                    id="certificate-url"
                    name="credentialUrl"
                    type="url"
                    value={
                      formData.credentialUrl
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="https://example.com/certificate"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />

                </div>

                {/* SKILLS */}

                <div className="lg:col-span-2">

                  <label
                    htmlFor="certificate-skills"
                    className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    <FaTags className="text-indigo-500" />

                    Skills / Tags
                  </label>

                  <input
                    id="certificate-skills"
                    name="skills"
                    type="text"
                    value={
                      formData.skills
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="JavaScript, ES6+, DOM, Programming"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Separate multiple skills with commas.
                  </p>

                </div>

                {/* DESCRIPTION */}

                <div className="lg:col-span-2">

                  <label
                    htmlFor="certificate-description"
                    className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Description
                  </label>

                  <textarea
                    id="certificate-description"
                    name="description"
                    rows={5}
                    value={
                      formData.description
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Describe what this certificate represents..."
                    className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                  />

                </div>

                {/* SETTINGS */}

                <div className="grid gap-3 sm:grid-cols-2 lg:col-span-2">

                  {/* Featured */}

                  <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">

                    <input
                      type="checkbox"
                      name="featured"
                      checked={
                        formData.featured
                      }
                      onChange={
                        handleChange
                      }
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />

                    <div>

                      <p className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">

                        <FaStar className="text-amber-500" />

                        Featured Certificate

                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Highlight this certificate.
                      </p>

                    </div>

                  </label>

                  {/* Visible */}

                  <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">

                    <input
                      type="checkbox"
                      name="isVisible"
                      checked={
                        formData.isVisible
                      }
                      onChange={
                        handleChange
                      }
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />

                    <div>

                      <p className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white">

                        {formData.isVisible ? (
                          <FaEye className="text-green-500" />
                        ) : (
                          <FaEyeSlash className="text-red-500" />
                        )}

                        Show on Portfolio

                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Hidden certificates stay in Admin.
                      </p>

                    </div>

                  </label>

                </div>

              </div>

              {/* =================================================
                  MODAL ACTIONS
              ================================================== */}

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end dark:border-gray-800">

                <button
                  type="button"
                  onClick={
                    handleCloseModal
                  }
                  disabled={
                    saving ||
                    uploadingImage
                  }
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    uploadingImage
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin" />

                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />

                      {editingCertificate
                        ? 'Update Certificate'
                        : 'Save Certificate'}
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default CertificateManager;