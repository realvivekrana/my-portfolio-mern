import { useCallback, useEffect, useRef, useState } from 'react';

import { FaCheck, FaTimes, FaSearchPlus, FaSearchMinus, FaUndo } from 'react-icons/fa';

/*
|--------------------------------------------------------------------------
| ImageCropModal
|--------------------------------------------------------------------------
|
| Cloudinary upload se PEHLE, browser me hi crop + zoom + JPEG-compress
| kar deta hai. Koi extra npm package nahi — sirf <canvas>.
|
| Props:
|   file        — File/Blob jisse crop karna hai (image/*)
|   aspectRatio — width/height ratio (e.g. 16/9, 1 for square, 4/3).
|                 null pass karo to free-form crop ke liye.
|   maxOutputWidth  — final image ki max width (px). Default 1600.
|   quality         — JPEG quality 0-1. Default 0.85.
|   onCancel    — () => void
|   onConfirm   — (croppedFile: File, previewUrl: string) => void
|
| Output hamesha JPEG File hota hai (compressed) — seedha FormData me
| daal ke Cloudinary/multer route pe bhej sakte ho.
|
*/

function ImageCropModal({
  file,
  aspectRatio = null,
  maxOutputWidth = 1600,
  quality = 0.85,
  onCancel,
  onConfirm,
}) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  const [imgLoaded, setImgLoaded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  // Fixed on-screen crop stage size — actual output is scaled from this
  const STAGE_W = 480;
  const STAGE_H = aspectRatio ? Math.round(STAGE_W / aspectRatio) : 360;

  /*
  |--------------------------------------------------------------------------
  | Load image from File
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!file) return undefined;

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      imgRef.current = img;
      setImgLoaded(true);

      // Fit image to cover the stage by default
      const coverScale = Math.max(STAGE_W / img.width, STAGE_H / img.height);
      setZoom(coverScale);
      setOffset({
        x: (STAGE_W - img.width * coverScale) / 2,
        y: (STAGE_H - img.height * coverScale) / 2,
      });
    };

    img.onerror = () => setError('Yeh image load nahi ho payi. Dusri file try karo.');

    img.src = url;

    return () => URL.revokeObjectURL(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  /*
  |--------------------------------------------------------------------------
  | Redraw preview canvas whenever zoom/offset changes
  |--------------------------------------------------------------------------
  */

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;

    if (!canvas || !img) return;

    canvas.width = STAGE_W;
    canvas.height = STAGE_H;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, STAGE_W, STAGE_H);
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, STAGE_W, STAGE_H);

    ctx.drawImage(
      img,
      offset.x,
      offset.y,
      img.width * zoom,
      img.height * zoom
    );
  }, [zoom, offset, STAGE_H]);

  useEffect(() => {
    draw();
  }, [draw]);

  /*
  |--------------------------------------------------------------------------
  | Drag to pan
  |--------------------------------------------------------------------------
  */

  const clampOffset = (nextOffset, nextZoom) => {
    const img = imgRef.current;
    if (!img) return nextOffset;

    const w = img.width * nextZoom;
    const h = img.height * nextZoom;

    const minX = STAGE_W - w;
    const minY = STAGE_H - h;

    return {
      x: Math.min(0, Math.max(minX, nextOffset.x)),
      y: Math.min(0, Math.max(minY, nextOffset.y)),
    };
  };

  const handlePointerDown = (event) => {
    setDragging(true);
    setDragStart({
      x: event.clientX - offset.x,
      y: event.clientY - offset.y,
    });
  };

  const handlePointerMove = (event) => {
    if (!dragging) return;

    const next = {
      x: event.clientX - dragStart.x,
      y: event.clientY - dragStart.y,
    };

    setOffset(clampOffset(next, zoom));
  };

  const handlePointerUp = () => setDragging(false);

  /*
  |--------------------------------------------------------------------------
  | Zoom controls
  |--------------------------------------------------------------------------
  */

  const applyZoom = (nextZoom) => {
    const img = imgRef.current;
    if (!img) return;

    const minZoom = Math.max(STAGE_W / img.width, STAGE_H / img.height);
    const clamped = Math.min(4, Math.max(minZoom, nextZoom));

    // Zoom around stage center so it feels natural
    const cx = STAGE_W / 2;
    const cy = STAGE_H / 2;
    const imgCx = (cx - offset.x) / zoom;
    const imgCy = (cy - offset.y) / zoom;

    const nextOffset = {
      x: cx - imgCx * clamped,
      y: cy - imgCy * clamped,
    };

    setZoom(clamped);
    setOffset(clampOffset(nextOffset, clamped));
  };

  const handleReset = () => {
    const img = imgRef.current;
    if (!img) return;

    const coverScale = Math.max(STAGE_W / img.width, STAGE_H / img.height);
    setZoom(coverScale);
    setOffset({
      x: (STAGE_W - img.width * coverScale) / 2,
      y: (STAGE_H - img.height * coverScale) / 2,
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Confirm — render final crop to an offscreen canvas, compress to JPEG
  |--------------------------------------------------------------------------
  */

  const handleConfirm = async () => {
    const img = imgRef.current;
    if (!img) return;

    setProcessing(true);
    setError('');

    try {
      const outputW = Math.min(maxOutputWidth, STAGE_W * 4);
      const outputH = Math.round(outputW * (STAGE_H / STAGE_W));
      const scaleFactor = outputW / STAGE_W;

      const outCanvas = document.createElement('canvas');
      outCanvas.width = outputW;
      outCanvas.height = outputH;

      const ctx = outCanvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, outputW, outputH);

      ctx.drawImage(
        img,
        offset.x * scaleFactor,
        offset.y * scaleFactor,
        img.width * zoom * scaleFactor,
        img.height * zoom * scaleFactor
      );

      const blob = await new Promise((resolve) =>
        outCanvas.toBlob(resolve, 'image/jpeg', quality)
      );

      if (!blob) {
        throw new Error('Compress fail ho gaya.');
      }

      const originalName = (file?.name || 'image').replace(/\.[^/.]+$/, '');
      const croppedFile = new File([blob], `${originalName}-cropped.jpg`, {
        type: 'image/jpeg',
      });

      const previewUrl = URL.createObjectURL(blob);

      onConfirm(croppedFile, previewUrl);
    } catch (err) {
      console.error('Crop Confirm Error:', err);
      setError('Image process karne me error aayi. Dobara try karo.');
    } finally {
      setProcessing(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl dark:bg-gray-900 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Crop &amp; Adjust Image
          </h3>

          <button
            type="button"
            onClick={onCancel}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            aria-label="Cancel"
          >
            <FaTimes />
          </button>
        </div>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Drag karke position set karo, zoom se crop area adjust karo.
        </p>

        {error && (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </div>
        )}

        <div
          ref={containerRef}
          className="relative mt-4 flex items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-950 dark:border-gray-800"
          style={{ height: STAGE_H, touchAction: 'none' }}
        >
          {!imgLoaded && (
            <div className="text-sm text-gray-400">Image load ho rahi hai...</div>
          )}

          <canvas
            ref={canvasRef}
            width={STAGE_W}
            height={STAGE_H}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            className={`${imgLoaded ? 'block' : 'hidden'} cursor-move`}
          />

          {/* Crop guide border */}
          <div className="pointer-events-none absolute inset-0 border-2 border-white/70" />
        </div>

        {/* Zoom controls */}
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => applyZoom(zoom - 0.15)}
            disabled={!imgLoaded}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Zoom out"
          >
            <FaSearchMinus className="text-xs" />
          </button>

          <input
            type="range"
            min="0.1"
            max="4"
            step="0.01"
            value={zoom}
            onChange={(event) => applyZoom(Number(event.target.value))}
            disabled={!imgLoaded}
            className="flex-1 accent-gray-900 dark:accent-white"
          />

          <button
            type="button"
            onClick={() => applyZoom(zoom + 0.15)}
            disabled={!imgLoaded}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Zoom in"
          >
            <FaSearchPlus className="text-xs" />
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={!imgLoaded}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Reset"
            title="Reset"
          >
            <FaUndo className="text-xs" />
          </button>
        </div>

        {/* Actions */}
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!imgLoaded || processing}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            <FaCheck className="text-xs" />
            {processing ? 'Processing...' : 'Use This Image'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageCropModal;