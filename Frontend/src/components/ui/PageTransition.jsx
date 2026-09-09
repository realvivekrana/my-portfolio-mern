import { motion } from 'framer-motion';

/*
|--------------------------------------------------------------------------
| PAGE TRANSITION
|--------------------------------------------------------------------------
|
| Wraps a route's element with a fade + slight vertical-slide
| animation on enter/exit, driven by <AnimatePresence> in App.jsx.
|
| IMPORTANT: this uses `y` (a CSS transform) for the slide, which
| means any `position: fixed` descendant becomes fixed relative to
| THIS element instead of the viewport while the transform is
| active. That's fine for pages like Blog, BlogPost, ProjectCaseStudy,
| Admin screens and NotFound because they don't rely on a
| viewport-fixed navbar.
|
| The Home page (which nests a `fixed` Navbar) intentionally uses
| <FadeOnlyTransition> below instead — opacity never creates a new
| transform/stacking context, so the fixed navbar keeps behaving
| correctly even mid-animation.
|
|--------------------------------------------------------------------------
*/

const variants = {
  initial: {
    opacity: 0,
    y: 16,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -16,
  },
};

const transition = {
  duration: 0.32,
  ease: [0.22, 1, 0.36, 1],
};

function PageTransition({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

/*
|--------------------------------------------------------------------------
| FADE-ONLY TRANSITION
|--------------------------------------------------------------------------
|
| Safe for pages that contain `position: fixed` elements (e.g. Home's
| Navbar). Opacity-only animation, no transform, so fixed children
| never get reparented visually during the transition.
|
|--------------------------------------------------------------------------
*/

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const fadeTransition = {
  duration: 0.28,
  ease: 'easeInOut',
};

export function FadeOnlyTransition({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeVariants}
      transition={fadeTransition}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;