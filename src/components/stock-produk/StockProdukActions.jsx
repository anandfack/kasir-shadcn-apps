import { Button } from "@/components/ui/button";
import { SlidersHorizontal, SquarePen, Trash2 } from "lucide-react";

const StockProdukActions = ({ onEdit, onDelete, onAdjustment }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="secondary"
        className="text-xs"
        title="Edit Stok Minimum dan Maksimum"
        onClick={onEdit}
      >
        <SquarePen />
      </Button>
      {/* <Button variant="destructive" className="text-xs" onClick={onDelete}>
        <Trash2 />
      </Button> */}
      <Button
        variant="primary"
        className="text-xs"
        title="Sesuaikan Stok"
        onClick={onAdjustment}
      >
        <SlidersHorizontal />
      </Button>
    </div>
  );
};

export default StockProdukActions;
