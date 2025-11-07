
import Modal from './ui/modal'
interface modalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export default function FavoriteModal({ open, onOpenChange }: modalProps) {
  return <Modal open={open} onOpenChange={onOpenChange} />
}