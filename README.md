# [CandHCRM](https://github.com/C-and-H/comp30022) &middot; ![version](https://img.shields.io/badge/version-1.3.1-yellow.svg) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/C-and-H/comp30022/blob/main/LICENSE)

> Customer relationship management (CRM) is a technology for managing all your company’s relationships and interactions with customers and potential customers. The goal is simple: Improve business relationships. A CRM system helps companies stay connected to customers, streamline processes, and improve profitability. (from salesforce.com)

Our product CandHCRM delivers a 100%-free solution of this as a web application. It supports a variety of functionalities, e.g. contact management, mass mailing, online chat, voice/video call, screen share, meeting scheduling, and real-time notification.

Getting started: https://crm-c-and-h.herokuapp.com.

The backend server uses Spring Boot framework and provides restful API service that the React frontend uses. The database used is MongoDB. The project is deployed to two Heroku apps from a multi-language monorepo. With the secret key HEROKU_API_KEY set in our GitHub reposiotry, the file `.github/workflows/deploy.yml` runs automatic deployment to Heroku once there's a push in main.

Deployment Guide: https://github.com/C-and-H/comp30022/blob/main/doc/Deployment%20Guide.pdf.


# Requirements

1. Download node.js and npm from https://nodejs.org/en/download.
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
Frontend:
  ```
  REACT_APP_API_URL=http://localhost:8080
  ```
Backend:
  ```
  MONGO_USERNAME=<mongo-usrname>
  MONGO_PASSWORD=<mongo-pwd>
  MAIL_ADDRESS=<gmail-address>
  MAIL_PASSWORD=<gmail-pwd>
  APP_URL=http://localhost:3000
  JWT_SECRET=crm
  ```


# Documents

Trello URL: https://trello.com/b/UFGrABB1/team002.

Confluence URL: https://bingzhej.atlassian.net/wiki/spaces/CH/overview.<br>Pages have been exported to `/doc`.


# Future Improvements

1. Missed call notification.
2. Connect with real meeting creation API (e.g. Zoom).
3. Users would search participants' names when scheduling a meeting.
4. Deleting friends would also delete the chat history between them.
5. Forget password.
6. The current logic of contact relations makes it fast for an update but slow for search, while there are more searches than updates.
7. Multiple accounts could be allowed in a single browser.
8. Meeting re-scheduling.
9. Call does not record voice when sharing the screen. Will try to add one more voice stream, but this would affect the screen to show on the opponent side.
