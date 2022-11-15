#Build the fragments-ui web app and serve it via parcel

FROM node:17.8.0 AS dependencies

WORKDIR /site

#0. package.json, package-lock.json
COPY package*.json ./

#1. npm install (clean install)
RUN npm ci 

FROM node:17.8.0 AS build

WORKDIR /site

COPY --from=dependencies /site /site
#1.5 copy all source files into the image file system
COPY . .

#2. npm run build
RUN npm run build

FROM nginx:1.22 AS deploy

COPY --from=build /site/dist /usr/share/nginx/html

EXPOSE 80


###############################################################################
# FROM nginx:1.22.0

# #setup node.js
# RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash \ 
# && apt-get update && apt-get install -y \
# build-essential \
# nodejs\
# && rm -fr /var/lib/apt/lists/*

# #Copy our source code in
# WORKDIR /usr/local/src/fragments-ui
# COPY . .

# #Build our site
# RUN npm ci
# RUN npm run build && \
#     cp -a ./dist/. /usr/share/nginx/html/
# #Copy the built site to the dir that nginx expects for static sites
# #Nginx has to work with pot 80
# EXPOSE 80

# FROM node:12

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# CMD ["npm","start"]
