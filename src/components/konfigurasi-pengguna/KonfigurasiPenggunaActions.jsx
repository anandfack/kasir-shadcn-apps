import { Button } from "@/components/ui/button";
import { KeyIcon, SquarePen, Trash2 } from "lucide-react";

const KonfigurasiPenggunaActions = ({ onEdit, onDelete, onResetPassword }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        title="Ubah"
        variant="secondary"
        className="text-xs"
        onClick={onEdit}
      >
        <SquarePen />
      </Button>
      <Button
        title="Reset Password"
        variant="primary"
        className="text-xs"
        onClick={onResetPassword}
      >
        <KeyIcon />
      </Button>
      {/* <Button
        title="Hapus"
        variant="destructive"
        className="text-xs"
        onClick={onDelete}
      >
        <Trash2 />
      </Button> */}
    </div>
  );
};

export default KonfigurasiPenggunaActions;
