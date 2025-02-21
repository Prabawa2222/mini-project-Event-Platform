import Image from "next/image";

interface BannerProps {
  imageUrl: string;
}

export default function Banner({ imageUrl }: BannerProps) {
  return (
    <div className="flex justify-center px-4 md:px-0">
      <div className="max-w-full md:w-[1100px] h-auto md:h-[360px] bg-[#DADAFB] bg-opacity-50 flex justify-center items-center rounded-lg p-3">
        <div className="relative w-full h-[200px] md:h-full">
          <Image
            src={imageUrl}
            alt="Banner Image"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
