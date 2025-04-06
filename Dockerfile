# Build stage
FROM node:18-alpine as build-stage

# Set working directory
WORKDIR /app

# Install dependencies required for esbuild
RUN apk add --no-cache python3 make g++

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application with correct base URL for Digital Ocean
ENV NODE_ENV=production
ENV DEPLOY_ENV=DIGITAL_OCEAN
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Production stage
FROM nginx:stable-alpine as production-stage

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 