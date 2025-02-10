import Image from "next/image";

interface BannerProps {
  imageUrl: string;
}

export default function Banner({ imageUrl }: BannerProps) {
  return (
    <div>
      <div className="w-[1100px] h-[360px] bg-[#DADAFB] bg-opacity-50 flex justify-center rounded-lg p-3">
        <div className="w-[1050px] h-[200px]">
          <Image
            src={imageUrl}
            alt="Banner Image"
            layout="responsive"
            width={1500}
            height={100}
            className="bottom-20"
          />
        </div>
      </div>
    </div>
  );
}
