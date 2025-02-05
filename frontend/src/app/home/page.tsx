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
      price: "Rp. 450.000",
      category: "Concert",
      isOnline: false,
      description: "A great concert event with Panic! at the Disco",
    },
    {
      imageSrc: "/topsell2.png",
      title: "Coldplay World Tour",
      date: "Dec 10",
      location: "GBK, Jakarta",
      price: "Rp. 850.000",
      category: "Concert",
      isOnline: true,
      description: "The famous Coldplay concert live in Jakarta",
    },
    {
      imageSrc: "/topsell3.png",
      title: "The Weeknd Concert",
      date: "Jan 20",
      location: "ICE BSD",
      price: "Rp. 700.000",
      category: "Concert",
      isOnline: false,
      description: "The Weeknd's concert is always unforgettable",
    },
    {
      imageSrc: "/topsell1.png",
      title: "Taylor Swift Eras Tour",
      date: "Feb 15",
      location: "Singapore National Stadium",
      price: "Rp. 1.200.000",
      category: "Concert",
      isOnline: true,
      description: "Experience the amazing Eras Tour by Taylor Swift",
    },
  ];

  const browseArts = [
    {
      imageSrc: "/topsell2.png",
      title: "Art Exhibition: Modern Era",
      date: "Mar 05",
      location: "Art Center, Jakarta",
      price: "Rp. 100.000",
      category: "Art",
      isOnline: false,
      description: "A showcase of modern art",
    },
    {
      imageSrc: "/topsell3.png",
      title: "Indonesian Batik Showcase",
      date: "Apr 10",
      location: "Museum Nasional",
      price: "Rp. 50.000",
      category: "Art",
      isOnline: true,
      description: "Exhibition of traditional Indonesian batik",
    },
  ];

  const browseConcerts = [
    {
      imageSrc: "/exmp_evnt.png",
      title: "Jazz Night Festival",
      date: "May 20",
      location: "Kemayoran, Jakarta",
      price: "Rp. 250.000",
      category: "Concert",
      isOnline: false,
      description: "Jazz festival with top musicians",
    },
    {
      imageSrc: "/topsell1.png",
      title: "Rock Legends Reunion",
      date: "Jun 15",
      location: "Balai Kartini",
      price: "Rp. 400.000",
      category: "Concert",
      isOnline: true,
      description: "Legendary rock bands reunited for a special concert",
    },
  ];

  return (
    <div>
      <Navbar />
      <HomeHero />
      <EventList title="Upcoming Events" events={upcomingEvents} />
      <HotOfferEvent />
      <TopSellingEvent />

      {/* Browse Arts: Filter for 'Art' category */}
      <div className="mb-[-100px]">
        <EventList
          title="Browse Arts"
          events={browseArts.filter((event) => event.category === "Art")} // Filter by Art category
        />
      </div>

      {/* Browse Concerts: Filter for 'Concert' category */}
      <div className="mb-[-50px]">
        <EventList
          title="Browse Concerts"
          events={browseConcerts.filter(
            (event) => event.category === "Concert"
          )} // Filter by Concert category
        />
      </div>

      <ScrollToTop />
      <Footer />
    </div>
  );
}
