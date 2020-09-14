"# cell_death" 

#### Automated Instructions ####
	1) $ docker-compose build --force-rm
	2) $ docker-compose up -d // start process
	3) $ docker-compose down // close porcess

#### Manual Instructions ####
### 	Build and run nodeJS container ###
		1) make sure docker is running in the background
			- you can check if docker is running by running the following command in cmd/shell:
			   $ docker images
			   if you get a list of images docker is running.
		2) Run the following command inside the nodeJS folder
			$ docker build -t cell-death-server .
		3) After successfully building you can check again the docker images by running this command:
			$ docker images
			you should see our new image created
		4) Run docker container with the following command:
			$ docker run -p 3000:3000 -d cell-death-server
			run the following command to check if the image run correctly:
			$ docker logs <container id>
			# Example output
			Running on http://localhost:3000

### Build and run VueJS container ###
	1) make sure docker is running in the background
		- you can check if docker is running by running the following command in cmd/shell:
		   $ docker images
		   if you get a list of images docker is running.
	2) Run the following command inside the VueJS folder
		$ docker build -t cell-death-client . (Takes a while)
	3) After successfully building you can check again the docker images by running this command:
		$ docker images
		you should see our new image created
	4) Run docker container with the following command:
		$ docker run -p 49161:8080 -d cell-death-client
		run the following command to check if the image run correctly:
		$ docker logs <container id>
		# Example output
		Running on http://localhost:8080
		
Link for a complete guide: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

MYSQL:
	create a mysql server instance:
		$ docker run --name cell-death-mysql -e MYSQL_ROOT_PASSWORD=1973aA4682! -v /storage/cell-death-mysql/datadir:/var/lib/mysql -d mysql:latest
	start:
	$ docker start cell-death-mysql
	stop:
	$ docker stop cell-death-mysql
Notes:
	To access container shell run:
	# Enter the container
	$ docker exec -it <container id> /bin/bash
	# For mysql run
	$ docker exec -it <container id> mysql -u root -p
