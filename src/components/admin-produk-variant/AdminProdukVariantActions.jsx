import { Button } from "@/components/ui/button";
import { ArrowLeftRight, SquarePen, Trash2 } from "lucide-react";

const AdminProdukVariantActions = ({
  onEdit,
  onDelete,
  onMutasiStokVariant,
}) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="secondary"
        className="text-xs text-sky-400 border-sky-400 hover:bg-sky-400/10 transition-colors"
        onClick={onMutasiStokVariant}
        title="Mutasi"
      >
        <ArrowLeftRight className="h-4 w-4" />
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

export default AdminProdukVariantActions;
