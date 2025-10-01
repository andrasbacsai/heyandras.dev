FROM oven/bun:latest AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY . .
RUN bun run build
FROM nginx:latest AS prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/public/live.html /usr/share/nginx/html/live.html
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
