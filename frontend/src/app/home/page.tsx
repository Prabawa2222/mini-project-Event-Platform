import Footer from "@/components/karcis.com/common/Footer";
import HomeHero from "@/components/karcis.com/home/hero.home.component";
import HotOfferEvent from "@/components/karcis.com/home/hotofferEvent.home.component";
import Navbar from "@/components/karcis.com/common/Navbar";
import ScrollToTop from "@/components/karcis.com/common/scrollTop";
import TopSellingEvent from "@/components/karcis.com/home/topsellingEvent.home.component";
import EventList from "@/components/karcis.com/home/listEvent.home.component";

export default function Home() {
  const upcomingEvents = [
    {
      imageSrc: "/exmp_evnt.png",
      title: "Panic! at the Disco",
      date: "Nov 01",
      location: "The Icon, BSD",
      price: "Rp. 450.000 - 975.000",
    },
    {
      imageSrc: "/topsell2.png",
      title: "Coldplay World Tour",
      date: "Dec 10",
      location: "GBK, Jakarta",
      price: "Rp. 850.000 - 1.500.000",
    },
    {
      imageSrc: "/topsell3.png",
      title: "The Weeknd Concert",
      date: "Jan 20",
      location: "ICE BSD",
      price: "Rp. 700.000 - 1.200.000",
    },
    {
      imageSrc: "/topsell1.png",
      title: "Taylor Swift Eras Tour",
      date: "Feb 15",
      location: "Singapore National Stadium",
      price: "Rp. 1.200.000 - 2.500.000",
    },
  ];

  const browseArts = [
    {
      imageSrc: "/topsell2.png",
      title: "Art Exhibition: Modern Era",
      date: "Mar 05",
      location: "Art Center, Jakarta",
      price: "Rp. 100.000 - 300.000",
    },
    {
      imageSrc: "/topsell3.png",
      title: "Indonesian Batik Showcase",
      date: "Apr 10",
      location: "Museum Nasional",
      price: "Rp. 50.000 - 150.000",
    },
    {
      imageSrc: "/topsell1.png",
      title: "The Weeknd Concert",
      date: "Jan 20",
      location: "ICE BSD",
      price: "Rp. 700.000 - 1.200.000",
    },
    {
      imageSrc: "/exmp_evnt.png",
      title: "The Weeknd Concert",
      date: "Jan 20",
      location: "ICE BSD",
      price: "Rp. 700.000 - 1.200.000",
    },
    {
      imageSrc: "/topsell2.png",
      title: "The Weeknd Concert",
      date: "Jan 20",
      location: "ICE BSD",
      price: "Rp. 700.000 - 1.200.000",
    },
  ];

  const browseConcerts = [
    {
      imageSrc: "/exmp_evnt.png",
      title: "Jazz Night Festival",
      date: "May 20",
      location: "Kemayoran, Jakarta",
      price: "Rp. 250.000 - 500.000",
    },
    {
      imageSrc: "/topsell1.png",
      title: "Rock Legends Reunion",
      date: "Jun 15",
      location: "Balai Kartini",
      price: "Rp. 400.000 - 800.000",
    },
    {
      imageSrc: "/topsell2.png",
      title: "Rock Legends Reunion",
      date: "Jun 15",
      location: "Balai Kartini",
      price: "Rp. 400.000 - 800.000",
    },
    {
      imageSrc: "/topsell3.png",
      title: "Rock Legends Reunion",
      date: "Jun 15",
      location: "Balai Kartini",
      price: "Rp. 400.000 - 800.000",
    },
    {
      imageSrc: "/exmp_evnt.png",
      title: "Rock Legends Reunion",
      date: "Jun 15",
      location: "Balai Kartini",
      price: "Rp. 400.000 - 800.000",
    },
  ];

  return (
    <div>
      <Navbar />
      <HomeHero />
      <EventList title="Upcoming Events" events={upcomingEvents} />
      <HotOfferEvent />
      <TopSellingEvent />
      <div className="mb-[-100px]">
        <EventList title="Browse Arts" events={browseArts} />
      </div>
      <div className="mb-[-50px]">
        <EventList title="Browse Concerts" events={browseConcerts} />
      </div>
      <ScrollToTop />
      <Footer />
    </div>
  );
}
