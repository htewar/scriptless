## Minimum Required configured versions for project

- Node: 23.7.0
- NPM: 11.1.0
- Docker: 28.0.1

## Project Setup steps:

1. clone the project by using command `git clone git@github.com:htewar/scriptless.git`
2. Download docker desktop from [Link](https://docs.docker.com/desktop/setup/install/mac-install/)
3. Once project cloned, open it in IDE like VS code and WebStrom.
4. Open buit-in terminal of IDE and run below commands
    - `npm install` To install all the project dependencies.
    - `docker compose up` To set-up database environment. (One time only)
5. Once docker compose done, just make sure service started from docker app.
6. To run project, run command `npm run dev`

> Note: Required to create .env file in root directory of project and add below properties in .env file.

```env
HOST=<Your IP addrees>
MYSQL_ROOT_PASSWORD=<DB Root Password>
MYSQL_DATABASE=<DB Name>
MYSQL_USER=<DB Username>
MYSQL_PASSWORD=<DB password>
``` 