"use client";

import { useState } from "react";
import { FaLink, FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";

const ShareButtons: React.FC = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  const socialMedia = [
    { icon: <FaLink />, key: "link", name: "Copy Link" },
    { icon: <FaInstagram />, key: "instagram", name: "Instagram" },
    { icon: <FaTwitter />, key: "twitter", name: "Twitter" },
    { icon: <FaFacebook />, key: "facebook", name: "Facebook" },
  ];

  return (
    <div className="flex flex-col items-start gap-3">
      <p className="text-gray-700 font-semibold">Share</p>
      <div className="flex flex-col gap-3">
        {socialMedia.map(({ icon, key, name }) => (
          <div
            key={key}
            className="relative flex items-center gap-2"
            onMouseEnter={() => setHovered(key)}
            onMouseLeave={() => setHovered(null)}
          >
            {hovered === key && (
              <div className="absolute left-[-110px] flex items-center">
                <div className="relative bg-white text-black text-xs font-semibold px-3 py-1 rounded-md shadow-md border border-gray-400">
                  {name}
                  <div className="absolute top-1/2 right-[-6px] -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-gray-400"></div>
                  <div className="absolute top-1/2 right-[-4px] -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-8 border-transparent border-l-white"></div>
                </div>
              </div>
            )}
            <div className="w-12 h-12 flex justify-center items-center bg-white border-2 border-blue-500 rounded-lg text-blue-500 shadow-md hover:bg-blue-500 hover:text-white transition">
              {icon}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShareButtons;
