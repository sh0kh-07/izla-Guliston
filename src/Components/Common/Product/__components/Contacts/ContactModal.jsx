import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Typography,
} from "@material-tailwind/react";
import { useCreateContactMutation, useUpdateContactMutation } from "../../../../../store/services/contact.api";
import { Alert } from "../../../../Other/UI/Alert/Alert";

export const ContactModal = ({ open, handleOpen, productId, contact = null }) => {
    const [createContact, { isLoading: isCreating }] = useCreateContactMutation();
    const [updateContact, { isLoading: isUpdating }] = useUpdateContactMutation();

    const [formData, setFormData] = useState({
        key: '',
        value: '+998',
    });

    useEffect(() => {
        if (contact) {
            setFormData({
                key: contact.key,
                value: contact.value,
            });
        } else {
            setFormData({
                key: '',
                value: '+998',
            });
        }
    }, [contact, open]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.value) {
            Alert("Iltimos, qiymatni kiriting", "error");
            return;
        }

        try {
            if (contact) {
                await updateContact({ id: contact.id, ...formData }).unwrap();
                Alert("Kontakt muvaffaqiyatli tahrirlandi", "success");
            } else {
                await createContact({ productId, ...formData }).unwrap();
                Alert("Kontakt muvaffaqiyatli qo'shildi", "success");
            }
            handleOpen();
        } catch (err) {
            Alert(err.data?.message || "Xatolik yuz berdi", "error");
        }
    };

    return (
        <Dialog open={open} handler={handleOpen} size="xs" className="rounded-2xl">
            <DialogHeader className="flex flex-col items-start">
                <Typography variant="h4" color="blue-gray" className="font-bold">
                    {contact ? "Kontaktni tahrirlash" : "Yangi kontakt qo'shish"}
                </Typography>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
                <DialogBody className="space-y-4">
                    <div className="w-full">
                        <Input
                            label="Turi"
                            placeholder="Masalan: Telefon, Telegram..."
                            value={formData.key}
                            onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
                        />
                    </div>
                    <Input
                        label="Qiymat"
                        value={formData.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                        placeholder="+998..."
                    />
                </DialogBody>
                <DialogFooter className="gap-2">
                    <Button variant="text" color="red" onClick={handleOpen} className="rounded-xl">
                        Bekor qilish
                    </Button>
                    <Button
                        color="blue"
                        variant="gradient"
                        type="submit"
                        className="rounded-xl px-8"
                        loading={isCreating || isUpdating}
                    >
                        Saqlash
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
};
