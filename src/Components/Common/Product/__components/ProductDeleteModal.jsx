import React from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography,
} from "@material-tailwind/react";
import { TrashIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useDeleteProductMutation } from "../../../../store/services/product.api";
import { Alert } from "../../../Other/UI/Alert/Alert";

export function ProductDeleteModal({ open, handleOpen, productId }) {
    const [deleteProduct, { isLoading }] = useDeleteProductMutation();

    const handleDelete = async () => {
        try {
            await deleteProduct(productId).unwrap();
            Alert("Mahsulot muvaffaqiyatli o'chirildi", "success");
            handleOpen();
        } catch (err) {
            Alert(err.data?.message || "Xatolik yuz berdi", "error");
        }
    };

    return (
        <Dialog open={open} handler={handleOpen} size="xs" className="rounded-2xl">
            <DialogHeader className="flex flex-col items-center pt-8 pb-4">
                <div className="p-4 bg-red-50 rounded-full mb-4">
                    <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
                </div>
                <Typography variant="h4" color="blue-gray" className="text-center font-bold">
                    Mahsulotni o'chirish
                </Typography>
            </DialogHeader>
            <DialogBody className="px-8 py-2 text-center">
                <Typography color="gray" className="font-medium">
                    Haqiqatdan ham ushbu mahsulotni o'chirib tashlamoqchimisiz? Bu amalni qaytarib bo'lmaydi.
                </Typography>
            </DialogBody>
            <DialogFooter className="flex justify-center gap-3 pb-8 pt-6">
                <Button
                    variant="text"
                    color="blue-gray"
                    onClick={handleOpen}
                    className="px-6 rounded-xl"
                    disabled={isLoading}
                >
                    Bekor qilish
                </Button>
                <Button
                    variant="gradient"
                    color="red"
                    onClick={handleDelete}
                    loading={isLoading}
                    className="flex items-center gap-2 px-6 rounded-xl shadow-md hover:shadow-lg"
                >
                    <TrashIcon className="h-4 w-4" /> O'chirish
                </Button>
            </DialogFooter>
        </Dialog>
    );
}
