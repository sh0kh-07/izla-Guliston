import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { NavLink, useParams } from "react-router-dom";
import { useGetSubCategoriesQuery } from "../../../store/services/category.api";
import { useGetProductsQuery } from "../../../store/services/product.api";
import { useGetContactsQuery } from "../../../store/services/contact.api";
import Loading from "../../Other/UI/Loadings/Loading";
import { PhoneIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import EmptyData from "../../Other/UI/NoData/EmptyData";

export default function Page() {
    const { categoryId } = useParams();
    const { data: subCategoriesData, isLoading: subLoading } = useGetSubCategoriesQuery({ parentId: categoryId, page: 1 });
    const { data: productsData, isLoading: productsLoading } = useGetProductsQuery({ categoryId, page: 1 });

    const subCategories = subCategoriesData?.data?.records || [];
    const products = productsData?.data?.records || [];
    const product = products[0];

    const { data: contactsData, isLoading: contactsLoading } = useGetContactsQuery(product?.id, { skip: !product?.id });

    const hasSubCategories = subCategories.length > 0;
    const hasProducts = products.length > 0;

    if (subLoading || productsLoading || (hasProducts && contactsLoading)) return (
        <div className="container mx-auto pt-28">
            <Loading />
        </div>
    )

    if (!hasSubCategories && hasProducts && product) {
        // Render Product Detail directly


        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-32 pb-12">
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <Card className="overflow-hidden border-0 shadow-xl rounded-2xl">
                            <div className="relative h-[300px] sm:h-[400px] md:h-[500px]">
                                <img
                                    src={`https://dev.ithubs.uz/search/${product.image}`}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white">
                                    <Typography variant="h1" className="font-bold text-2xl sm:text-4xl md:text-5xl mb-2">
                                        {product.title}
                                    </Typography>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border-0 shadow-lg rounded-2xl">
                                <CardBody className="p-6 sm:p-8">
                                    <Typography variant="h4" className="font-bold text-gray-800 mb-6">
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
                                            className="mt-6 flex items-center justify-center gap-3 bg-gray-900 shadow-md hover:shadow-lg rounded-xl transition-all active:scale-95 w-full sm:w-auto"
                                        >
                                            <GlobeAltIcon className="h-5 w-5" /> Xaritada ko'rish
                                        </Button>
                                    )}
                                </CardBody>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card className="border-0 shadow-lg sticky top-24 rounded-2xl overflow-hidden">
                                <div className="bg-blue-600 p-6 text-white text-center">
                                    <Typography variant="h5" className="font-bold">
                                        Kontaktlar
                                    </Typography>
                                </div>
                                <CardBody className="p-6 space-y-4">
                                    {contactsData?.data?.records.map((contact) => (
                                        <div key={contact.id} className="group">
                                            <Typography variant="small" className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1 ml-1">
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
                                    {contactsData?.data?.records.length === 0 && (
                                        <div className="text-center py-8">
                                            <Typography className="text-gray-400 italic">
                                                Kontaktlar mavjud emas
                                            </Typography>
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
    return (
        <div className="min-h-screen bg-gradient-to-br pt-32 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                    {subCategories.map((item) => (
                        <NavLink to={`/category/${item.id}`} key={item.id}>
                            <Card
                                className="group relative overflow-hidden cursor-pointer transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border-0"
                            >
                                <div className="absolute inset-0">
                                    <img
                                        src={`https://dev.ithubs.uz/search/${item.image}`}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-[#2626267c] group-hover:opacity-90 group-hover:bg-[#0000000f] transition-opacity duration-500" />
                                </div>
                                <CardBody className="relative z-10 text-left p-4 sm:p-8 min-h-[150px] xs:min-h-[180px] sm:min-h-[240px] md:min-h-[280px] flex flex-col items-start justify-end">
                                    <Typography
                                        variant="h3"
                                        className="font-bold !text-white relative z-[1000] mb-2 text-shadow-lg text-[20px] xs:text-lg sm:text-xl lg:text-2xl"
                                    >
                                        {item.title}
                                    </Typography>
                                </CardBody>
                            </Card>
                        </NavLink>
                    ))}
                </div>
                {subCategories.length === 0 && hasProducts === false && (
                    <EmptyData text={'Hozircha hech narsa topilmadi'} />
                )}
            </div>
        </div>
    );
}