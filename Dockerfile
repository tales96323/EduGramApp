# Use uma imagem Node para executar a app (ajuste node:18 para sua versão)
FROM node:18

WORKDIR /usr/src/app

# Copia package.json e instala dependências
COPY package.json package-lock.json* ./ 
RUN npm ci --prefer-offline --no-audit --progress=false

# Copia o resto da aplicação
COPY . .

# Exponha portas comuns do Expo/React Native (ajuste se necessário)
EXPOSE 19000 19001 19002 8081

# Comando para iniciar a app (ajuste se o package.json usar outro script)
CMD ["npm", "start"]