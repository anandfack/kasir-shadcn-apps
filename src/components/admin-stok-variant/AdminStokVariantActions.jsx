import { Button } from "@/components/ui/button";
import { SlidersHorizontal, SquarePen, Trash2 } from "lucide-react";

const AdminStokVariantActions = ({
  onEdit,
  onDelete,
  onAdjustment,
  disabled,
}) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="secondary"
        className="text-xs text-amber-400 border-amber-400 hover:bg-amber-400/10 transition-colors"
        title="Edit Stok Minimum dan Maksimum"
        onClick={onEdit}
        disabled={disabled}
      >
        <SquarePen />
      </Button>
      {/* <Button variant="destructive" className="text-xs" onClick={onDelete}>
        <Trash2 />
      </Button> */}
      <Button
        variant="primary"
        className="text-xs text-emerald-400 border-emerald-400 hover:bg-emerald-400/10 transition-colors"
        title="Sesuaikan Stok"
        onClick={onAdjustment}
        disabled={disabled}
      >
        <SlidersHorizontal />
      </Button>
    </div>
  );
};

export default AdminStokVariantActions;
