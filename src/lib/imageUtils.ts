const MAX_DIMENSION = 1920;

export const downscaleImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      if (!event.target?.result) {
        return reject(new Error("Failed to read file."));
      }
      const img = new Image();
      img.src = event.target.result as string;

      img.onload = () => {
        if (img.width <= MAX_DIMENSION && img.height <= MAX_DIMENSION) {
          resolve(img.src);
          return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error("Could not get canvas context"));

        let { width, height } = img;
        if (width > height) {
          if (width > MAX_DIMENSION) {
            height *= MAX_DIMENSION / width;
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width *= MAX_DIMENSION / height;
            height = MAX_DIMENSION;
          }
        }
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};