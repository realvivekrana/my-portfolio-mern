import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
  FaUserCircle,
  FaCamera,
  FaSave,
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBriefcase,
  FaCircle,
  FaTrash,
  FaSyncAlt,
} from 'react-icons/fa';

import API from '../../api/axios';

function ProfileManager() {
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [profile, setProfile] = useState({
    name: '',
    role: '',
    tagline: '',
    shortDescription: '',
    profileImage: '',
    availability: '',
    githubUrl: '',
    linkedinUrl: '',
    email: '',
    phone: '',
    location: '',
  });

  /*
  |--------------------------------------------------------------------------
  | Fetch Portfolio Profile
  |--------------------------------------------------------------------------
  */

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response =
        await API.get('/portfolio');

      const data = response.data?.data;

      if (!data) {
        return;
      }

      setProfile({
        name: data.hero?.name || '',
        role: data.hero?.role || '',
        tagline: data.hero?.tagline || '',
        shortDescription:
          data.about?.shortDescription || '',
        profileImage:
          data.hero?.profileImage || '',
        availability:
          data.hero?.availability || '',
        githubUrl:
          data.hero?.githubUrl || '',
        linkedinUrl:
          data.hero?.linkedinUrl || '',
        email:
          data.contact?.email || '',
        phone:
          data.contact?.phone || '',
        location:
          data.contact?.location || '',
      });
    } catch (error) {
      console.error(
        'Fetch profile error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
          'Failed to load profile'
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Load Profile
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchProfile();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Handle Input
  |--------------------------------------------------------------------------
  */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Upload Profile Image
  |--------------------------------------------------------------------------
  */

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    /*
    |----------------------------------------------------------------------
    | Validate Image Type
    |----------------------------------------------------------------------
    */

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        'Only JPG, PNG and WEBP images are allowed.'
      );

      e.target.value = '';

      return;
    }

    /*
    |----------------------------------------------------------------------
    | Validate Image Size
    |----------------------------------------------------------------------
    */

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        'Profile image must be smaller than 5 MB.'
      );

      e.target.value = '';

      return;
    }

    try {
      setUploadingImage(true);

      const formData = new FormData();

      formData.append(
        'profileImage',
        file
      );

      /*
      |----------------------------------------------------------------------
      | Existing backend upload route
      |----------------------------------------------------------------------
      */

      const response =
        await API.post(
          '/portfolio/upload/profile-image',
          formData,
          {
            headers: {
              'Content-Type':
                'multipart/form-data',
            },
          }
        );

      const imageUrl =
        response.data?.data?.profileImage;

      if (imageUrl) {
        setProfile((previous) => ({
          ...previous,
          profileImage: imageUrl,
        }));
      }

      toast.success(
        'Profile image uploaded successfully.'
      );
    } catch (error) {
      console.error(
        'Profile image upload error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
          'Failed to upload profile image.'
      );
    } finally {
      setUploadingImage(false);

      e.target.value = '';
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Save Profile
  |--------------------------------------------------------------------------
  */

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!profile.name.trim()) {
      toast.error('Please enter your name.');
      return;
    }

    if (!profile.role.trim()) {
      toast.error('Please enter your role.');
      return;
    }

    try {
      setSaving(true);

      const payload = {
        hero: {
          name: profile.name,
          role: profile.role,
          tagline: profile.tagline,
          profileImage:
            profile.profileImage,
          availability:
            profile.availability,
          githubUrl:
            profile.githubUrl,
          linkedinUrl:
            profile.linkedinUrl,
        },

        about: {
          shortDescription:
            profile.shortDescription,
        },

        contact: {
          email: profile.email,
          phone: profile.phone,
          location:
            profile.location,
        },
      };

      await API.put(
        '/portfolio',
        payload
      );

      toast.success(
        'Profile updated successfully!'
      );

      await fetchProfile();
    } catch (error) {
      console.error(
        'Save profile error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
          'Failed to update profile.'
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Remove Profile Image
  |--------------------------------------------------------------------------
  |
  | Yahan database se image URL remove kar rahe hain.
  | Existing physical file delete backend ke existing
  | upload replacement flow par depend karega.
  |
  |--------------------------------------------------------------------------
  */

  const handleRemoveImage = async () => {
    if (!profile.profileImage) {
      return;
    }

    const confirmed =
      window.confirm(
        'Are you sure you want to remove the profile image?'
      );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      await API.put(
        '/portfolio',
        {
          hero: {
            profileImage: '',
          },
        }
      );

      setProfile((previous) => ({
        ...previous,
        profileImage: '',
      }));

      toast.success(
        'Profile image removed.'
      );
    } catch (error) {
      console.error(
        'Remove profile image error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
          'Failed to remove profile image.'
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-8">
      {/* =========================================================
          HEADER
      ========================================================= */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Portfolio Management
          </p>

          <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Profile
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            Manage your public portfolio profile,
            contact information and social links.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchProfile}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-indigo-500/40 dark:hover:text-indigo-400"
        >
          <FaSyncAlt />
          Refresh
        </button>
      </div>

      {/* =========================================================
          PROFILE FORM
      ========================================================= */}

      <form
        onSubmit={handleSaveProfile}
        className="space-y-8"
      >
        {/* =======================================================
            PROFILE PHOTO
        ======================================================== */}

        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-200 p-6 dark:border-gray-800">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
              Profile Photo
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              This image will be displayed on your
              public portfolio.
            </p>
          </div>

          <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
            {/* Image */}

            <div className="relative">
              <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-3xl border-4 border-gray-100 bg-gray-100 shadow-lg dark:border-gray-800 dark:bg-gray-950">
                {profile.profileImage ? (
                  <img
                    src={
                      profile.profileImage
                    }
                    alt={
                      profile.name ||
                      'Profile'
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-7xl text-gray-300 dark:text-gray-700" />
                )}
              </div>

              {uploadingImage && (
                <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-black/60">
                  <div className="h-8 w-8 animate-spin rounded-full border-3 border-white/30 border-t-white" />
                </div>
              )}
            </div>

            {/* Actions */}

            <div className="space-y-3">
              <div className="flex flex-wrap gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={
                    handleImageUpload
                  }
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  disabled={
                    uploadingImage ||
                    saving
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FaCamera />
                  {uploadingImage
                    ? 'Uploading...'
                    : 'Change Photo'}
                </button>

                {profile.profileImage && (
                  <button
                    type="button"
                    onClick={
                      handleRemoveImage
                    }
                    disabled={
                      saving ||
                      uploadingImage
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-400 dark:hover:bg-red-500/10"
                  >
                    <FaTrash />
                    Remove
                  </button>
                )}
              </div>

              <p className="text-xs leading-5 text-gray-400 dark:text-gray-500">
                JPG, PNG or WEBP. Maximum file size:
                5 MB.
              </p>
            </div>
          </div>
        </section>

        {/* =======================================================
            BASIC INFORMATION
        ======================================================== */}

        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-7">
          <div className="mb-6">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
              Basic Information
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Information displayed in the hero section
              of your portfolio.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Name */}

            <div>
              <label
                htmlFor="profile-name"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Full Name
              </label>

              <input
                id="profile-name"
                name="name"
                type="text"
                value={profile.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            </div>

            {/* Role */}

            <div>
              <label
                htmlFor="profile-role"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Role / Designation
              </label>

              <div className="relative">
                <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  id="profile-role"
                  name="role"
                  type="text"
                  value={profile.role}
                  onChange={handleChange}
                  placeholder="MERN Full Stack Developer"
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                />
              </div>
            </div>

            {/* Tagline */}

            <div className="md:col-span-2">
              <label
                htmlFor="profile-tagline"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Tagline
              </label>

              <input
                id="profile-tagline"
                name="tagline"
                type="text"
                value={profile.tagline}
                onChange={handleChange}
                placeholder="Building modern web experiences..."
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            </div>

            {/* Short Description */}

            <div className="md:col-span-2">
              <label
                htmlFor="profile-description"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Short Description
              </label>

              <textarea
                id="profile-description"
                name="shortDescription"
                value={
                  profile.shortDescription
                }
                onChange={handleChange}
                rows={5}
                placeholder="Write a short introduction about yourself..."
                className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            </div>

            {/* Availability */}

            <div>
              <label
                htmlFor="profile-availability"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Availability
              </label>

              <div className="relative">
                <FaCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-green-500" />

                <input
                  id="profile-availability"
                  name="availability"
                  type="text"
                  value={
                    profile.availability
                  }
                  onChange={handleChange}
                  placeholder="Available for opportunities"
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                />
              </div>
            </div>

            {/* Location */}

            <div>
              <label
                htmlFor="profile-location"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Location
              </label>

              <div className="relative">
                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  id="profile-location"
                  name="location"
                  type="text"
                  value={profile.location}
                  onChange={handleChange}
                  placeholder="Pune, India"
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =======================================================
            CONTACT INFORMATION
        ======================================================== */}

        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-7">
          <div className="mb-6">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
              Contact Information
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Contact details shown on your portfolio.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Email */}

            <div>
              <label
                htmlFor="profile-email"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Email
              </label>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  id="profile-email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                />
              </div>
            </div>

            {/* Phone */}

            <div>
              <label
                htmlFor="profile-phone"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Phone
              </label>

              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  id="profile-phone"
                  name="phone"
                  type="text"
                  value={profile.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =======================================================
            SOCIAL LINKS
        ======================================================== */}

        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-7">
          <div className="mb-6">
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
              Social Links
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add the social profiles visitors can access
              from your portfolio.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* GitHub */}

            <div>
              <label
                htmlFor="profile-github"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                GitHub URL
              </label>

              <div className="relative">
                <FaGithub className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

                <input
                  id="profile-github"
                  name="githubUrl"
                  type="url"
                  value={
                    profile.githubUrl
                  }
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                />
              </div>
            </div>

            {/* LinkedIn */}

            <div>
              <label
                htmlFor="profile-linkedin"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                LinkedIn URL
              </label>

              <div className="relative">
                <FaLinkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />

                <input
                  id="profile-linkedin"
                  name="linkedinUrl"
                  type="url"
                  value={
                    profile.linkedinUrl
                  }
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =======================================================
            SAVE BUTTON
        ======================================================== */}

        <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 dark:border-gray-800 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={fetchProfile}
            disabled={
              saving ||
              uploadingImage
            }
            className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-all duration-300 hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Reset Changes
          </button>

          <button
            type="submit"
            disabled={
              saving ||
              uploadingImage
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving Profile...
              </>
            ) : (
              <>
                <FaSave />
                Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfileManager;