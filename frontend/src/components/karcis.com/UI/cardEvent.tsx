import React from "react";
import Image from "next/image";
import Link from "next/link";

interface CardProps {
  imageUrl: string;
  title: string;
  date: string;
  location: string;
  price: string;
  category: string;
  description: string;
  slug: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const Card: React.FC<CardProps> = ({
  imageUrl,
  title,
  date,
  location,
  price,
  category,
  description,
  slug,
}) => {
  return (
    <Link href={`/events/${slug}`} className="p-2 sm:p-4 block">
      <div className="w-full sm:max-w-[320px] bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden relative">
        <div className="relative w-full h-[180px]">
          <Image
            src={imageUrl}
            width={320}
            height={180}
            alt={title}
            className="object-cover w-full h-full rounded-t-lg"
          />
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-md">
            {category}
          </div>
        </div>
        <div className="p-4 flex flex-col gap-3 h-[270px]">
          <div className="flex flex-col items-start bg-gradient-to-r from-blue-500 to-blue-300 text-white p-2 rounded-md">
            <p className="text-sm font-semibold">{formatDate(date)}</p>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 hover:text-blue-500 transition-all cursor-pointer">
            {title}
          </h2>
          <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
          <div className="flex flex-col gap-4">
            <p className="font-medium text-sm text-gray-700">{location}</p>
          </div>
          <div className="flex-grow flex items-end justify-end mt-2">
            <span className="text-sm text-blue-500 font-semibold hover:underline">
              View Details
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Card;
