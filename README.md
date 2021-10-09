# Summary

> Customer relationship management (CRM) is a technology for managing all your company’s relationships and interactions with customers and potential customers. The goal is simple: Improve business relationships. A CRM system helps companies stay connected to customers, streamline processes, and improve profitability. (from salesforce.com)

Our product CandHCRM delivers a 100%-free solution as a web application. It supports a variety of functionalities, e.g. contact management, mass mailing, online chat, voice/video call, screen share, meeting scheduling, and real-time notification. 

The backend server uses Spring Boot framework and provides restful API service that the React frontend uses. The database used is MongoDB. The project is deployed to two Heroku apps from a multi-language monorepo. With the secret key HEROKU_API_KEY set in our GitHub reposiotry, the file `.github/workflows/deploy.yml` runs automatic deployment to Heroku once there's a push in main.

Heroku URL: https://crm-c-and-h.herokuapp.com/.


# Requirements

1. Download node.js and npm from https://nodejs.org/en/download/.
2. Download IntelliJ IDEA from https://www.jetbrains.com/idea/download.
3. Update JDK to version 16 or later.
4. Has a valid Gmail and MongoDB account.


# Run

### Server
1. Open `/backend` folder in IntelliJ IDEA, and load `pom.xml` to link maven project.
2. Create 5 MongoDB collections in `crm` database that follows `/backend/src/main/java/candh/crm/model/*.java`.
3. Edit run configuration > Environment variables > Apply.
4. Run `CrmApplication.java`.

### App
1. Go to directory `/frontend`.
2. Manually create a new file `.env` for environment variables, or just run `echo REACT_APP_API_URL=http://localhost:8080 > .env`.
3. Run `npm install` to install packages.
4. Run `npm start`.
5. Browser visits `localhost:3000`.

### Environment Variables
Frontend
  ```
  REACT_APP_API_URL=http://localhost:8080
  ```
Backend
  ```
  MONGO_USERNAME=<mongo-usrname>
  MONGO_PASSWORD=<mongo-pwd>
  MAIL_ADDRESS=<gmail-address>
  MAIL_PASSWORD=<gmail-pwd>
  APP_URL=http://localhost:3000
  JWT_SECRET=crm
  ```
