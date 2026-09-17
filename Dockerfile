FROM node:22-alpine AS development

WORKDIR /usr/src/app

RUN mkdir -p ./apps/web ./apps/server ./shared

COPY ./package*.json ./
COPY ./apps/web/package*.json ./apps/web/
COPY ./apps/server/package*.json ./apps/server/
COPY ./shared/package*.json ./shared/

RUN npm ci

COPY . .

RUN npm run build --workspace=shared

EXPOSE 3001
EXPOSE 5173

CMD ["npm", "run", "start:dev"]
