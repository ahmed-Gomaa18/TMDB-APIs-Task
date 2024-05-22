FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .


RUN npx prisma generate

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 8080

# Define the command to run the application
CMD ["/usr/src/app/wait-for-db.sh", "npm", "run", "start:prod"]