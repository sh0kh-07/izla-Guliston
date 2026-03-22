import React, { useState } from 'react';
import {
    Button,
    Typography,
    IconButton,
    Tooltip,
} from "@material-tailwind/react";
import { PlusIcon, PencilIcon, TrashIcon, PhoneIcon, GlobeAltIcon, EnvelopeIcon, AtSymbolIcon } from "@heroicons/react/24/outline";
import { useGetContactsQuery } from "../../../../../store/services/contact.api";
import { ContactModal } from "./ContactModal";
import { ContactDeleteModal } from "./ContactDeleteModal";
import Loading from "../../../../Other/UI/Loadings/Loading";

export const ContactList = ({ productId }) => {
    const { data: contacts, isLoading } = useGetContactsQuery(productId);
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);

    const handleEdit = (contact) => {
        setSelectedContact(contact);
        setOpenEdit(true);
    };

    const handleDelete = (contact) => {
        setSelectedContact(contact);
        setOpenDelete(true);
    };


    if (isLoading) return <Loading />;

    return (
        <div className="space-y-4 mt-8 pt-8 border-t border-gray-100">
            <div className="flex justify-between items-center">
                <Typography variant="small" color="blue-gray" className="font-bold opacity-50 uppercase tracking-wider">
                    Kontaktlar
                </Typography>
                <Button
                    size="sm"
                    variant="text"
                    color="blue"
                    className="flex items-center gap-2 rounded-xl py-2 px-3 hover:bg-blue-50"
                    onClick={() => setOpenAdd(true)}
                >
                    <PlusIcon className="h-4 w-4" /> Qo'shish
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {contacts?.data?.records?.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-blue-50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-blue-50 transition-colors">
                                <PhoneIcon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                                <Typography variant="small" color="blue-gray" className="font-bold truncate">
                                    {contact.value}
                                </Typography>
                                <Typography variant="small" color="gray" className="text-[10px] uppercase font-bold opacity-60">
                                    {contact.key}
                                </Typography>
                            </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Tooltip content="Tahrirlash">
                                <IconButton variant="text" size="sm" color="blue" onClick={() => handleEdit(contact)} className="rounded-lg">
                                    <PencilIcon className="h-4 w-4" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip content="O'chirish">
                                <IconButton variant="text" size="sm" color="red" onClick={() => handleDelete(contact)} className="rounded-lg">
                                    <TrashIcon className="h-4 w-4" />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                ))}
                {(!contacts?.data?.records || contacts?.data?.records?.length === 0) && (
                    <Typography variant="small" color="gray" className="italic opacity-60 col-span-2 text-center py-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                        Hech qanday kontakt qo'shilmagan
                    </Typography>
                )}
            </div>

            <ContactModal
                open={openAdd}
                handleOpen={() => setOpenAdd(false)}
                productId={productId}
            />
            {selectedContact && (
                <>
                    <ContactModal
                        open={openEdit}
                        handleOpen={() => setOpenEdit(false)}
                        productId={productId}
                        contact={selectedContact}
                    />
                    <ContactDeleteModal
                        open={openDelete}
                        handleOpen={() => setOpenDelete(false)}
                        contactId={selectedContact.id}
                    />
                </>
            )}
        </div>
    );
};
