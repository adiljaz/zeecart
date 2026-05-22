import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedFile } from '../utils/cropImage';

const ImageCropperModal = ({ image, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onCropAreaComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDone = async () => {
    try {
      const croppedFile = await getCroppedFile(image, croppedAreaPixels);
      onCropComplete(croppedFile);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4">
      <div className="bg-card-bg rounded-2xl w-full max-w-2xl overflow-hidden border border-border-green shadow-2xl">
        <div className="p-4 border-b border-border-green flex justify-between items-center bg-accent-green/5">
          <h3 className="text-xl font-playfair text-text-dark">Crop Your Product Image</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
        
        <div className="relative h-96 w-full bg-black/50">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={4 / 5}
            onCropChange={onCropChange}
            onCropComplete={onCropAreaComplete}
            onZoomChange={onZoomChange}
            objectFit="contain"
            showGrid={false}
          />
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Zoom Control</span>
            <input
              type="range"
              value={zoom}
              min={0.8}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-accent-green h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-6 py-3 rounded-lg border border-border-green text-text-dark hover:bg-white/5 transition text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Fetch original file and complete
                fetch(image)
                  .then(res => res.blob())
                  .then(blob => {
                    const file = new File([blob], 'original_image.jpg', { type: 'image/jpeg' });
                    onCropComplete(file);
                  });
              }}
              className="flex-1 py-3 rounded-lg border border-accent-green text-accent-green hover:bg-accent-green/10 transition text-sm font-semibold"
            >
              Use Original
            </button>
            <button
              onClick={handleDone}
              className="flex-1 py-3 rounded-lg bg-accent-green text-white font-semibold hover:bg-green-600 shadow-lg shadow-accent-green/20 transition text-sm"
            >
              Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
