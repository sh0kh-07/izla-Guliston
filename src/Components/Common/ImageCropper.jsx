import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Slider, Typography } from "@material-tailwind/react";
import { getCroppedImg } from '../../utils/canvasUtils';

export const ImageCropper = ({ open, handleClose, image, onCropComplete }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropChange = useCallback((crop) => {
        setCrop(crop);
    }, []);

    const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const onZoomChange = useCallback((zoom) => {
        setZoom(zoom);
    }, []);

    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImage = await getCroppedImg(
                image,
                croppedAreaPixels,
                rotation
            );
            onCropComplete(croppedImage);
            handleClose();
        } catch (e) {
            console.error(e);
        }
    }, [croppedAreaPixels, rotation, image, onCropComplete, handleClose]);

    return (
        <Dialog open={open} handler={handleClose} size="lg" className="rounded-3xl overflow-hidden max-h-[90vh]">
            <DialogHeader className="flex flex-col items-start gap-1 pb-0 shrink-0">
                <Typography variant="h4" color="blue-gray" className="font-bold">
                    Rasmni tahrirlash
                </Typography>
                <Typography variant="small" color="gray" className="font-normal">
                    Rasmni kerakli qismini tanlang ва yaqinlashtiring
                </Typography>
            </DialogHeader>
            <DialogBody className="h-[45vh] min-h-[300px] relative mt-4 bg-gray-50 flex-grow">
                <div className="absolute inset-0">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={16 / 9}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteCallback}
                        onZoomChange={onZoomChange}
                        onRotationChange={setRotation}
                    />
                </div>
            </DialogBody>
            <DialogFooter className="flex flex-col gap-4 p-6 bg-white border-t border-gray-100">
                <div className="w-full space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <Typography variant="small" color="blue-gray" className="font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-blue-500">
                                        <path d="M6 12a.75.75 0 0 1-.75-.75V6.75A2.25 2.25 0 0 1 7.5 4.5h4.5a.75.75 0 0 1 0 1.5H7.5a.75.75 0 0 0-.75.75v4.5A.75.75 0 0 1 6 12ZM18 12a.75.75 0 0 0 .75-.75V6.75A2.25 2.25 0 0 0 16.5 4.5h-4.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 0 .75.75ZM6 12a.75.75 0 0 0-.75.75v4.5A2.25 2.25 0 0 0 7.5 19.5h4.5a.75.75 0 0 0 0-1.5H7.5a.75.75 0 0 1-.75-.75v-4.5A.75.75 0 0 0 6 12ZM18 12a.75.75 0 0 1 .75.75v4.5A2.25 2.25 0 0 1 16.5 19.5h-4.5a.75.75 0 0 1 0-1.5h4.5a.75.75 0 0 0 .75-.75v-4.5A.75.75 0 0 1 18 12Z" />
                                    </svg>
                                    Yaqinlashtirish
                                </Typography>
                                <Typography variant="small" color="blue" className="font-bold bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                                    {Math.round(zoom * 100)}%
                                </Typography>
                            </div>
                            <div className="px-1 relative flex items-center h-6">
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.01}
                                    onChange={(e) => onZoomChange(parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none transition-all"
                                    style={{
                                        background: `linear-gradient(to right, #2196F3 0%, #2196F3 ${(zoom - 1) / (3 - 1) * 100}%, #E0E0E0 ${(zoom - 1) / (3 - 1) * 100}%, #E0E0E0 100%)`
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <Typography variant="small" color="blue-gray" className="font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-blue-500">
                                        <path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.919Z" clipRule="evenodd" />
                                    </svg>
                                    Burish
                                </Typography>
                                <Typography variant="small" color="blue" className="font-bold bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                                    {rotation}°
                                </Typography>
                            </div>
                            <div className="px-1 relative flex items-center h-6">
                                <input
                                    type="range"
                                    value={rotation}
                                    min={0}
                                    max={360}
                                    step={1}
                                    onChange={(e) => setRotation(parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none transition-all"
                                    style={{
                                        background: `linear-gradient(to right, #2196F3 0%, #2196F3 ${rotation / 360 * 100}%, #E0E0E0 ${rotation / 360 * 100}%, #E0E0E0 100%)`
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="text" color="red" onClick={handleClose} className="rounded-xl px-8 hover:bg-red-50">
                            Bekor qilish
                        </Button>
                        <Button color="blue" variant="gradient" onClick={showCroppedImage} className="rounded-xl px-10 shadow-blue-200 shadow-lg hover:shadow-xl active:scale-95 transition-all">
                            Tayyor
                        </Button>
                    </div>
                </div>
            </DialogFooter>
        </Dialog>
    );
};
