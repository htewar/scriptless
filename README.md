## Minimum Required configured versions for project

- Node: 23.7.0
- NPM: 11.1.0
- Docker: 28.0.1

## Project Setup steps:

1. clone the [project](https://github.com/htewar/scriptless) by using command

```sh
git clone git@github.com:htewar/scriptless.git
```
2. Download docker desktop from [Link](https://docs.docker.com/desktop/setup/install/mac-install/)
3. Once project cloned, open it in IDE like VS code and WebStrom.
4. Open buit-in terminal of IDE and run below commands
    - To install all the project dependencies.
   ```sh
   npm install
   ```
    - To setup database environment. (One time only)
   ```sh
   docker compose up
   ```
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

BTA Specific Instructions:
```
Add the below line in .env file
GOOGLE_GENERATIVE_AI_API_KEY=<Gemini API key>

brew install redis -> one time installation required
Start redis using this command- "brew services start redis"

Some other usefull commands
To stop Redis: brew services stop redis
To restart Redis: brew services restart redis
To check Redis status: brew services info redis
```