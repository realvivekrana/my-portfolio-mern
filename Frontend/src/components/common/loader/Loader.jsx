import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoaderLogo from "./LoaderLogo";

const Loader = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: {
                duration: 0.6,
              },
            }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950"
          >
            <LoaderLogo />

            <motion.div
              className="mt-10 h-1 w-56 overflow-hidden rounded-full bg-slate-700"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 1.6,
                  ease: "easeInOut",
                }}
                className="h-full rounded-full bg-cyan-400"
              />
            </motion.div>

            <p className="mt-6 text-sm tracking-[6px] text-slate-400 uppercase">
              Loading Portfolio...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && children}
    </>
  );
};

export default Loader;