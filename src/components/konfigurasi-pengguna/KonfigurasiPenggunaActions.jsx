import { Button } from "@/components/ui/button";
import { KeyIcon, KeyRoundIcon, SquarePen, Trash2 } from "lucide-react";

const KonfigurasiPenggunaActions = ({ onEdit, onDelete, onResetPassword }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="secondary"
        className="text-xs text-amber-400 border-amber-400 hover:bg-amber-400/10 transition-colors"
        onClick={onEdit}
        title="Edit"
      >
        <SquarePen />
      </Button>
      <Button
        // title="Reset Password"
        // variant="primary"
        // className="text-xs"
        // onClick={onResetPassword}

        variant="secondary"
        className="text-xs text-emerald-400 border-emerald-400 hover:bg-emerald-400/10 transition-colors"
        onClick={onResetPassword}
        title="Reset Password"
      >
        <KeyRoundIcon />
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
