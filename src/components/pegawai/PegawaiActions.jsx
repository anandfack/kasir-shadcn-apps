import { Button } from "@/components/ui/button";
import { EyeIcon, SquarePen, Trash2 } from "lucide-react";

const PegawaiActions = ({ onEdit, onDelete, onDetail }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="secondary"
        className="text-xs text-sky-400 border-sky-400 hover:bg-sky-400/10 transition-colors"
        onClick={onDetail}
        title="Detail"
      >
        <EyeIcon />
      </Button>
      <Button
        variant="secondary"
        className="text-xs text-amber-400 border-amber-400 hover:bg-amber-400/10 transition-colors"
        onClick={onEdit}
        title="Edit"
      >
        <SquarePen />
      </Button>
      <Button
        variant="secondary"
        className="text-xs text-rose-400 border-rose-400 hover:bg-rose-400/10 transition-colors"
        onClick={onDelete}
        title="Delete"
      >
        <Trash2 />
      </Button>
    </div>
  );
};

export default PegawaiActions;
