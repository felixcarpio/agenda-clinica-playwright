FROM node:24-bookworm

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Evita mensajes interactivos durante instalaciones
ENV CI=true

# Copiamos primero las dependencias para aprovechar la caché de Docker
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm ci

# Instala Chromium, Firefox, WebKit y sus dependencias de Linux
RUN npx playwright install --with-deps

# Copia el proyecto completo
COPY . .

# Comando predeterminado
CMD ["npx", "playwright", "test"]