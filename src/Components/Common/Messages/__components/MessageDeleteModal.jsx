import React from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography,
} from "@material-tailwind/react";
import { useDeleteMessageMutation } from "../../../../store/services/messages.api";
import { Alert } from "../../../Other/UI/Alert/Alert";

export function MessageDeleteModal({ open, handleOpen, messageId, onSuccess }) {
    const [deleteMessage, { isLoading }] = useDeleteMessageMutation();

    const handleDelete = async () => {
        try {
            await deleteMessage(messageId).unwrap();
            Alert("Xabar o'chirildi", "success");
            handleOpen();
            if (onSuccess) onSuccess();
        } catch (err) {
            Alert(err?.data?.message || "Xatolik yuz berdi", "error");
        }
    };

    return (
        <Dialog open={open} handler={handleOpen} size="sm" className="rounded-2xl">
            <DialogHeader>O'chirishni tasdiqlash</DialogHeader>
            <DialogBody>
                <Typography color="gray" className="font-normal">
                    Haqiqatan ham ushbu xabarni o'chirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.
                </Typography>
            </DialogBody>
            <DialogFooter className="gap-2">
                <Button variant="text" color="blue-gray" onClick={handleOpen} disabled={isLoading}>
                    Bekor qilish
                </Button>
                <Button variant="gradient" color="red" onClick={handleDelete} loading={isLoading}>
                    O'chirish
                </Button>
            </DialogFooter>
        </Dialog>
    );
}
