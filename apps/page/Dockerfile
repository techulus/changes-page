
FROM node:20-alpine

WORKDIR /app

COPY pnpm-lock.yaml ./
COPY package.json ./ # Copy root package.json if it contains workspace def

COPY pnpm-workspace.yaml ./

COPY apps/my-frontend/package.json ./apps/my-frontend/

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile

COPY . .

WORKDIR /app/apps/my-frontend
RUN pnpm run build # Or whatever your build command is

EXPOSE 3000

CMD ["pnpm", "start"] # Or "node dist/index.js", etc.
