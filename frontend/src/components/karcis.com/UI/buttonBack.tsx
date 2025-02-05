import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BackButtonProps {
  href: string;
}

const BackButton: React.FC<BackButtonProps> = ({ href }) => {
  return (
    <Link href={href}>
      <button className="w-12 h-12 flex items-center justify-center border border-indigo-500 rounded-lg text-indigo-500 hover:bg-indigo-100">
        <ArrowLeft size={24} />
      </button>
    </Link>
  );
};

export default BackButton;
