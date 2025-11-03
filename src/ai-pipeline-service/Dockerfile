# Container for the AI content generation pipeline
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src/ai-pipeline-service ./src/ai-pipeline-service

ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "src/ai-pipeline-service/server.js"]
