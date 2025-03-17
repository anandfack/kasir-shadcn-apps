import { Button } from "@/components/ui/button";
import { SquarePen, Trash2 } from "lucide-react";

const HargaProdukActions = ({ onEdit, onDelete }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button variant="secondary" className="text-xs" onClick={onEdit}>
        <SquarePen />
      </Button>
      <Button variant="destructive" className="text-xs" onClick={onDelete}>
        <Trash2 />
      </Button>
    </div>
  );
};

export default HargaProdukActions;