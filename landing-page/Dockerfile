FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_CHAT_URL=https://chat.prodmate.dev/
ENV VITE_CHAT_URL=$VITE_CHAT_URL
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
