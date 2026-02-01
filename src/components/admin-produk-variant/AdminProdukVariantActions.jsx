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
        variant="outline"
        className="text-xs"
        onClick={onMutasiStokVariant}
      >
        <ArrowLeftRight className="h-4 w-4" />
      </Button>
      <Button variant="secondary" className="text-xs" onClick={onEdit}>
        <SquarePen />
      </Button>
      <Button variant="destructive" className="text-xs" onClick={onDelete}>
        <Trash2 />
      </Button>
    </div>
  );
};

export default AdminProdukVariantActions;
