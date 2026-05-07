import React, { useState, useRef, useEffect } from "react";

export default function ProfileMenu({ onLogout, onEdit }) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);

  const menuRef = useRef(null);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  // ✅ FIXED (ONLY THIS PART)
  const user = isLoggedIn
    ? JSON.parse(localStorage.getItem("qyrovaUser")) || {}
    : {};

  const name = isLoggedIn
    ? localStorage.getItem("qyrovaName") || "User"
    : "User";

  const options = isLoggedIn ? ["edit", "logout"] : ["login"];

  useEffect(() => {
    const saved = localStorage.getItem("qyrovaAvatar");
    if (saved) setAvatar(saved);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem("qyrovaAvatar", reader.result);
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        triggerClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKey(e) {
      if (!open) return;

      if (e.key === "Escape") triggerClose();

      if (e.key === "ArrowDown") {
        setActiveIndex((prev) => (prev + 1) % options.length);
      }

      if (e.key === "ArrowUp") {
        setActiveIndex((prev) =>
          prev === 0 ? options.length - 1 : prev - 1
        );
      }

      if (e.key === "Enter") {
        const selected = options[activeIndex];

        if (selected === "edit") onEdit();

        if (selected === "logout") {
          onLogout();
          setOpen(true);
        }

        if (selected === "login") {
          onLogout();
          setOpen(true);
        }

        triggerClose();
      }
    }

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, activeIndex, isLoggedIn]);

  const triggerClose = () => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 180);
  };

  return (
    <div
      ref={menuRef}
      className="absolute top-6 right-6 z-50 font-[Inter]"
    >

      <div
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-full cursor-pointer border border-white/70 hover:scale-105 transition overflow-hidden"
      >
        {avatar ? (
          <img src={avatar} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-white text-black flex items-center justify-center font-semibold">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {open && (
        <div
          className={`
          absolute right-0 mt-3 w-72
          rounded-2xl p-5
          bg-neutral-900/95 backdrop-blur-xl
          border border-white/10
          shadow-[0_12px_40px_rgba(0,0,0,0.65)]
          transition-all duration-200
          ${closing ? "animate-close" : "animate-open"}
        `}
        >

          <div className="flex items-center gap-3 mb-4">
            <div
              className="relative w-12 h-12 rounded-full cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              {avatar ? (
                <img src={avatar} className="w-full h-full object-cover rounded-full border border-white/70" />
              ) : (
                <div className="w-full h-full rounded-full bg-white text-black flex items-center justify-center font-semibold text-sm border border-white/70">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">{name}</p>
              <p className="text-xs text-gray-400">
                {user.degree} {user.branch && `• ${user.branch}`}
              </p>
            </div>
          </div>

          <div className="h-px bg-white/5 mb-3" />

          <div className="space-y-1">

            {isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    triggerClose();
                    onEdit();
                  }}
                  className="w-full text-left text-sm px-3 py-2 rounded-lg text-gray-300 hover:bg-white/5"
                >
                  Edit Profile
                </button>

                <button
                  onClick={() => {
                    onLogout();
                    setOpen(true);
                  }}
                  className="w-full text-left text-sm px-3 py-2 rounded-lg text-red-400 hover:bg-white/5"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onLogout();
                  setOpen(true);
                }}
                className="w-full text-left text-sm px-3 py-2 rounded-lg text-purple-400 hover:bg-white/5"
              >
                Login
              </button>
            )}

          </div>
        </div>
      )}

      <style>{`
        .animate-open { animation: openMenu 0.18s ease-out forwards; }
        .animate-close { animation: closeMenu 0.18s ease-in forwards; }
      `}</style>
    </div>
  );
}