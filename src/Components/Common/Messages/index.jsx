import React, { useState } from "react";
import { Typography, Button, Card, CardBody } from "@material-tailwind/react";
import { TrashIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useGetMessagesQuery } from "../../../store/services/messages.api";
import { MessageDeleteModal } from "./__components/MessageDeleteModal";
import Loading from "../../Other/UI/Loadings/Loading";
import EmptyData from "../../Other/UI/NoData/EmptyData";

export default function Messages() {
    const [page, setPage] = useState(1);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const { data, isLoading, isError, refetch } = useGetMessagesQuery(page);

    const messages = data?.data?.records || data?.data || data || [];
    const meta = data?.data?.meta || null;
    const lastPage = meta?.lastPage || meta?.last_page || 1;
    const total = meta?.total || (Array.isArray(messages) ? messages.length : 0);

    const handleOpenDelete = (id) => {
        setSelectedId(id);
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
        setSelectedId(null);
    };

    if (isLoading) return <Loading />;

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <Typography variant="h3" color="blue-gray" className="font-bold">
                    Xabarlar
                </Typography>
                <Typography variant="small" color="gray" className="font-medium">
                    Jami: {total} ta xabar
                </Typography>
            </div>

            {isError ? (
                <EmptyData text="Ma'lumotlarni yuklashda xatolik yuz berdi" />
            ) : !Array.isArray(messages) || messages.length === 0 ? (
                <EmptyData text="Hozircha hech qanday xabar yo'q" />
            ) : (
                <>
                    {/* Messages list */}
                    <div className="flex flex-col gap-4">
                        {messages.map((msg, index) => (
                            <Card
                                key={msg.id || index}
                                className="border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl"
                            >
                                <CardBody className="p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        {/* Info */}
                                        <div className="flex flex-col gap-2 flex-1">
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Ism:</span>
                                                    <Typography variant="h6" color="blue-gray" className="font-bold">
                                                        {msg.full_name || msg.name || "—"}
                                                    </Typography>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Telefon:</span>
                                                    <Typography variant="small" className="font-semibold text-blue-600">
                                                        {msg.phone || "—"}
                                                    </Typography>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-2 mt-1">
                                                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-0.5">Xabar:</span>
                                                <Typography variant="paragraph" className="text-gray-700 leading-relaxed">
                                                    {msg.note || msg.message || "—"}
                                                </Typography>
                                            </div>

                                            {msg.createdAt && (
                                                <Typography variant="small" className="text-gray-400 mt-1">
                                                    {new Date(msg.createdAt).toLocaleString("uz-UZ")}
                                                </Typography>
                                            )}
                                        </div>

                                        {/* Delete Button */}
                                        <Button
                                            size="sm"
                                            color="red"
                                            className="p-2.5 rounded-xl transition-transform active:scale-90 flex-shrink-0"
                                            onClick={() => handleOpenDelete(msg.id)}
                                            title="O'chirish"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {lastPage > 1 && (
                        <div className="flex justify-center items-center gap-3 mt-8">
                            <Button
                                variant="outlined"
                                size="sm"
                                className="flex items-center gap-1 border-gray-300 text-gray-700 rounded-lg"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                <ChevronLeftIcon className="h-4 w-4" />
                                Oldingi
                            </Button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all duration-200
                                            ${p === page
                                                ? "bg-blue-600 text-white shadow-md"
                                                : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>

                            <Button
                                variant="outlined"
                                size="sm"
                                className="flex items-center gap-1 border-gray-300 text-gray-700 rounded-lg"
                                disabled={page === lastPage}
                                onClick={() => setPage(page + 1)}
                            >
                                Keyingi
                                <ChevronRightIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </>
            )}

            {/* Delete Modal */}
            <MessageDeleteModal
                open={openDelete}
                handleOpen={handleCloseDelete}
                messageId={selectedId}
                onSuccess={refetch}
            />
        </div>
    );
}
