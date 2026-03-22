import React from 'react';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography,
} from "@material-tailwind/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useDeleteContactMutation } from "../../../../../store/services/contact.api";
import { Alert } from "../../../../Other/UI/Alert/Alert";

export const ContactDeleteModal = ({ open, handleOpen, contactId }) => {
    const [deleteContact, { isLoading }] = useDeleteContactMutation();

    const handleDelete = async () => {
        try {
            await deleteContact(contactId).unwrap();
            Alert("Kontakt muvaffaqiyatli o'chirildi", "success");
            handleOpen();
        } catch (err) {
            Alert(err.data?.message || "Xatolik yuz berdi", "error");
        }
    };

    return (
        <Dialog open={open} handler={handleOpen} size="xs" className="rounded-2xl">
            <DialogHeader className="flex flex-col items-center pt-8">
                <div className="bg-red-50 p-4 rounded-full mb-4">
                    <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
                </div>
                <Typography variant="h4" color="blue-gray" className="font-bold text-center">
                    Ishonchingiz komilmi?
                </Typography>
            </DialogHeader>
            <DialogBody className="text-center px-8">
                <Typography className="font-normal text-gray-600">
                    Ushbu kontaktni o'chirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.
                </Typography>
            </DialogBody>
            <DialogFooter className="flex justify-center gap-3 pb-8">
                <Button variant="text" color="blue-gray" onClick={handleOpen} className="rounded-xl px-6">
                    Bekor qilish
                </Button>
                <Button
                    color="red"
                    variant="gradient"
                    onClick={handleDelete}
                    className="rounded-xl px-8 shadow-red-200"
                    loading={isLoading}
                >
                    O'chirish
                </Button>
            </DialogFooter>
        </Dialog>
    );
};
