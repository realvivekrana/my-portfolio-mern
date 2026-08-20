import { useEffect, useState } from 'react';
import {
  FaSave,
  FaUpload,
  FaTrash,
  FaUndo,
  FaUser,
  FaInfoCircle,
  FaBriefcase,
  FaAddressBook,
  FaShareAlt,
  FaSearch,
  FaCog,
  FaImage,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import API from '../../utils/axios';

const defaultProfile = {
  hero: {
    name: '',
    role: '',
    tagline: '',
    profileImage: '',
    availability: '',
    githubUrl: '',
    linkedinUrl: '',
  },

  about: {
    shortDescription: '',
    introduction: '',
    specialization: '',
    careerGoal: '',

    currentRole: {
      role: '',
      company: '',
      duration: '',
      description: '',
    },
  },

  contact: {
    email: '',
    phone: '',
    location: '',
  },

  socialLinks: {
    github: '',
    linkedin: '',
    email: '',
    twitter: '',
    instagram: '',
    youtube: '',
    website: '',
  },

  resume: {
    url: '',
    fileName: '',
    originalName: '',
    uploadedAt: null,
  },

  seo: {
    title: '',
    description: '',
    keywords: [],
    ogImage: '',
  },

  settings: {
    showAvailabilityBadge: true,
    showGithub: true,
    showLinkedin: true,
    showResume: true,
    showAdminAccess: true,
  },
};

/*
|--------------------------------------------------------------------------
| Merge API Data With Default Structure
|--------------------------------------------------------------------------
*/

const mergeProfile = (data = {}) => {
  return {
    ...defaultProfile,
    ...data,

    hero: {
      ...defaultProfile.hero,
      ...(data.hero || {}),
    },

    about: {
      ...defaultProfile.about,
      ...(data.about || {}),

      currentRole: {
        ...defaultProfile.about.currentRole,
        ...(data.about?.currentRole || {}),
      },
    },

    contact: {
      ...defaultProfile.contact,
      ...(data.contact || {}),
    },

    socialLinks: {
      ...defaultProfile.socialLinks,
      ...(data.socialLinks || {}),
    },

    resume: {
      ...defaultProfile.resume,
      ...(data.resume || {}),
    },

    seo: {
      ...defaultProfile.seo,
      ...(data.seo || {}),

      keywords: Array.isArray(data.seo?.keywords)
        ? data.seo.keywords
        : [],
    },

    settings: {
      ...defaultProfile.settings,
      ...(data.settings || {}),
    },
  };
};

/*
|--------------------------------------------------------------------------
| Common Classes
|--------------------------------------------------------------------------
*/

const inputClass =
  'mt-2 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-white';

const labelClass =
  'text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400';

/*
|--------------------------------------------------------------------------
| Input Field
|--------------------------------------------------------------------------
*/

function Field({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  textarea = false,
  rows = 5,
}) {
  const Component = textarea ? 'textarea' : 'input';

  return (
    <label className="block">
      <span className={labelClass}>{label}</span>

      <Component
        type={textarea ? undefined : type}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        rows={textarea ? rows : undefined}
        className={inputClass}
      />
    </label>
  );
}

/*
|--------------------------------------------------------------------------
| Section Card
|--------------------------------------------------------------------------
*/

function SectionCard({
  icon,
  title,
  description,
  children,
  action,
}) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-7">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            {icon}
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
              {title}
            </h3>

            <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Profile Manager
|--------------------------------------------------------------------------
*/

function ProfileManager() {
  const [profile, setProfile] = useState(defaultProfile);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Fetch Profile
  |--------------------------------------------------------------------------
  */

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await API.get('/portfolio');

      const data =
        response.data?.data ||
        response.data ||
        {};

      setProfile(mergeProfile(data));
    } catch (error) {
      console.error('Profile fetch error:', error);

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
  | Initial Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchProfile();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Update Main Section
  |--------------------------------------------------------------------------
  */

  const update = (section, field, value) => {
    setProfile((previous) => ({
      ...previous,

      [section]: {
        ...previous[section],
        [field]: value,
      },
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Update Nested Section
  |--------------------------------------------------------------------------
  */

  const updateNested = (
    section,
    parent,
    field,
    value
  ) => {
    setProfile((previous) => ({
      ...previous,

      [section]: {
        ...previous[section],

        [parent]: {
          ...previous[section][parent],
          [field]: value,
        },
      },
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Clear Section
  |--------------------------------------------------------------------------
  */

  const clearSection = (section) => {
    const confirmed = window.confirm(
      `Clear all ${section} fields?`
    );

    if (!confirmed) return;

    setProfile((previous) => {
      const next = mergeProfile(previous);

      if (section === 'hero') {
        next.hero = {
          name: '',
          role: '',
          tagline: '',
          profileImage: '',
          availability: '',
          githubUrl: '',
          linkedinUrl: '',
        };
      }

      if (section === 'about') {
        next.about = {
          shortDescription: '',
          introduction: '',
          specialization: '',
          careerGoal: '',

          currentRole: {
            role: '',
            company: '',
            duration: '',
            description: '',
          },
        };
      }

      if (section === 'contact') {
        next.contact = {
          email: '',
          phone: '',
          location: '',
        };
      }

      if (section === 'socialLinks') {
        next.socialLinks = {
          github: '',
          linkedin: '',
          email: '',
          twitter: '',
          instagram: '',
          youtube: '',
          website: '',
        };
      }

      if (section === 'seo') {
        next.seo = {
          title: '',
          description: '',
          keywords: [],
          ogImage: '',
        };
      }

      return next;
    });

    toast.info(
      `${section} fields cleared. Click Save to apply changes.`
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Profile Image Upload
  |--------------------------------------------------------------------------
  */

  const handleProfileImageChange = async (event) => {
    const file = event.target.files?.[0];

    event.target.value = '';

    if (!file) return;

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        'Please select JPG, JPEG, PNG or WEBP image.'
      );

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        'Profile image must be 5 MB or smaller.'
      );

      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append(
        'profileImage',
        file
      );

      /*
      |--------------------------------------------------------------------------
      | Existing Portfolio Upload API
      |--------------------------------------------------------------------------
      */

      const response = await API.post(
        '/portfolio/upload/profile-image',
        formData
      );

      const image =
        response.data?.data?.profileImage ||
        response.data?.profileImage ||
        response.data?.data?.hero?.profileImage ||
        '';

      if (!image) {
        throw new Error(
          'Profile image URL was not returned.'
        );
      }

      update(
        'hero',
        'profileImage',
        image
      );

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
          'Failed to upload profile image'
      );
    } finally {
      setUploading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Remove Profile Image
  |--------------------------------------------------------------------------
  */

  const removeProfileImage = async () => {
    if (!profile.hero.profileImage) {
      toast.info(
        'No profile image available.'
      );

      return;
    }

    const confirmed = window.confirm(
      'Remove the current profile image?'
    );

    if (!confirmed) return;

    try {
      setSaving(true);

      const response = await API.put(
        '/portfolio',
        {
          hero: {
            profileImage: '',
          },
        }
      );

      const data =
        response.data?.data ||
        response.data ||
        profile;

      setProfile(
        mergeProfile(data)
      );

      toast.success(
        'Profile image removed.'
      );
    } catch (error) {
      console.error(
        'Profile image delete error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
          'Failed to remove profile image'
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Save All Profile Data
  |--------------------------------------------------------------------------
  */

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        hero: {
          ...profile.hero,
        },

        about: {
          ...profile.about,

          currentRole: {
            ...profile.about.currentRole,
          },
        },

        contact: {
          ...profile.contact,
        },

        socialLinks: {
          ...profile.socialLinks,
        },

        resume: {
          ...profile.resume,
        },

        seo: {
          ...profile.seo,

          keywords: Array.isArray(
            profile.seo.keywords
          )
            ? profile.seo.keywords
            : [],
        },

        settings: {
          ...profile.settings,
        },
      };

      const response = await API.put(
        '/portfolio',
        payload
      );

      const data =
        response.data?.data ||
        response.data ||
        profile;

      setProfile(
        mergeProfile(data)
      );

      toast.success(
        'Profile updated successfully.'
      );
    } catch (error) {
      console.error(
        'Profile save error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
          'Failed to update profile'
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Restore Saved Data
  |--------------------------------------------------------------------------
  */

  const handleResetFromServer = async () => {
    const confirmed = window.confirm(
      'Discard unsaved changes and reload the saved profile?'
    );

    if (!confirmed) return;

    await fetchProfile();

    toast.info(
      'Saved profile restored.'
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Reset Everything To Empty
  |--------------------------------------------------------------------------
  */

  const handleClearAll = () => {
    const confirmed = window.confirm(
      'Clear ALL profile information? This will only clear the form until you click Save.'
    );

    if (!confirmed) return;

    setProfile({
      hero: {
        name: '',
        role: '',
        tagline: '',
        profileImage: '',
        availability: '',
        githubUrl: '',
        linkedinUrl: '',
      },

      about: {
        shortDescription: '',
        introduction: '',
        specialization: '',
        careerGoal: '',

        currentRole: {
          role: '',
          company: '',
          duration: '',
          description: '',
        },
      },

      contact: {
        email: '',
        phone: '',
        location: '',
      },

      socialLinks: {
        github: '',
        linkedin: '',
        email: '',
        twitter: '',
        instagram: '',
        youtube: '',
        website: '',
      },

      resume: {
        url: '',
        fileName: '',
        originalName: '',
        uploadedAt: null,
      },

      seo: {
        title: '',
        description: '',
        keywords: [],
        ogImage: '',
      },

      settings: {
        showAvailabilityBadge: false,
        showGithub: false,
        showLinkedin: false,
        showResume: false,
        showAdminAccess: false,
      },
    });

    toast.info(
      'All fields cleared. Click Save to apply.'
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Keywords
  |--------------------------------------------------------------------------
  */

  const handleKeywordsChange = (
    event
  ) => {
    const keywords = event.target.value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    update(
      'seo',
      'keywords',
      keywords
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Loading UI
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 dark:border-gray-700 dark:border-t-indigo-400" />
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Main UI
  |--------------------------------------------------------------------------
  */

  return (
    <section className="w-full">
      {/* Header */}

      <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            Portfolio CMS
          </p>

          <h2 className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
            Profile Management
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            Yahan se portfolio ka name, role,
            description, contact, social links,
            SEO, visibility aur profile image
            database se manage hoga.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleResetFromServer}
            disabled={
              saving ||
              uploading
            }
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <FaUndo />

            Restore
          </button>

          <button
            type="button"
            onClick={handleClearAll}
            disabled={
              saving ||
              uploading
            }
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
          >
            <FaTrash />

            Clear All
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* =========================================================
            HERO / PROFILE
        ========================================================= */}

        <SectionCard
          icon={<FaUser />}
          title="Profile / Hero"
          description="Portfolio ke main profile information ko manage karo."
          action={
            <button
              type="button"
              onClick={() =>
                clearSection('hero')
              }
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <FaTrash />

              Clear
            </button>
          }
        >
          <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
            {/* Profile Image */}

            <div>
              <span className={labelClass}>
                Profile Image
              </span>

              <div className="mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
                {profile.hero.profileImage ? (
                  <img
                    src={
                      profile.hero.profileImage
                    }
                    alt={
                      profile.hero.name ||
                      'Profile'
                    }
                    className="h-52 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-52 flex-col items-center justify-center text-gray-400">
                    <FaImage className="mb-3 text-4xl" />

                    <span className="text-xs font-semibold">
                      No Image
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700">
                  <FaUpload />

                  {uploading
                    ? 'Uploading...'
                    : 'Upload Image'}

                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={
                      handleProfileImageChange
                    }
                    disabled={uploading}
                    className="hidden"
                  />
                </label>

                {profile.hero.profileImage && (
                  <button
                    type="button"
                    onClick={
                      removeProfileImage
                    }
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100 disabled:opacity-50 dark:bg-red-500/10 dark:text-red-400"
                  >
                    <FaTrash />

                    Remove
                  </button>
                )}
              </div>

              <p className="mt-2 text-xs text-gray-400">
                JPG, PNG, WEBP • Maximum 5 MB
              </p>
            </div>

            {/* Hero Fields */}

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Full Name"
                value={
                  profile.hero.name
                }
                onChange={(e) =>
                  update(
                    'hero',
                    'name',
                    e.target.value
                  )
                }
                placeholder="Vivek Rana"
              />

              <Field
                label="Role"
                value={
                  profile.hero.role
                }
                onChange={(e) =>
                  update(
                    'hero',
                    'role',
                    e.target.value
                  )
                }
                placeholder="MERN Stack Developer"
              />

              <div className="md:col-span-2">
                <Field
                  label="Tagline"
                  value={
                    profile.hero.tagline
                  }
                  onChange={(e) =>
                    update(
                      'hero',
                      'tagline',
                      e.target.value
                    )
                  }
                  placeholder="I build modern web applications..."
                  textarea
                  rows={4}
                />
              </div>

              <Field
                label="Availability"
                value={
                  profile.hero.availability
                }
                onChange={(e) =>
                  update(
                    'hero',
                    'availability',
                    e.target.value
                  )
                }
                placeholder="Open to Work"
              />

              <Field
                label="GitHub URL"
                value={
                  profile.hero.githubUrl
                }
                onChange={(e) =>
                  update(
                    'hero',
                    'githubUrl',
                    e.target.value
                  )
                }
                type="url"
                placeholder="https://github.com/username"
              />

              <Field
                label="LinkedIn URL"
                value={
                  profile.hero.linkedinUrl
                }
                onChange={(e) =>
                  update(
                    'hero',
                    'linkedinUrl',
                    e.target.value
                  )
                }
                type="url"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>
        </SectionCard>

        {/* =========================================================
            ABOUT
        ========================================================= */}

        <SectionCard
          icon={<FaInfoCircle />}
          title="About"
          description="About section ki complete editable information."
          action={
            <button
              type="button"
              onClick={() =>
                clearSection('about')
              }
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <FaTrash />

              Clear
            </button>
          }
        >
          <div className="grid gap-5">
            <Field
              label="Short Description"
              value={
                profile.about
                  .shortDescription
              }
              onChange={(e) =>
                update(
                  'about',
                  'shortDescription',
                  e.target.value
                )
              }
              textarea
            />

            <Field
              label="Introduction"
              value={
                profile.about
                  .introduction
              }
              onChange={(e) =>
                update(
                  'about',
                  'introduction',
                  e.target.value
                )
              }
              textarea
            />

            <Field
              label="Specialization"
              value={
                profile.about
                  .specialization
              }
              onChange={(e) =>
                update(
                  'about',
                  'specialization',
                  e.target.value
                )
              }
              textarea
            />

            <Field
              label="Career Goal"
              value={
                profile.about
                  .careerGoal
              }
              onChange={(e) =>
                update(
                  'about',
                  'careerGoal',
                  e.target.value
                )
              }
              textarea
            />

            {/* Current Role */}

            <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
              <div className="mb-4 flex items-center gap-2 text-sm font-extrabold text-gray-900 dark:text-white">
                <FaBriefcase className="text-indigo-500" />

                Current Role
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Role"
                  value={
                    profile.about
                      .currentRole
                      .role
                  }
                  onChange={(e) =>
                    updateNested(
                      'about',
                      'currentRole',
                      'role',
                      e.target.value
                    )
                  }
                />

                <Field
                  label="Company"
                  value={
                    profile.about
                      .currentRole
                      .company
                  }
                  onChange={(e) =>
                    updateNested(
                      'about',
                      'currentRole',
                      'company',
                      e.target.value
                    )
                  }
                />

                <Field
                  label="Duration"
                  value={
                    profile.about
                      .currentRole
                      .duration
                  }
                  onChange={(e) =>
                    updateNested(
                      'about',
                      'currentRole',
                      'duration',
                      e.target.value
                    )
                  }
                />

                <div className="md:col-span-2">
                  <Field
                    label="Role Description"
                    value={
                      profile.about
                        .currentRole
                        .description
                    }
                    onChange={(e) =>
                      updateNested(
                        'about',
                        'currentRole',
                        'description',
                        e.target.value
                      )
                    }
                    textarea
                  />
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* =========================================================
            CONTACT
        ========================================================= */}

        <SectionCard
          icon={<FaAddressBook />}
          title="Contact Information"
          description="Public contact details manage karo."
          action={
            <button
              type="button"
              onClick={() =>
                clearSection('contact')
              }
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <FaTrash />

              Clear
            </button>
          }
        >
          <div className="grid gap-5 md:grid-cols-3">
            <Field
              label="Email"
              value={
                profile.contact.email
              }
              onChange={(e) =>
                update(
                  'contact',
                  'email',
                  e.target.value
                )
              }
              type="email"
              placeholder="your@email.com"
            />

            <Field
              label="Phone"
              value={
                profile.contact.phone
              }
              onChange={(e) =>
                update(
                  'contact',
                  'phone',
                  e.target.value
                )
              }
              type="tel"
              placeholder="+91 XXXXX XXXXX"
            />

            <Field
              label="Location"
              value={
                profile.contact.location
              }
              onChange={(e) =>
                update(
                  'contact',
                  'location',
                  e.target.value
                )
              }
              placeholder="Pune, India"
            />
          </div>
        </SectionCard>

        {/* =========================================================
            SOCIAL LINKS
        ========================================================= */}

        <SectionCard
          icon={<FaShareAlt />}
          title="Social Links"
          description="Portfolio ke social media links manage karo."
          action={
            <button
              type="button"
              onClick={() =>
                clearSection(
                  'socialLinks'
                )
              }
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <FaTrash />

              Clear
            </button>
          }
        >
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Field
              label="GitHub"
              value={
                profile.socialLinks
                  .github
              }
              onChange={(e) =>
                update(
                  'socialLinks',
                  'github',
                  e.target.value
                )
              }
              type="url"
              placeholder="https://github.com/username"
            />

            <Field
              label="LinkedIn"
              value={
                profile.socialLinks
                  .linkedin
              }
              onChange={(e) =>
                update(
                  'socialLinks',
                  'linkedin',
                  e.target.value
                )
              }
              type="url"
              placeholder="https://linkedin.com/in/username"
            />

            <Field
              label="Email"
              value={
                profile.socialLinks
                  .email
              }
              onChange={(e) =>
                update(
                  'socialLinks',
                  'email',
                  e.target.value
                )
              }
              placeholder="mailto:you@example.com"
            />

            <Field
              label="Twitter / X"
              value={
                profile.socialLinks
                  .twitter
              }
              onChange={(e) =>
                update(
                  'socialLinks',
                  'twitter',
                  e.target.value
                )
              }
              type="url"
            />

            <Field
              label="Instagram"
              value={
                profile.socialLinks
                  .instagram
              }
              onChange={(e) =>
                update(
                  'socialLinks',
                  'instagram',
                  e.target.value
                )
              }
              type="url"
            />

            <Field
              label="YouTube"
              value={
                profile.socialLinks
                  .youtube
              }
              onChange={(e) =>
                update(
                  'socialLinks',
                  'youtube',
                  e.target.value
                )
              }
              type="url"
            />

            <Field
              label="Website"
              value={
                profile.socialLinks
                  .website
              }
              onChange={(e) =>
                update(
                  'socialLinks',
                  'website',
                  e.target.value
                )
              }
              type="url"
            />
          </div>
        </SectionCard>

        {/* =========================================================
            RESUME
        ========================================================= */}

        <SectionCard
          icon={<FaBriefcase />}
          title="Resume"
          description="Resume ki information manage karo."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field
              label="Resume URL"
              value={
                profile.resume.url
              }
              onChange={(e) =>
                update(
                  'resume',
                  'url',
                  e.target.value
                )
              }
              type="url"
              placeholder="/resume.pdf"
            />

            <Field
              label="File Name"
              value={
                profile.resume.fileName
              }
              onChange={(e) =>
                update(
                  'resume',
                  'fileName',
                  e.target.value
                )
              }
              placeholder="Vivek-Rana-Resume.pdf"
            />

            <Field
              label="Original File Name"
              value={
                profile.resume
                  .originalName
              }
              onChange={(e) =>
                update(
                  'resume',
                  'originalName',
                  e.target.value
                )
              }
            />

            <div>
              <span className={labelClass}>
                Resume Status
              </span>

              <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
                {profile.resume.url
                  ? 'Resume configured'
                  : 'No resume configured'}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* =========================================================
            SEO
        ========================================================= */}

        <SectionCard
          icon={<FaSearch />}
          title="SEO"
          description="Search engine title, description, keywords aur OG image."
          action={
            <button
              type="button"
              onClick={() =>
                clearSection('seo')
              }
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <FaTrash />

              Clear
            </button>
          }
        >
          <div className="grid gap-5">
            <Field
              label="SEO Title"
              value={
                profile.seo.title
              }
              onChange={(e) =>
                update(
                  'seo',
                  'title',
                  e.target.value
                )
              }
              placeholder="Vivek Rana | MERN Stack Developer"
            />

            <Field
              label="SEO Description"
              value={
                profile.seo.description
              }
              onChange={(e) =>
                update(
                  'seo',
                  'description',
                  e.target.value
                )
              }
              textarea
            />

            <Field
              label="Keywords"
              value={
                profile.seo.keywords.join(
                  ', '
                )
              }
              onChange={
                handleKeywordsChange
              }
              placeholder="MERN Developer, React Developer, Full Stack Developer"
            />

            <Field
              label="OG Image URL"
              value={
                profile.seo.ogImage
              }
              onChange={(e) =>
                update(
                  'seo',
                  'ogImage',
                  e.target.value
                )
              }
              type="url"
            />
          </div>
        </SectionCard>

        {/* =========================================================
            VISIBILITY SETTINGS
        ========================================================= */}

        <SectionCard
          icon={<FaCog />}
          title="Visibility Settings"
          description="Portfolio par kaunse elements show/hide karne hain."
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [
                'showAvailabilityBadge',
                'Availability Badge',
              ],
              [
                'showGithub',
                'GitHub',
              ],
              [
                'showLinkedin',
                'LinkedIn',
              ],
              [
                'showResume',
                'Resume',
              ],
              [
                'showAdminAccess',
                'Admin Access',
              ],
            ].map(
              ([key, label]) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-950"
                >
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    {label}
                  </span>

                  <input
                    type="checkbox"
                    checked={Boolean(
                      profile.settings[
                        key
                      ]
                    )}
                    onChange={(e) =>
                      update(
                        'settings',
                        key,
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 accent-indigo-600"
                  />
                </label>
              )
            )}
          </div>
        </SectionCard>

        {/* =========================================================
            SAVE BUTTON
        ========================================================= */}

        <div className="sticky bottom-4 z-20 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={
              saving ||
              uploading
            }
            className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaSave />

            {saving
              ? 'Saving...'
              : 'Save All Profile Changes'}
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProfileManager;