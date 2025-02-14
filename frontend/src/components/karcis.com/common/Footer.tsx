import Image from "next/image";
import Link from "next/link";
import { FaTwitter, FaInstagram, FaFacebook } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#4F46E5] text-white py-10 px-20 mt-[250px]">
      <div className="max-w-7xl mx-auto grid grid-cols-5 gap-10">
        <div>
          <Link href="/home">
            <h1 className="text-xl font-bold hover:underline">Karcis.com</h1>
          </Link>
        </div>

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

        <div>
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
          <div className="flex flex-col gap-3 mt-4">
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

      <div className="border-t border-white/20 mt-10 pt-5 flex justify-between items-center text-sm">
        <p>&copy; 2020 Karcis incorporated</p>
        <div className="flex gap-4 text-lg">
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
