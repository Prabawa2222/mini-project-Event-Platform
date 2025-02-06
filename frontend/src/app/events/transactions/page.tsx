import NavbarAfterLogin from "@/components/karcis.com/common/NavbarAfterLogin";
import FormTransaction from "@/components/karcis.com/transactions/formTransaction";
import HeroTransaction from "@/components/karcis.com/transactions/heroTrasaction";
import BackButton from "@/components/karcis.com/UI/buttonBack";

export default function Transactions() {
  return (
    <div>
      <NavbarAfterLogin />
      <div className="w-[80%] min-h-auto flex flex-col mx-auto mt-40 gap-10">
        <div className="w-[50%] h-[50px] flex items-center gap-16">
          <BackButton href="/events/:slug" />
          <span className="text-3xl font-semibold">
            Buyer Contact Information
          </span>
        </div>
        <div className="w-full h-[50px] ml-28 flex flex-col gap-10">
          <div className="w-full h-16 flex gap-[93px]">
            <div className="w-[628px] h-16 bg-[#4F4CEE] flex items-center bg-opacity-10  p-9">
              <p className="w-4/5 text-sm text-[#4F4CEE]">
                E-tickets will be sent to your email address, please make sure
                your email address is correct
              </p>
            </div>
            <div className="w-[471px] h-[500px] flex flex-col gap-4">
              <h1 className="text-xl font-semibold">Event Detail</h1>
              <div className="w-full px-4 flex justify-start">
                <HeroTransaction />
              </div>
              <hr className="border-t-2 border-dashed border-[#7F7DF3] mt-2" />
              <h1 className="text-xl font-semibold mt-1">Event Detail</h1>
              <div className="w-full px-4 flex justify-between">
                <p>Ticket Type</p>
                <p className="font-semibold">2 X Paket VIP</p>
              </div>
              <hr className="border-t-2 border-dashed border-[#7F7DF3] mt-2" />
              <h1 className="text-xl font-semibold mt-1">Event Detail</h1>
              <div className="w-full px-4 flex justify-between">
                <p>Ticket Price</p>
                <p className="font-semibold">2 X Rp.250.000</p>
              </div>
              <div className="w-full px-4 flex justify-between">
                <p>Service & Handling</p>
                <p className="font-semibold">-</p>
              </div>
              <div className="w-full px-4 flex justify-between">
                <p>Admin Fee</p>
                <p className="font-semibold">-</p>
              </div>
              <hr className="border-t-2 border-dashed border-[#7F7DF3] mt-2" />
              <div className="w-full px-4 flex justify-between">
                <p className="font-semibold">Total</p>
                <p className="font-semibold">Rp. 500.000</p>
              </div>
            </div>
          </div>
          <div className="w-[655px] h-16">
            <FormTransaction />
          </div>
        </div>
      </div>
    </div>
  );
}
