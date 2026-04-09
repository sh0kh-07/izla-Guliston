import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import { useGetProductQuery } from "../../../store/services/product.api";
import { useGetContactsQuery } from "../../../store/services/contact.api";
import Loading from "../../Other/UI/Loadings/Loading";
import { PhoneIcon, GlobeAltIcon } from "@heroicons/react/24/outline";

export default function ProductDetail() {
    const { productId } = useParams();
    const { data: productResponse, isLoading: productLoading } = useGetProductQuery(productId);
    const product = productResponse?.product;
    const { data: contactsData, isLoading: contactsLoading } = useGetContactsQuery(product?.id, { skip: !product?.id });

    if (productLoading) return (
        <div className="container mx-auto pt-28">
            <Loading />
        </div>
    );

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-32">
                <Typography variant="h4" color="blue-gray">Mahsulot topilmadi</Typography>
            </div>
        );
    }

    if (contactsLoading) return (
        <div className="container mx-auto pt-28">
            <Loading />
        </div>
    );

    const contacts = contactsData?.data?.records || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-[100px] pb-12">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="mb-2">
                    <Card className="overflow-hidden border-0 shadow-xl rounded-2xl">
                        <div className="relative h-[300px] sm:h-[400px] md:h-[500px]">
                            {product.image && (
                                <img
                                    src={`https://dev.izlaguliston.uz/${product.image}`}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white">
                                <Typography variant="h1" className="font-bold text-2xl sm:text-4xl md:text-5xl mb-2">
                                    {product.title}
                                </Typography>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                    <div className="space-y-6">
                        <Card className="border-0 shadow-lg sticky top-24 rounded-2xl overflow-hidden">
                            <div className="bg-blue-600 p-6 text-white text-center">
                                <Typography variant="h5" className="font-bold">
                                    Kontaktlar
                                </Typography>
                            </div>
                            <CardBody className="p-6 space-y-4">
                                {contacts.map((contact) => (
                                    <div key={contact.id} className="group">
                                        <Typography variant="small" className="text-black text-[15px] uppercase font-bold tracking-widest mb-1 ml-1">
                                            {contact.key}
                                        </Typography>
                                        <a
                                            href={`tel:${contact.value}`}
                                            className="w-full bg-gray-50 hover:bg-white border border-gray-100 group-hover:border-blue-500 group-hover:text-blue-600 text-gray-800 py-4 px-6 rounded-2xl transition-all duration-300 flex items-center gap-4 shadow-none hover:shadow-xl hover:-translate-y-1 normal-case text-base no-underline"
                                        >
                                            <div className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-blue-50 transition-colors text-blue-gray-900 group-hover:text-blue-600">
                                                <PhoneIcon className="h-5 w-5" />
                                            </div>
                                            <span className="font-bold truncate">{contact.value}</span>
                                        </a>
                                    </div>
                                ))}
                                {contacts.length === 0 && (
                                    <div className="text-center py-8">
                                        <Typography className="text-gray-400 italic">
                                            Kontaktlar mavjud emas
                                        </Typography>
                                    </div>
                                )}
                            </CardBody>
                        </Card>
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-0 shadow-lg rounded-2xl">
                            <CardBody className="p-6 sm:p-8">
                                {product.address && (
                                    <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <div>
                                            <Typography variant="small" className="font-bold text-blue-900 uppercase tracking-wider mb-1">
                                                Manzil
                                            </Typography>
                                            <Typography className="text-gray-800 font-medium">
                                                {product.address}
                                            </Typography>
                                        </div>
                                    </div>
                                )}

                                {product.addressUrl && (
                                    <Button
                                        onClick={() => window.open(product.addressUrl, '_blank')}
                                        className="mt-2 mb-2 flex items-center justify-center gap-3 bg-gray-900 shadow-md hover:shadow-lg rounded-xl transition-all active:scale-95 w-full sm:w-auto"
                                    >
                                        <GlobeAltIcon className="h-5 w-5" /> Xaritada ko'rish
                                    </Button>
                                )}
                                <Typography variant="h4" className="font-bold text-gray-800 mb-">
                                    Ma'lumotlar
                                </Typography>

                                {product.note && (
                                    <div className="mb-8">
                                        <div
                                            className="prose prose-blue max-w-none text-gray-700 leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: product.note }}
                                        />
                                    </div>
                                )}

                            </CardBody>
                        </Card>
                    </div>


                </div>
            </div>
        </div>
    );
}
