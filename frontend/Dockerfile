FROM node:18

WORKDIR /app

# Copy package.json first to install dependencies (cache)
COPY package.json package-lock.json* ./
RUN npm install

# Copy rest
COPY . .

EXPOSE 5173

# Run Vite dev server and bind to 0.0.0.0 so it's reachable from host
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
