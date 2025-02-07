import { FaRegClock, FaTrashAlt, FaEdit } from "react-icons/fa";

interface TicketProps {
  ticket: {
    id: number;
    name: string;
    amount: number;
    price: number;
    description: string; // Menambahkan field deskripsi
  };
  onDelete: (id: number) => void;
}

const TicketCard: React.FC<TicketProps> = ({ ticket, onDelete }) => {
  return (
    <div className="bg-blue-100 border border-blue-400 rounded-lg p-4 flex flex-col w-full max-w-2xl mx-auto relative">
      {/* Tiket dengan efek sobekan */}
      <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border border-blue-400 rounded-full"></div>
      <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border border-blue-400 rounded-full"></div>

      {/* Konten utama */}
      <div className="flex flex-col">
        <h3 className="text-lg font-bold text-black">Tiket {ticket.name}</h3>
        <p className="text-sm text-gray-700">Jumlah: {ticket.amount}</p>
        {/* Deskripsi Tiket */}
        <p className="text-sm text-gray-600 mt-2">{ticket.description}</p>{" "}
        {/* Menambahkan deskripsi */}
      </div>

      {/* Garis pemisah */}
      <div className="border-t border-dotted border-gray-500 my-3"></div>

      {/* Harga dan aksi */}
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-black">
          Rp{ticket.price.toLocaleString()}
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
