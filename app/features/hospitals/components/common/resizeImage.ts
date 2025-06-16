export const resizeImage = (file: File, maxSize = 500): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) return;

      img.src = e.target.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = maxSize;
      canvas.height = maxSize;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 이미지를 canvas에 맞게 drawImage로 채워 넣기
      ctx.drawImage(img, 0, 0, maxSize, maxSize);

      canvas.toBlob((blob) => {
        if (blob) {
          const resizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(resizedFile);
        }
      }, file.type);
    };

    reader.readAsDataURL(file);
  });
};
