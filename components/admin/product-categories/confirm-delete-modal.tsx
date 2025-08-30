"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ConfirmDeleteModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    itemName?: string
}

export const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemName }: ConfirmDeleteModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Видалити {itemName || "продукт"}?</DialogTitle>
                </DialogHeader>
                <p className="text-muted-foreground">Цю дію не можна скасувати. Ви впевнені?</p>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Скасувати</Button>
                    <Button variant="destructive" onClick={onConfirm}>Так, видалити</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
