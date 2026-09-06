/*
|--------------------------------------------------------------------------
| SectionFallback
|--------------------------------------------------------------------------
|
| React.lazy() + Suspense se code-split hue sections (About, Skills,
| Projects, etc.) ke liye halka-sa placeholder — jab tak unka JS
| chunk load ho raha ho.
|
| Loader.jsx (full-screen spinner) ke bajaye ise use kar rahe hain
| kyunki:
|
|   - Ye kaafi tez chunks hain (chhote components), spinner flash
|     karna zyada distracting hoga.
|   - Ek fixed min-height reserve karta hai taaki section jab load
|     ho to page "jump" na kare (layout shift kam hota hai).
|
|--------------------------------------------------------------------------
*/

function SectionFallback() {
  return (
    <div
      aria-hidden="true"
      className="flex min-h-[40vh] w-full items-center justify-center py-20"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600 dark:border-gray-800 dark:border-t-indigo-400" />
      </div>
    </div>
  );
}

export default SectionFallback;