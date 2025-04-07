# Use an official Node runtime as a parent image
FROM cypress/base:22.0.0

# Set the working directory in the container
WORKDIR /usr/src/server

# Copy package.json and package-lock.json
# This is done before installing dependencies to take advantage of Docker's cache layering
COPY package*.json ./

# Install any dependencies
RUN npm install

# Install Chromium for arm64
RUN apt-get update && \
  apt-get install -y chromium --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

# Bundle your app's source code inside the Docker image
COPY . .

# Your app binds to port 3003, so use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3003

# Define the command to run your app using CMD which defines your runtime
CMD ["npm", "run", "dev"]