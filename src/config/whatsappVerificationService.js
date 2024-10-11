export const sendWhatsAppVerification = async (telefono) => {
    // Simulación de envío de verificación por WhatsApp
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (telefono) {
          console.log(`Mensaje de verificación enviado a: ${telefono}`);
          resolve(true);
        } else {
          reject('Número de teléfono no proporcionado.');
        }
      }, 2000); // Simula un retraso de 2 segundos
    });
  };
  