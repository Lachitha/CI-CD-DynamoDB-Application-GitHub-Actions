FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
COPY . .
EXPOSE 443 
 
CMD ["npm", "start"]

