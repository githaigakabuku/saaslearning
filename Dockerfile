#docker file are recepies of buildding docker images
#from my undestanding there first step 
#choose a base image 
#it lika a small os to run the program sand since we are in node we choose 
#we use node:18 = node.kjs version 18 
#alpine the small os we were talking about 
FROM node:18-alpine AS Builder

#step 2 ake a woking dir inside the container the small os of alpine
#all the followinf command will run in the /app directort
WORKDIR /app

#STEP 3 COPY PACKAGE FILE FIRST.
#DOCKER IS A LAYER IF NOTHING HAS CHANGED IT REUSE THE OLD
COPY package*.json ./

#step 4 install depandacies
#run excute command during build time
#npm ci (clean install)is a stable more constinet tnat npm install
RUN npm ci --only-production

#step 5 : copy th rest of the application
#copy the source destination
# . = current directory of your computer
# /app is the directory of the container

COPY . . 

#IT IS SAID TO BE IMPORTANT MAKING A NON ROOT USER
#RUNNIGN A CONTAINER IN ROOT IS DANGEROUS

RUN addgroup -g 1001 -S nodejs 
#createa a group with id 
RUN adduser -S nodejs -u 1001
#create a user with the id
USER nodejs
#swicth to the suer

#docker render kuberties use these for health checks

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-3000}/health || exit 1

#expose the port these does not actuall publish the port but document it
EXPOSE ${PORT:-3000}

#STEP 9 COMMAND TO EUN WHEN THE PORT STARTS
#ONLY ON CMD PER  DOCKER THE LAST ONE WIND
CMD ["node", "src/index.js"]