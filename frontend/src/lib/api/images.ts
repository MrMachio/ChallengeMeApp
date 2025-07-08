// Имитация задержки загрузки
const simulateUpload = async (file: File) => {
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));
  // Для демонстрации возвращаем URL созданный из файла
  return URL.createObjectURL(file);
};

export const imagesApi = {
  upload: async (file: File): Promise<string> => {
    // В реальном API здесь будет загрузка файла на сервер
    // Для демо версии создаем URL из загруженного файла
    return simulateUpload(file);
  }
}; 