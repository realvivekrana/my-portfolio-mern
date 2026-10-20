import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  FaSave,
  FaUndo,
  FaPlus,
  FaTrash,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';

import { toast } from 'react-toastify';

import API from '../../utils/axios';
import translations from '../../i18n/translations';

/*
|--------------------------------------------------------------------------
| PageContentManager
|--------------------------------------------------------------------------
| Admin Dashboard ke 4 naye sections (Home, About, Skills, Contact) ek hi
| component se chalte hain: <PageContentManager page="about" />
|
| Save flow:
|   text fields   -> PUT /portfolio/page-content/:page
|   Home sections -> PUT /portfolio/site-content   { sections }
|   About lists   -> PUT /portfolio/site-content   { stats, expertise, strengths }
|   Skills        -> PUT /portfolio                { skills }
|   Contact info  -> PUT /portfolio/contact        { email, phone, location }
|
| Text khali chhodne par public site apna default (translated) text dikhati
| hai, isliye Hindi/English toggle kabhi nahi tootta.
|--------------------------------------------------------------------------
*/

const en = translations.en;

const PAGES = {
  home: {
    title: 'Home Page',
    description:
      'Hero (top banner) ke texts, tech bubbles aur poori site ke sections on/off yahan se control hote hain.',
    fields: [
      { key: 'greeting', label: 'Greeting line', placeholder: "Hello, I'm", max: 60 },
      { key: 'viewWorkLabel', label: 'Primary button text', placeholder: 'View My Work', max: 40 },
      { key: 'resumeLabel', label: 'Resume button text', placeholder: 'Download Resume', max: 40 },
      { key: 'currentlyLabel', label: 'Availability card — small label', placeholder: 'Currently', max: 40 },
      { key: 'availabilityText', label: 'Availability card — text', placeholder: 'Available for opportunities', max: 80 },
    ],
  },
  about: {
    title: 'About Page',
    description: 'About section ka heading, intro text, stats, expertise cards aur strengths.',
    fields: [
      { key: 'eyebrow', label: 'Small heading (eyebrow)', placeholder: en.about.eyebrow, max: 60 },
      { key: 'heading', label: 'Heading', placeholder: en.about.heading, max: 60 },
      { key: 'headingHighlight', label: 'Heading highlight (coloured word)', placeholder: en.about.headingHighlight, max: 60 },
      { key: 'subtitle', label: 'Intro paragraph', placeholder: en.about.subtitle, max: 500, multiline: true },
    ],
  },
  skills: {
    title: 'Skills Page',
    description: 'Skills section ke texts, categories aur har skill ka show/hide, order aur level.',
    fields: [
      { key: 'eyebrow', label: 'Small heading (eyebrow)', placeholder: en.skills.eyebrow, max: 60 },
      { key: 'heading', label: 'Heading', placeholder: en.skills.heading, max: 60 },
      { key: 'headingHighlight', label: 'Heading highlight (coloured word)', placeholder: en.skills.headingHighlight, max: 60 },
      {
        key: 'subtitle',
        label: 'Sub text',
        placeholder:
          'A collection of technologies and tools I use to build modern, responsive and scalable web applications.',
        max: 400,
        multiline: true,
      },
    ],
  },
  contact: {
    title: 'Contact Page',
    description: 'Contact section ke texts aur contact details (email, phone, location).',
    fields: [
      { key: 'eyebrow', label: 'Small heading (eyebrow)', placeholder: en.contact.eyebrow, max: 60 },
      { key: 'heading', label: 'Heading', placeholder: en.contact.heading, max: 60 },
      { key: 'headingHighlight', label: 'Heading highlight (coloured word)', placeholder: en.contact.headingHighlight, max: 60 },
      { key: 'subtitle', label: 'Sub text', placeholder: en.contact.subtitle, max: 400, multiline: true },
    ],
  },
};

const SECTION_TOGGLES = [
  ['about', 'About'],
  ['skills', 'Skills'],
  ['experience', 'Experience'],
  ['education', 'Education'],
  ['certifications', 'Certifications'],
  ['timeline', 'Timeline'],
  ['projects', 'Projects'],
  ['githubStats', 'GitHub Stats'],
  ['testimonials', 'Testimonials'],
  ['blog', 'Blog'],
  ['contact', 'Contact'],
  ['chatbot', 'AI Chatbot'],
];

const EXPERTISE_ICONS = ['code', 'lightbulb', 'rocket', 'briefcase', 'graduation'];

const SKILL_ICONS = [
  'html', 'css', 'javascript', 'react', 'tailwind', 'bootstrap', 'node',
  'express', 'mongodb', 'mysql', 'git', 'github', 'postman', 'server',
  'database', 'tools', 'code',
];

const CATEGORY_ICONS = ['code', 'server', 'database', 'tools'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const LIMITS = { stats: 8, expertise: 8, strengths: 20, bubbles: 6 };

const inputClass =
  'w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white';

const cardClass =
  'rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6 dark:border-white/10 dark:bg-white/[0.03]';

const iconButtonClass =
  'rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 disabled:opacity-30 dark:text-gray-400 dark:hover:bg-white/10';

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const bySort = (a, b) => Number(a?.displayOrder || 0) - Number(b?.displayOrder || 0);

const moveItem = (list, index, direction) => {
  const target = index + direction;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
};

const buildForm = (page, portfolio = {}) => {
  const config = PAGES[page];
  const saved = portfolio?.pageContent?.[page] || {};
  const site = portfolio?.siteContent || {};

  const text = {};
  config.fields.forEach((field) => {
    text[field.key] = typeof saved[field.key] === 'string' ? saved[field.key] : '';
  });

  const form = { text };

  if (page === 'home') {
    form.techBubbles = Array.isArray(saved.techBubbles) ? [...saved.techBubbles] : [];
    form.sections = {};
    SECTION_TOGGLES.forEach(([key]) => {
      form.sections[key] = site.sections?.[key] !== false;
    });
  }

  if (page === 'about') {
    form.stats = [...(site.stats || [])].sort(bySort).map((s) => ({ value: s.value || '', label: s.label || '' }));
    form.expertise = [...(site.expertise || [])].sort(bySort).map((e) => ({
      icon: e.icon || 'code',
      title: e.title || '',
      description: e.description || '',
    }));
    form.strengths = [...(site.strengths || [])];
  }

  if (page === 'skills') {
    form.skills = [...(portfolio?.skills || [])].sort(bySort).map((category) => ({
      title: category.title || '',
      description: category.description || '',
      icon: category.icon || 'code',
      isVisible: category.isVisible !== false,
      skills: [...(category.skills || [])].sort(bySort).map((skill) => ({
        name: skill.name || '',
        icon: skill.icon || 'code',
        level: skill.level || 'Intermediate',
        progress: Number.isFinite(Number(skill.progress)) ? Number(skill.progress) : 70,
        isVisible: skill.isVisible !== false,
      })),
    }));
  }

  if (page === 'contact') {
    form.contact = {
      email: portfolio?.contact?.email || '',
      phone: portfolio?.contact?.phone || '',
      location: portfolio?.contact?.location || '',
    };
  }

  return form;
};

// Save se pehle validation. Pehli galti ka message return hota hai, sab theek ho to null.
const validateForm = (page, form) => {
  const config = PAGES[page];

  for (const field of config.fields) {
    if ((form.text[field.key] || '').trim().length > field.max) {
      return `"${field.label}" me max ${field.max} characters allowed hain.`;
    }
  }

  if (page === 'home' && form.techBubbles.length > LIMITS.bubbles) {
    return `Tech bubbles max ${LIMITS.bubbles} ho sakte hain.`;
  }

  if (page === 'about') {
    if (form.stats.some((s) => (s.value.trim() === '') !== (s.label.trim() === ''))) {
      return 'Har stat me value aur label dono bharein (ya poori row delete karein).';
    }
    if (form.expertise.some((e) => !e.title.trim())) {
      return 'Har expertise card ka title zaroori hai.';
    }
  }

  if (page === 'skills') {
    for (const category of form.skills) {
      if (!category.title.trim()) return 'Har category ka title zaroori hai.';
      if (category.skills.some((s) => !s.name.trim())) {
        return `"${category.title}" me kisi skill ka naam khali hai.`;
      }
      if (category.skills.some((s) => s.progress < 0 || s.progress > 100)) {
        return `"${category.title}" me progress 0 se 100 ke beech honi chahiye.`;
      }
    }
  }

  if (page === 'contact') {
    const email = form.contact.email.trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Valid email address daalein.';
    }
  }

  return null;
};

/*
|--------------------------------------------------------------------------
| Small UI pieces
|--------------------------------------------------------------------------
*/

function Card({ title, hint, children, action }) {
  return (
    <div className={cardClass}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
          {hint && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{hint}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
        checked
          ? 'border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-400/30 dark:bg-indigo-500/10 dark:text-indigo-200'
          : 'border-gray-200 bg-gray-50 text-gray-500 dark:border-white/10 dark:bg-white/5 dark:text-gray-400'
      }`}
    >
      <span>{label}</span>
      <span className="text-xs">{checked ? 'ON' : 'OFF'}</span>
    </button>
  );
}

function AddButton({ onClick, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-xl border border-dashed border-indigo-400 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40 dark:text-indigo-300 dark:hover:bg-indigo-500/10"
    >
      <FaPlus className="text-xs" />
      {children}
    </button>
  );
}

/*
|--------------------------------------------------------------------------
| Main component
|--------------------------------------------------------------------------
*/

function PageContentManager({ page, onDirtyChange }) {
  const config = PAGES[page];

  const [form, setForm] = useState(() => buildForm(page));
  const [baseline, setBaseline] = useState(() => JSON.stringify(buildForm(page)));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bubbleDraft, setBubbleDraft] = useState('');

  const isDirty = useMemo(() => JSON.stringify(form) !== baseline, [form, baseline]);

  /* ---------- load ---------- */

  const load = useCallback(async () => {
    try {
      const response = await API.get('/portfolio');
      const portfolio = response?.data?.data || response?.data || {};
      const next = buildForm(page, portfolio);
      setForm(next);
      setBaseline(JSON.stringify(next));
    } catch (error) {
      console.error('Page content load error:', error);
      toast.error('Content load nahi ho paaya. Page refresh karke dobara try karein.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);

  /* ---------- unsaved changes warning ---------- */

  useEffect(() => {
    if (onDirtyChange) onDirtyChange(isDirty);
    return () => {
      if (onDirtyChange) onDirtyChange(false);
    };
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    if (!isDirty) return undefined;
    const handler = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  /* ---------- form updaters ---------- */

  const setText = (key, value) =>
    setForm((prev) => ({ ...prev, text: { ...prev.text, [key]: value } }));

  const setListItem = (listKey, index, patch) =>
    setForm((prev) => ({
      ...prev,
      [listKey]: prev[listKey].map((item, i) => (i === index ? { ...item, ...patch } : item)),
    }));

  const removeListItem = (listKey, index) =>
    setForm((prev) => ({ ...prev, [listKey]: prev[listKey].filter((_, i) => i !== index) }));

  const moveListItem = (listKey, index, direction) =>
    setForm((prev) => ({ ...prev, [listKey]: moveItem(prev[listKey], index, direction) }));

  const setSkill = (categoryIndex, skillIndex, patch) =>
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.map((category, ci) =>
        ci !== categoryIndex
          ? category
          : {
              ...category,
              skills: category.skills.map((skill, si) =>
                si === skillIndex ? { ...skill, ...patch } : skill
              ),
            }
      ),
    }));

  const updateCategorySkills = (categoryIndex, updater) =>
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.map((category, ci) =>
        ci === categoryIndex ? { ...category, skills: updater(category.skills) } : category
      ),
    }));

  const addBubble = () => {
    const name = bubbleDraft.trim();
    if (!name) return;
    if (form.techBubbles.length >= LIMITS.bubbles) {
      toast.warn(`Max ${LIMITS.bubbles} bubbles allowed hain.`);
      return;
    }
    if (form.techBubbles.some((item) => item.toLowerCase() === name.toLowerCase())) {
      toast.info('Ye bubble pehle se hai.');
      return;
    }
    setForm((prev) => ({ ...prev, techBubbles: [...prev.techBubbles, name.slice(0, 30)] }));
    setBubbleDraft('');
  };

  /* ---------- save ---------- */

  const handleSave = async () => {
    const problem = validateForm(page, form);
    if (problem) {
      toast.error(problem);
      return;
    }

    try {
      setSaving(true);

      // Saari requests ek ke baad ek — same document par parallel save se version conflict aa sakta hai.
      const textPayload = {};
      config.fields.forEach((field) => {
        textPayload[field.key] = (form.text[field.key] || '').trim();
      });
      if (page === 'home') textPayload.techBubbles = form.techBubbles;

      await API.put(`/portfolio/page-content/${page}`, textPayload);

      if (page === 'home') {
        await API.put('/portfolio/site-content', { sections: form.sections });
      }

      if (page === 'about') {
        await API.put('/portfolio/site-content', {
          stats: form.stats.filter((s) => s.value.trim() && s.label.trim()),
          expertise: form.expertise,
          strengths: form.strengths.map((s) => s.trim()).filter(Boolean),
        });
      }

      if (page === 'skills') {
        await API.put('/portfolio', {
          skills: form.skills.map((category, ci) => ({
            ...category,
            displayOrder: ci,
            skills: category.skills.map((skill, si) => ({
              ...skill,
              progress: Math.min(100, Math.max(0, Number(skill.progress) || 0)),
              displayOrder: si,
            })),
          })),
        });
      }

      if (page === 'contact') {
        await API.put('/portfolio/contact', {
          email: form.contact.email.trim(),
          phone: form.contact.phone.trim(),
          location: form.contact.location.trim(),
        });
      }

      await load();
      toast.success(`${config.title} save ho gaya.`);
    } catch (error) {
      console.error('Page content save error:', error);
      toast.error(error?.response?.data?.message || 'Save nahi ho paaya. Dobara try karein.');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    if (!isDirty) return;
    if (window.confirm('Saare unsaved changes hata dein?')) {
      setForm(JSON.parse(baseline));
    }
  };

  /* ---------- render ---------- */

  if (loading) {
    return <p className="p-6 text-sm text-gray-500 dark:text-gray-400">Loading {config.title}…</p>;
  }

  return (
    <section className="space-y-6">
      {/* Header + actions */}
      <div className="sticky top-0 z-20 -mx-1 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-[#0b0b12]/95">
        <div className="min-w-0">
          <h2 className="text-xl font-extrabold text-gray-900 sm:text-2xl dark:text-white">
            {config.title}
          </h2>
          <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">{config.description}</p>
        </div>

        <div className="flex items-center gap-2">
          {isDirty && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
              Unsaved changes
            </span>
          )}
          <button
            type="button"
            onClick={handleDiscard}
            disabled={!isDirty || saving}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:opacity-40 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/10"
          >
            <FaUndo className="text-xs" /> Discard
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || saving}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow transition hover:bg-indigo-700 disabled:opacity-40"
          >
            <FaSave className="text-xs" /> {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {/* Text fields */}
      <Card
        title="Texts"
        hint="Khali chhodne par site apna default text dikhayegi (grey placeholder wala). Yahan likha text English aur Hindi dono me dikhega."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {config.fields.map((field) => (
            <label
              key={field.key}
              className={`block ${field.multiline ? 'md:col-span-2' : ''}`}
            >
              <span className="mb-1.5 flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-200">
                {field.label}
                <span className="text-xs font-normal text-gray-400">
                  {(form.text[field.key] || '').length}/{field.max}
                </span>
              </span>
              {field.multiline ? (
                <textarea
                  rows={3}
                  value={form.text[field.key]}
                  maxLength={field.max}
                  placeholder={field.placeholder}
                  onChange={(e) => setText(field.key, e.target.value)}
                  className={inputClass}
                />
              ) : (
                <input
                  type="text"
                  value={form.text[field.key]}
                  maxLength={field.max}
                  placeholder={field.placeholder}
                  onChange={(e) => setText(field.key, e.target.value)}
                  className={inputClass}
                />
              )}
            </label>
          ))}
        </div>
      </Card>

      {/* HOME: tech bubbles + section toggles */}
      {page === 'home' && (
        <>
          <Card
            title="Hero tech bubbles"
            hint={`Photo ke aas-paas ghoomne wale bubbles (max ${LIMITS.bubbles}). Khali ho to default 6 dikhte hain. React, Node.js, Express, MongoDB, JavaScript, Tailwind ko brand icon milta hai, baaki ko generic icon.`}
          >
            <div className="mb-3 flex flex-wrap gap-2">
              {form.techBubbles.length === 0 && (
                <span className="text-sm text-gray-400">Default bubbles dikh rahe hain.</span>
              )}
              {form.techBubbles.map((name, index) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200"
                >
                  {name}
                  <button
                    type="button"
                    aria-label={`Remove ${name}`}
                    onClick={() => removeListItem('techBubbles', index)}
                    className="text-indigo-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                value={bubbleDraft}
                maxLength={30}
                placeholder="e.g. React"
                onChange={(e) => setBubbleDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addBubble();
                  }
                }}
                className={`${inputClass} max-w-xs`}
              />
              <AddButton onClick={addBubble} disabled={form.techBubbles.length >= LIMITS.bubbles}>
                Add bubble
              </AddButton>
            </div>
          </Card>

          <Card
            title="Site sections on / off"
            hint="OFF karne par wo section public site aur navbar dono se chhup jata hai."
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SECTION_TOGGLES.map(([key, label]) => (
                <Toggle
                  key={key}
                  label={label}
                  checked={form.sections[key]}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, sections: { ...prev.sections, [key]: value } }))
                  }
                />
              ))}
            </div>
          </Card>
        </>
      )}

      {/* ABOUT: stats / expertise / strengths */}
      {page === 'about' && (
        <>
          <Card
            title="Quick stats"
            hint={`Max ${LIMITS.stats}. Khali chhodne par default stats dikhte hain.`}
            action={
              <AddButton
                disabled={form.stats.length >= LIMITS.stats}
                onClick={() =>
                  setForm((prev) => ({ ...prev, stats: [...prev.stats, { value: '', label: '' }] }))
                }
              >
                Add stat
              </AddButton>
            }
          >
            <div className="space-y-3">
              {form.stats.map((stat, index) => (
                <div key={index} className="flex flex-wrap items-center gap-2">
                  <input
                    className={`${inputClass} w-28 sm:w-32`}
                    placeholder="10+"
                    maxLength={30}
                    value={stat.value}
                    onChange={(e) => setListItem('stats', index, { value: e.target.value })}
                  />
                  <input
                    className={`${inputClass} min-w-0 flex-1`}
                    placeholder="Projects Built"
                    maxLength={60}
                    value={stat.label}
                    onChange={(e) => setListItem('stats', index, { label: e.target.value })}
                  />
                  <button type="button" className={iconButtonClass} disabled={index === 0} aria-label="Move up" onClick={() => moveListItem('stats', index, -1)}><FaArrowUp /></button>
                  <button type="button" className={iconButtonClass} disabled={index === form.stats.length - 1} aria-label="Move down" onClick={() => moveListItem('stats', index, 1)}><FaArrowDown /></button>
                  <button type="button" className={`${iconButtonClass} text-red-500`} aria-label="Delete stat" onClick={() => removeListItem('stats', index)}><FaTrash /></button>
                </div>
              ))}
            </div>
          </Card>

          <Card
            title="Expertise cards"
            hint={`Max ${LIMITS.expertise}. Khali chhodne par default cards dikhte hain.`}
            action={
              <AddButton
                disabled={form.expertise.length >= LIMITS.expertise}
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    expertise: [...prev.expertise, { icon: 'code', title: '', description: '' }],
                  }))
                }
              >
                Add card
              </AddButton>
            }
          >
            <div className="space-y-4">
              {form.expertise.map((item, index) => (
                <div key={index} className="rounded-xl border border-gray-200 p-3 sm:p-4 dark:border-white/10">
                  <div className="grid gap-3 sm:grid-cols-[10rem_1fr]">
                    <select
                      className={inputClass}
                      value={item.icon}
                      onChange={(e) => setListItem('expertise', index, { icon: e.target.value })}
                    >
                      {EXPERTISE_ICONS.map((icon) => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                    <input
                      className={inputClass}
                      placeholder="Title"
                      maxLength={100}
                      value={item.title}
                      onChange={(e) => setListItem('expertise', index, { title: e.target.value })}
                    />
                  </div>
                  <textarea
                    rows={2}
                    className={`${inputClass} mt-3`}
                    placeholder="Description"
                    maxLength={400}
                    value={item.description}
                    onChange={(e) => setListItem('expertise', index, { description: e.target.value })}
                  />
                  <div className="mt-2 flex justify-end gap-1">
                    <button type="button" className={iconButtonClass} disabled={index === 0} aria-label="Move up" onClick={() => moveListItem('expertise', index, -1)}><FaArrowUp /></button>
                    <button type="button" className={iconButtonClass} disabled={index === form.expertise.length - 1} aria-label="Move down" onClick={() => moveListItem('expertise', index, 1)}><FaArrowDown /></button>
                    <button type="button" className={`${iconButtonClass} text-red-500`} aria-label="Delete card" onClick={() => removeListItem('expertise', index)}><FaTrash /></button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card
            title="Strengths"
            hint={`Max ${LIMITS.strengths} (check-list wale points).`}
            action={
              <AddButton
                disabled={form.strengths.length >= LIMITS.strengths}
                onClick={() => setForm((prev) => ({ ...prev, strengths: [...prev.strengths, ''] }))}
              >
                Add strength
              </AddButton>
            }
          >
            <div className="space-y-3">
              {form.strengths.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    className={`${inputClass} min-w-0 flex-1`}
                    maxLength={100}
                    value={item}
                    placeholder="e.g. REST API Integration"
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        strengths: prev.strengths.map((s, i) => (i === index ? e.target.value : s)),
                      }))
                    }
                  />
                  <button type="button" className={iconButtonClass} disabled={index === 0} aria-label="Move up" onClick={() => moveListItem('strengths', index, -1)}><FaArrowUp /></button>
                  <button type="button" className={iconButtonClass} disabled={index === form.strengths.length - 1} aria-label="Move down" onClick={() => moveListItem('strengths', index, 1)}><FaArrowDown /></button>
                  <button type="button" className={`${iconButtonClass} text-red-500`} aria-label="Delete strength" onClick={() => removeListItem('strengths', index)}><FaTrash /></button>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}

      {/* SKILLS: categories + skills */}
      {page === 'skills' && (
        <Card
          title="Categories & skills"
          hint="Aankh wale button se category ya skill public site se chhup jati hai (delete nahi hoti)."
          action={
            <AddButton
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  skills: [
                    ...prev.skills,
                    { title: '', description: '', icon: 'code', isVisible: true, skills: [] },
                  ],
                }))
              }
            >
              Add category
            </AddButton>
          }
        >
          <div className="space-y-5">
            {form.skills.length === 0 && (
              <p className="text-sm text-gray-400">
                Koi category nahi hai — site default skills dikhayegi. Category add karke shuru karein.
              </p>
            )}

            {form.skills.map((category, ci) => (
              <div
                key={ci}
                className={`rounded-2xl border p-3 sm:p-5 ${
                  category.isVisible
                    ? 'border-gray-200 dark:border-white/10'
                    : 'border-dashed border-gray-300 opacity-70 dark:border-white/20'
                }`}
              >
                <div className="grid gap-3 sm:grid-cols-[9rem_1fr]">
                  <select
                    className={inputClass}
                    value={category.icon}
                    onChange={(e) => setListItem('skills', ci, { icon: e.target.value })}
                  >
                    {CATEGORY_ICONS.map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                  <input
                    className={inputClass}
                    placeholder="Category title (e.g. Frontend)"
                    maxLength={60}
                    value={category.title}
                    onChange={(e) => setListItem('skills', ci, { title: e.target.value })}
                  />
                </div>
                <input
                  className={`${inputClass} mt-3`}
                  placeholder="Category description"
                  maxLength={200}
                  value={category.description}
                  onChange={(e) => setListItem('skills', ci, { description: e.target.value })}
                />

                <div className="mt-2 flex justify-end gap-1">
                  <button type="button" className={iconButtonClass} aria-label={category.isVisible ? 'Hide category' : 'Show category'} onClick={() => setListItem('skills', ci, { isVisible: !category.isVisible })}>
                    {category.isVisible ? <FaEye /> : <FaEyeSlash />}
                  </button>
                  <button type="button" className={iconButtonClass} disabled={ci === 0} aria-label="Move category up" onClick={() => moveListItem('skills', ci, -1)}><FaArrowUp /></button>
                  <button type="button" className={iconButtonClass} disabled={ci === form.skills.length - 1} aria-label="Move category down" onClick={() => moveListItem('skills', ci, 1)}><FaArrowDown /></button>
                  <button
                    type="button"
                    className={`${iconButtonClass} text-red-500`}
                    aria-label="Delete category"
                    onClick={() => {
                      if (window.confirm(`"${category.title || 'Ye category'}" delete karein?`)) {
                        removeListItem('skills', ci);
                      }
                    }}
                  >
                    <FaTrash />
                  </button>
                </div>

                {/* skills inside category */}
                <div className="mt-3 space-y-3">
                  {category.skills.map((skill, si) => (
                    <div
                      key={si}
                      className={`rounded-xl bg-gray-50 p-3 dark:bg-white/5 ${skill.isVisible ? '' : 'opacity-60'}`}
                    >
                      <div className="grid gap-2 sm:grid-cols-[1fr_9rem_9rem]">
                        <input
                          className={inputClass}
                          placeholder="Skill name"
                          maxLength={40}
                          value={skill.name}
                          onChange={(e) => setSkill(ci, si, { name: e.target.value })}
                        />
                        <select className={inputClass} value={skill.icon} onChange={(e) => setSkill(ci, si, { icon: e.target.value })}>
                          {SKILL_ICONS.map((icon) => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </select>
                        <select className={inputClass} value={skill.level} onChange={(e) => setSkill(ci, si, { level: e.target.value })}>
                          {LEVELS.map((level) => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={skill.progress}
                          onChange={(e) => setSkill(ci, si, { progress: Number(e.target.value) })}
                          className="min-w-[8rem] flex-1"
                          aria-label={`${skill.name || 'Skill'} progress`}
                        />
                        <span className="w-12 text-right text-sm font-semibold text-gray-700 dark:text-gray-200">
                          {skill.progress}%
                        </span>
                        <div className="flex gap-1">
                          <button type="button" className={iconButtonClass} aria-label={skill.isVisible ? 'Hide skill' : 'Show skill'} onClick={() => setSkill(ci, si, { isVisible: !skill.isVisible })}>
                            {skill.isVisible ? <FaEye /> : <FaEyeSlash />}
                          </button>
                          <button type="button" className={iconButtonClass} disabled={si === 0} aria-label="Move skill up" onClick={() => updateCategorySkills(ci, (list) => moveItem(list, si, -1))}><FaArrowUp /></button>
                          <button type="button" className={iconButtonClass} disabled={si === category.skills.length - 1} aria-label="Move skill down" onClick={() => updateCategorySkills(ci, (list) => moveItem(list, si, 1))}><FaArrowDown /></button>
                          <button type="button" className={`${iconButtonClass} text-red-500`} aria-label="Delete skill" onClick={() => updateCategorySkills(ci, (list) => list.filter((_, i) => i !== si))}><FaTrash /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3">
                  <AddButton
                    onClick={() =>
                      updateCategorySkills(ci, (list) => [
                        ...list,
                        { name: '', icon: 'code', level: 'Intermediate', progress: 70, isVisible: true },
                      ])
                    }
                  >
                    Add skill
                  </AddButton>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* CONTACT: details */}
      {page === 'contact' && (
        <Card
          title="Contact details"
          hint="Ye details Contact section me dikhte hain. Profile editor me bhi yahi fields hain — jo baad me save hoga wahi final rahega."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ['email', 'Email', 'you@example.com', 'email'],
              ['phone', 'Phone', '+91 …', 'tel'],
              ['location', 'Location', 'Pune, India', 'text'],
            ].map(([key, label, placeholder, type]) => (
              <label key={key} className="block">
                <span className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200">{label}</span>
                <input
                  type={type}
                  className={inputClass}
                  placeholder={placeholder}
                  value={form.contact[key]}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, contact: { ...prev.contact, [key]: e.target.value } }))
                  }
                />
              </label>
            ))}
          </div>
        </Card>
      )}
    </section>
  );
}

export default PageContentManager;