import { Button } from "@/components/ui/button";
import { SquarePen, Trash2 } from "lucide-react";

const ProdukActions = ({ onEdit, onDelete }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="secondary"
        title="Edit"
        className="text-xs text-amber-400 border-amber-400 hover:bg-amber-400/10 transition-colors"
        onClick={onEdit}
      >
        <SquarePen />
      </Button>
      <Button
        variant="secondary"
        title="Delete"
        className="text-xs text-rose-400 border-rose-400 hover:bg-rose-400/10 transition-colors"
        onClick={onDelete}
      >
        <Trash2 />
      </Button>
    </div>
  );
};

export default ProdukActions;
