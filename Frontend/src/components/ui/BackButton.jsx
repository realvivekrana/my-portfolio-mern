import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

/*
|--------------------------------------------------------------------------
| BACK BUTTON (history-aware)
|--------------------------------------------------------------------------
|
| User jis page se aaya tha wahin wapas bhejta hai (navigate(-1)).
| Agar user direct link / refresh se aaya hai (history me pichla page
| nahi hai) to `fallback` route par bhejta hai.
|
| Props:
|   fallback  - direct open hone par kahan jaye (default '/')
|   label     - button text (default 'Back')
|   variant   - 'link' (text) | 'outline' (bordered button)
|   className - extra classes (margin etc.)
|
| Example:
|   <BackButton fallback="/blog" label="Back to Blog" className="mb-8" />
|
|--------------------------------------------------------------------------
*/

const VARIANTS = {
  link:
    'text-sm font-semibold text-gray-400 hover:text-purple-200',
  outline:
    'rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-100 dark:border-white/20 dark:text-gray-200 dark:hover:bg-white/10',
};

function BackButton({
  fallback = '/',
  label = 'Back',
  variant = 'link',
  className = '',
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // 'default' key = is app me yeh pehla page hai (pichla page nahi)
    if (location.key !== 'default') {
      navigate(-1);
      return;
    }

    navigate(fallback);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label={label}
      className={`group inline-flex items-center justify-center gap-2 transition-colors ${
        VARIANTS[variant] || VARIANTS.link
      } ${className}`}
    >
      <FaArrowLeft className="text-xs transition-transform duration-300 group-hover:-translate-x-1" />
      {label}
    </button>
  );
}

export default BackButton;