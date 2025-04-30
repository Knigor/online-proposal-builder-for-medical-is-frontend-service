build:
	docker build -t not-five/frontend .
run:
	docker run -d -p 127.0.0.1:3000:3000 --name=frontend not-five/frontend
up:
	docker build -t not-five/frontend .
	docker run -d -p 127.0.0.1:3000:3000 --name=frontend not-five/frontend
down:
	docker stop frontend
	docker remove frontend