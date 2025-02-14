import { FaTrashAlt } from "react-icons/fa";

interface TicketProps {
  ticket: {
    id: number;
    name: string;
    amount: number;
    price: number;
    description: string;
  };
  onDelete: (id: number) => void;
}

const TicketCard: React.FC<TicketProps> = ({ ticket, onDelete }) => {
  return (
    <div className="bg-blue-100 border border-blue-400 rounded-lg p-4 flex flex-col w-full max-w-2xl mx-auto relative">
      {/* Efek Sobekan */}
      <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border border-blue-400 rounded-full"></div>
      <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border border-blue-400 rounded-full"></div>

      {/* Konten Tiket */}
      <div className="flex flex-col">
        <h3 className="text-lg font-bold text-black">{ticket.name}</h3>
        <p className="text-sm text-gray-700">Jumlah: {ticket.amount} tiket</p>
        <p className="text-sm text-gray-600 mt-2">{ticket.description}</p>
      </div>

      {/* Garis Pemisah */}
      <div className="border-t border-dotted border-gray-500 my-3"></div>

      {/* Harga & Aksi */}
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-black">
          Rp{ticket.price.toLocaleString("id-ID")}
        </span>
        <div className="flex gap-3">
          <FaTrashAlt
            className="text-red-500 cursor-pointer"
            onClick={() => onDelete(ticket.id)}
          />
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
