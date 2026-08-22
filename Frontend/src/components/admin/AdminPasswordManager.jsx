import { useState } from 'react';
import { FaEye, FaEyeSlash, FaLock, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

import API from '../../utils/axios';

const PasswordField = ({
  label,
  name,
  value,
  onChange,
  showPassword,
  onToggle,
  placeholder,
  autoComplete,
  disabled,
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="
          mb-2
          block
          text-sm
          font-semibold
          text-gray-800
          dark:text-gray-200
        "
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className="
            block
            w-full
            rounded-xl
            border
            border-gray-200
            bg-white
            px-4
            py-3
            pr-12
            text-sm
            text-gray-900
            outline-none
            transition
            placeholder:text-gray-400
            focus:border-indigo-500
            focus:ring-4
            focus:ring-indigo-500/10
            disabled:cursor-not-allowed
            disabled:opacity-60
            dark:border-gray-700
            dark:bg-gray-950
            dark:text-white
            dark:placeholder:text-gray-500
          "
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          tabIndex={-1}
          aria-label={
            showPassword
              ? `Hide ${label}`
              : `Show ${label}`
          }
          className="
            absolute
            right-2
            top-1/2
            flex
            h-9
            w-9
            -translate-y-1/2
            items-center
            justify-center
            rounded-lg
            text-gray-400
            transition
            hover:bg-gray-100
            hover:text-gray-700
            disabled:cursor-not-allowed
            disabled:opacity-50
            dark:hover:bg-gray-800
            dark:hover:text-gray-200
          "
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );
};

function AdminPasswordManager() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const currentPassword =
      form.currentPassword.trim();

    const newPassword =
      form.newPassword;

    const confirmPassword =
      form.confirmPassword;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      toast.error(
        'Please fill all password fields.'
      );
      return;
    }

    if (newPassword.length < 6) {
      toast.error(
        'New password must be at least 6 characters.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(
        'New password and confirm password do not match.'
      );
      return;
    }

    if (currentPassword === newPassword) {
      toast.error(
        'New password must be different from current password.'
      );
      return;
    }

    try {
      setSaving(true);

      const response = await API.put(
        '/auth/change-password',
        {
          currentPassword,
          newPassword,
        }
      );

      toast.success(
        response.data?.message ||
          'Password changed successfully.'
      );

      setForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      setShowPassword({
        current: false,
        new: false,
        confirm: false,
      });
    } catch (error) {
      console.error(
        'Change password error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
          'Unable to change password. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleResetForm = () => {
    if (saving) {
      return;
    }

    setForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });

    setShowPassword({
      current: false,
      new: false,
      confirm: false,
    });
  };

  const isFormEmpty =
    !form.currentPassword &&
    !form.newPassword &&
    !form.confirmPassword;

  return (
    <section
      className="
        max-w-2xl
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
      <div className="mb-7">
        <div
          className="
            mb-4
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
          <FaLock />
        </div>

        <p
          className="
            text-sm
            font-semibold
            text-indigo-600
            dark:text-indigo-400
          "
        >
          Account Security
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
          Change Password
        </h2>

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-gray-500
            dark:text-gray-400
          "
        >
          Enter your current password and choose a new
          password for your admin account.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
        autoComplete="off"
      >
        <PasswordField
          label="Current Password"
          name="currentPassword"
          value={form.currentPassword}
          onChange={(value) =>
            handleChange(
              'currentPassword',
              value
            )
          }
          showPassword={
            showPassword.current
          }
          onToggle={() =>
            setShowPassword((previous) => ({
              ...previous,
              current: !previous.current,
            }))
          }
          placeholder="Enter current password"
          autoComplete="current-password"
          disabled={saving}
        />

        <PasswordField
          label="New Password"
          name="newPassword"
          value={form.newPassword}
          onChange={(value) =>
            handleChange(
              'newPassword',
              value
            )
          }
          showPassword={
            showPassword.new
          }
          onToggle={() =>
            setShowPassword((previous) => ({
              ...previous,
              new: !previous.new,
            }))
          }
          placeholder="Enter new password"
          autoComplete="new-password"
          disabled={saving}
        />

        <PasswordField
          label="Confirm New Password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={(value) =>
            handleChange(
              'confirmPassword',
              value
            )
          }
          showPassword={
            showPassword.confirm
          }
          onToggle={() =>
            setShowPassword((previous) => ({
              ...previous,
              confirm: !previous.confirm,
            }))
          }
          placeholder="Re-enter new password"
          autoComplete="new-password"
          disabled={saving}
        />

        <div
          className="
            rounded-2xl
            border
            border-indigo-100
            bg-indigo-50
            p-4
            dark:border-indigo-500/20
            dark:bg-indigo-500/10
          "
        >
          <p
            className="
              text-sm
              font-semibold
              text-indigo-800
              dark:text-indigo-300
            "
          >
            Password requirements
          </p>

          <ul
            className="
              mt-2
              space-y-1
              text-xs
              text-indigo-700
              dark:text-indigo-300
            "
          >
            <li>
              • At least 6 characters
            </li>
            <li>
              • New password and confirmation
                must match
            </li>
            <li>
              • New password must be different
                from current password
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleResetForm}
            disabled={
              saving || isFormEmpty
            }
            className="
              inline-flex
              flex-1
              items-center
              justify-center
              rounded-xl
              border
              border-gray-200
              bg-white
              px-5
              py-3
              text-sm
              font-semibold
              text-gray-700
              transition
              hover:bg-gray-50
              disabled:cursor-not-allowed
              disabled:opacity-50
              dark:border-gray-700
              dark:bg-gray-900
              dark:text-gray-200
              dark:hover:bg-gray-800
            "
          >
            Clear
          </button>

          <button
            type="submit"
            disabled={saving}
            className="
              inline-flex
              flex-1
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
              transition
              hover:bg-indigo-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {saving ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaLock />
            )}

            {saving
              ? 'Changing Password...'
              : 'Change Password'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AdminPasswordManager;
