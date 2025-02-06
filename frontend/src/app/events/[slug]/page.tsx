import Footer from "@/components/karcis.com/common/Footer";
import Navbar from "@/components/karcis.com/common/Navbar";
import Banner from "@/components/karcis.com/events/banner.component";
import BuyTicketCard from "@/components/karcis.com/events/cardbuyTicket.component";
import DetailEvent from "@/components/karcis.com/events/detailEvent.component";
import EventInfo from "@/components/karcis.com/events/eventInfo.component";
import ShareButtons from "@/components/karcis.com/events/socmedShare.component";
import BackButton from "@/components/karcis.com/UI/buttonBack";

export default function getEventBySlug() {
  return (
    <div>
      <Navbar />
      <div className="w-[80%] min-h-screen flex mx-auto mt-40 gap-10">
        <div className="w-[5%]">
          <ShareButtons />
        </div>
        <div className="w-[86%]">
          <div className="mb-4">
            <BackButton href="/events" />
          </div>
          <Banner />
          <div className="w-[1100px] mt-20 flex justify-between">
            <DetailEvent />
            <BuyTicketCard href="/tickets/slug" />
          </div>
          <EventInfo />
        </div>
      </div>
      <Footer />
    </div>
  );
}
