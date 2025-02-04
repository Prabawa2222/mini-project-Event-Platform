import React from "react";
import Image from "next/image";
import Link from "next/link";

interface CardProps {
  imageSrc: string;
  title: string;
  date: string;
  location: string;
  price: string;
}

const Card: React.FC<CardProps> = ({
  imageSrc,
  title,
  date,
  location,
  price,
}) => {
  return (
    <div className="p-2">
      <div className="w-[300px] h-[320px]  bg-white shadow-xl rounded-lg hover:shadow-[10px_10px_20px_#4F4CEE] hover:cursor-pointer">
        <Image
          src={imageSrc}
          width={1000}
          height={100}
          alt="example event"
          className="rounded-t-lg h-[180px] w-full"
        />
        <div className="flex items-center gap-4 justify-center pt-2">
          {/* Tanggal */}
          <div className="w-16 h-[89px] flex flex-col items-center pt-2">
            <h1 className="text-lg font-bold">{date.split(" ")[0]}</h1>
            <p className="text-xl font-semibold">{date.split(" ")[1]}</p>
          </div>
          {/* Event Details */}
          <div className="flex flex-col gap-2 justify-center">
            <h1 className="text-lg font-bold">{title}</h1>
            <p className="text-sm text-gray-600">{price}</p>
            <p className="text-gray-500 text-sm">{location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
