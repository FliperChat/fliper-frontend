"use client";

import { useTranslations } from "next-intl";
import styles from "./avatarModal.module.scss";
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { changeScrollActive } from "@/services/scroll";
import { RegAllStep } from "@/utils/types";

export default function AvatarModal({
  image,
  showModal,
  canvasRef,
  setShowModal,
  setData,
}: {
  image: HTMLImageElement | null;
  showModal: boolean;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setData: (blob: Blob | null) => void;
}) {
  const t = useTranslations("Auth.reg.stepTwo");

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // Draws an image on a canvas
  const drawImage = () => {
    if (!canvasRef.current || !image) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvasRef.current;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(
      image,
      position.x,
      position.y,
      image.width * scale,
      image.height * scale
    );
  };

  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const { width, height } = canvasRef.current;
    const scaleX = width / image.width;
    const scaleY = height / image.height;
    const initialScale = Math.min(scaleX, scaleY, 1); // No more than 1 (natural size)

    setScale(initialScale);
    setPosition({
      x: (width - image.width * initialScale) / 2,
      y: (height - image.height * initialScale) / 2,
    });
  }, [image]);

  useEffect(() => {
    drawImage();
  }, [image, position, scale]);

  // Start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });

    if (canvasRef.current) {
      canvasRef.current.style.cursor = "grabbing";
    }
  };

  // Stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);

    if (canvasRef.current) {
      canvasRef.current.style.cursor = "grab";
    }
  };

  // Moving the image
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Scaled image dimensions
    const imgWidth = image.width * scale;
    const imgHeight = image.height * scale;

    // New coordinates after dragging
    const newX = e.clientX - startPos.x;
    const newY = e.clientY - startPos.y;

    // Limit the X position (within the canvas)
    const minX = Math.min(0, canvasWidth - imgWidth); // Left edge
    const maxX = Math.min(0, imgWidth - canvasWidth); // Right edge
    const limitedX = Math.max(minX, Math.min(newX, maxX));

    // Limit the Y position (within the canvas)
    const minY = Math.min(0, canvasHeight - imgHeight); // Upper edge
    const maxY = Math.min(0, imgHeight - canvasHeight); // Lower edge
    const limitedY = Math.max(minY, Math.min(newY, maxY));

    // Set a new position subject to restrictions
    setPosition({
      x: limitedX,
      y: limitedY,
    });
  };

  // Scaling with the mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !image || !canvasRef.current) return;

    const { width, height } = canvasRef.current;
    const scaleX = width / image.width;
    const scaleY = height / image.height;

    const minScale = Math.min(scaleX, scaleY, 1); // Minimum scale (at least 20%)
    const maxScale = 3; // Maximum scale
    const scaleStep = Math.max(0.01, scale * 0.05); // 5% of the current scale, but not less than 0.01

    const newScale = Math.min(
      Math.max(scale + (e.deltaY > 0 ? -scaleStep : scaleStep), minScale),
      maxScale
    );

    // Adjusting the position to stay within the edges when zooming in/out
    const deltaScale = newScale / scale; // How many times the scale has changed
    const centerX = position.x + canvas.width / 2; // Center for X
    const centerY = position.y + canvas.height / 2; // Center by Y

    // Updating the position, taking into account the new scale
    const newPosX = centerX - (canvas.width / 2) * deltaScale;
    const newPosY = centerY - (canvas.height / 2) * deltaScale;

    // Limit the X and Y position (so that the image does not extend beyond the edges of the canvas)
    const imgWidth = image.width * newScale;
    const imgHeight = image.height * newScale;

    // Limit X position
    const minX = Math.min(0, canvas.width - imgWidth);
    const maxX = Math.max(0, imgWidth - canvas.width);

    // Limit the Y position
    const minY = Math.min(0, canvas.height - imgHeight);
    const maxY = Math.max(0, imgHeight - canvas.height);

    const limitedX = Math.max(minX, Math.min(newPosX, maxX));
    const limitedY = Math.max(minY, Math.min(newPosY, maxY));

    // Updating the position, taking into account the new scale
    setPosition({
      x: limitedX,
      y: limitedY,
    });

    setScale(newScale);
  };

  // Image cropping function
  const handleCrop = () => {
    if (!canvasRef.current || !image) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const cropCanvas = document.createElement("canvas");
    cropCanvas.width = 300; // Trimming size
    cropCanvas.height = 300;
    const cropCtx = cropCanvas.getContext("2d");
    if (!cropCtx) return;

    cropCtx.drawImage(
      canvasRef.current,
      (canvasRef.current.width - 300) / 2,
      (canvasRef.current.height - 300) / 2,
      300,
      300,
      0,
      0,
      300,
      300
    );

    cropCanvas.toBlob((blob) => {
      if (blob) {
        setData(blob);
        setShowModal(false);
        changeScrollActive();
      }
    }, "image/jpeg");
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <>
      {showModal && (
        <div className={styles.image_modal}>
          <div className={styles.image_modal_block}>
            <div onMouseDown={handleMouseDown} onWheel={handleWheel}>
              <canvas ref={canvasRef} width={300} height={300} />
            </div>
            <p className={styles.border}></p>
            <p className={styles.cropBtn}>
              <button onClick={handleCrop} className="button_bg">
                {t("crop")}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
