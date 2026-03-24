import { Plus } from "lucide-react";

interface FABProps {
  onClick: () => void;
}

export function FAB({ onClick }: FABProps) {
  return (
    <button onClick={onClick} className="fab-button" aria-label="Add transaction">
      <Plus className="w-6 h-6" />
    </button>
  );
}
