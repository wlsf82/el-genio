# Use an official Node runtime as a parent image
FROM cypress/base:22.0.0

# Set the working directory in the container
WORKDIR /usr/src/server

# Copy package.json and package-lock.json
# This is done before installing dependencies to take advantage of Docker's cache layering
COPY package*.json ./

# Install any dependencies
RUN npm install

# Install Chromium for arm64 and emoji font
RUN apt-get update && \
  apt-get install -y chromium fonts-noto-color-emoji --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

# Create cypress directories with proper permissions
RUN mkdir -p cypress/e2e cypress/screenshots cypress/downloads cypress/videos && \
  chmod -R 777 cypress

# Bundle your app's source code inside the Docker image
COPY . .

# Set database environment variables
ENV DB_NAME=elgenio
ENV DB_USER=postgres
ENV DB_PASSWORD=postgres
ENV DB_HOST=postgres
ENV DB_PORT=5432

# Your app binds to port 3003, so use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3003

# Define the command to run your app using CMD which defines your runtime
CMD ["node", "index.js"]