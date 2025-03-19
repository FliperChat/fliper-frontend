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

export default function AvatarModal({
  image,
  showModal,
  canvasRef,
  setShowModal,
  setFormData,
}: {
  image: HTMLImageElement | null;
  showModal: boolean;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  setFormData: Dispatch<SetStateAction<any>>;
}) {
  const t = useTranslations("Auth.reg.stepTwo");

  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // Рисует изображение на canvas
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
    const initialScale = Math.min(scaleX, scaleY, 1); // Не больше 1 (натуральный размер)

    setScale(initialScale);
    setPosition({
      x: (width - image.width * initialScale) / 2,
      y: (height - image.height * initialScale) / 2,
    });
  }, [image]);

  useEffect(() => {
    drawImage();
  }, [image, position, scale]);

  // Начало перетаскивания
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - position.x, y: e.clientY - position.y });

    if (canvasRef.current) {
      canvasRef.current.style.cursor = "grabbing";
    }
  };

  // Остановка перетаскивания
  const handleMouseUp = () => {
    setIsDragging(false);

    if (canvasRef.current) {
      canvasRef.current.style.cursor = "grab";
    }
  };

  // Перемещение изображения
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Размеры изображения с учётом масштаба
    const imgWidth = image.width * scale;
    const imgHeight = image.height * scale;

    // Новые координаты после перетаскивания
    const newX = e.clientX - startPos.x;
    const newY = e.clientY - startPos.y;

    // Ограничиваем позицию по X (в пределах холста)
    const minX = Math.min(0, canvasWidth - imgWidth); // Левый край
    const maxX = Math.min(0, imgWidth - canvasWidth); // Правый край
    const limitedX = Math.max(minX, Math.min(newX, maxX));

    // Ограничиваем позицию по Y (в пределах холста)
    const minY = Math.min(0, canvasHeight - imgHeight); // Верхний край
    const maxY = Math.min(0, imgHeight - canvasHeight); // Нижний край
    const limitedY = Math.max(minY, Math.min(newY, maxY));

    // Устанавливаем новую позицию с учётом ограничений
    setPosition({
      x: limitedX,
      y: limitedY,
    });
  };

  // Масштабирование с помощью колесика мыши
  const handleWheel = (e: React.WheelEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !image || !canvasRef.current) return;

    const { width, height } = canvasRef.current;
    const scaleX = width / image.width;
    const scaleY = height / image.height;

    const minScale = Math.min(scaleX, scaleY, 1); // Минимальный масштаб (не менее 20%)
    const maxScale = 3; // Максимальный масштаб
    const scaleStep = Math.max(0.01, scale * 0.05); // 5% от текущего масштаба, но не менее 0.01

    const newScale = Math.min(
      Math.max(scale + (e.deltaY > 0 ? -scaleStep : scaleStep), minScale),
      maxScale
    );

    // Корректировка позиции для того, чтобы не выходить за края при увеличении/уменьшении
    const deltaScale = newScale / scale; // Во сколько раз изменился масштаб
    const centerX = position.x + canvas.width / 2; // Центр по X
    const centerY = position.y + canvas.height / 2; // Центр по Y

    // Обновляем позицию, учитывая новый масштаб
    const newPosX = centerX - (canvas.width / 2) * deltaScale;
    const newPosY = centerY - (canvas.height / 2) * deltaScale;

    // Ограничиваем позицию по X и Y (чтобы изображение не выходило за края канваса)
    const imgWidth = image.width * newScale;
    const imgHeight = image.height * newScale;

    // Ограничиваем позицию по X
    const minX = Math.min(0, canvas.width - imgWidth);
    const maxX = Math.max(0, imgWidth - canvas.width);

    // Ограничиваем позицию по Y
    const minY = Math.min(0, canvas.height - imgHeight);
    const maxY = Math.max(0, imgHeight - canvas.height);

    let limitedX = Math.max(minX, Math.min(newPosX, maxX));
    let limitedY = Math.max(minY, Math.min(newPosY, maxY));

    // Обновляем позицию, учитывая новый масштаб
    setPosition({
      x: limitedX,
      y: limitedY,
    });

    setScale(newScale);
  };

  // Функция обрезки изображения
  const handleCrop = () => {
    if (!canvasRef.current || !image) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const cropCanvas = document.createElement("canvas");
    cropCanvas.width = 300; // Размер обрезки
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
        setFormData((prev: any) => ({
          ...prev,
          image: blob,
        }));
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
