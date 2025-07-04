// Имитация задержки загрузки
const simulateUpload = async () => {
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300));
  return `/images/challenges/default${Math.floor(Math.random() * 5) + 1}.jpg`;
};

export const imagesApi = {
  upload: async (file: File): Promise<string> => {
    // В реальном API здесь будет загрузка файла на сервер
    return simulateUpload();
  }
}; 