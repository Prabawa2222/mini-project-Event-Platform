"use client";
import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Card from "../UI/cardEvent";
import Link from "next/link";

const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <div
    className="absolute top-1/2 right-[-30px] transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 z-10"
    onClick={onClick}
  >
    <FaChevronRight size={30} />
  </div>
);

const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <div
    className="absolute top-1/2 left-[-30px] transform -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 z-10"
    onClick={onClick}
  >
    <FaChevronLeft size={30} />
  </div>
);

interface Event {
  imageSrc: string;
  title: string;
  date: string;
  location: string;
  price: string;
  category: string;
  isOnline: boolean;
  description: string;
}

interface EventListProps {
  title?: string;
  events: Event[]; // Menerima event secara dinamis
}

export default function EventList({
  title = "Upcoming Events",
  events,
}: EventListProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    afterChange: (current: number) => setActiveSlide(current),
    appendDots: (dots: React.ReactNode) => (
      <div>
        <ul className="flex justify-center gap-2 mt-4">{dots}</ul>
      </div>
    ),
    customPaging: (i: number) => (
      <div
        className={`w-8 h-2 rounded-full transition-all duration-300 ${
          i === activeSlide ? "bg-blue-600 scale-110" : "bg-gray-400"
        }`}
      ></div>
    ),
  };

  return (
    <div className="flex justify-center mt-[170px] my-40">
      <div className="w-[80%] flex flex-col gap-5 relative">
        {/* Header */}
        <div className="w-full h-[40px] flex justify-between items-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          <Link
            href="/events"
            className="text-[13px] text-[#4F4CEE] hover:underline mr-10 pt-5"
          >
            View All
          </Link>
        </div>

        {/* Carousel */}
        <Slider {...settings}>
          {events.map((event, index) => (
            <Card
              key={index}
              imageSrc={event.imageSrc}
              title={event.title}
              date={event.date}
              location={event.location}
              price={event.price}
              category={event.category || "Default Category"} // Menambahkan properti category
              isOnline={event.isOnline || false} // Menambahkan properti isOnline
              description={event.description || "No description available"} // Menambahkan deskripsi
            />
          ))}
        </Slider>
      </div>
    </div>
  );
}
