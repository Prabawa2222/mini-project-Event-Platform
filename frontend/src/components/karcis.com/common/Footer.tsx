import Image from "next/image";
import Link from "next/link";
import { FaTwitter, FaInstagram, FaFacebook } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#4F46E5] text-white py-10 px-6 md:px-20 mt-[100px] md:mt-[250px]">
      {/* Grid Wrapper */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 md:gap-10 text-center md:text-left">
        {/* Logo - Tetap full width di mobile */}
        <div className="sm:col-span-2 md:col-span-1">
          <Link href="/home">
            <h1 className="text-xl font-bold hover:underline">Karcis.com</h1>
          </Link>
        </div>

        {/* About */}
        <div>
          <h2 className="font-semibold mb-3">About</h2>
          <ul className="space-y-2 text-sm">
            {[
              "About Karcis.com",
              "How it works",
              "Careers",
              "Press",
              "Blog",
              "Forum",
            ].map((item, index) => (
              <li key={index}>
                <Link href="#" className="hover:underline">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Partner */}
        <div>
          <h2 className="font-semibold mb-3">Partner with us</h2>
          <ul className="space-y-2 text-sm">
            {[
              "Partnership programs",
              "Affiliate program",
              "Connectivity partners",
              "Promotions and events",
              "Integrations",
              "Community",
              "Loyalty program",
            ].map((item, index) => (
              <li key={index}>
                <Link href="#" className="hover:underline">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h2 className="font-semibold mb-3">Support</h2>
          <ul className="space-y-2 text-sm">
            {[
              "Help Center",
              "Contact us",
              "Privacy policy",
              "Terms of service",
              "Trust and safety",
              "Accessibility",
            ].map((item, index) => (
              <li key={index}>
                <Link href="#" className="hover:underline">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Get the app - Tetap full width di mobile */}
        <div className="sm:col-span-2 md:col-span-1">
          <h2 className="font-semibold mb-3">Get the app</h2>
          <ul className="space-y-2 text-sm">
            {[
              "Karcis.com for Android",
              "Karcis.com for iOS",
              "Mobile site",
            ].map((item, index) => (
              <li key={index}>
                <Link href="#" className="hover:underline">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex justify-center md:justify-start gap-3 mt-4">
            <Image
              src="/app-store.png"
              width={120}
              height={40}
              alt="App Store"
              className="cursor-pointer"
            />
            <Image
              src="/google-play.png"
              width={120}
              height={40}
              alt="Google Play"
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-white/20 mt-10 pt-5 flex flex-col md:flex-row items-center justify-between text-sm gap-4 md:gap-0">
        <p className="text-center md:text-left">
          &copy; 2020 Karcis incorporated
        </p>
        <div className="flex gap-6 text-xl">
          <Link href="#" className="hover:text-gray-300">
            <FaTwitter />
          </Link>
          <Link href="#" className="hover:text-gray-300">
            <FaInstagram />
          </Link>
          <Link href="#" className="hover:text-gray-300">
            <FaFacebook />
          </Link>
        </div>
      </div>
    </footer>
  );
}
