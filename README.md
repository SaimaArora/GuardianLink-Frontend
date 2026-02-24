🛡️ Guardian Link

Guardian Link is a simple help-request platform where users can create help requests and volunteers can claim and complete them.
It demonstrates a real-world workflow using React + Spring Boot + JWT authentication.


🧠 Problem It Solves

Sometimes people need help with small tasks or issues.
This app lets:

👤 Users create help requests

🧑‍🚒 Volunteers view open requests, claim them, and mark them as completed
So help requests don’t get lost, and responsibility is clearly assigned.


👥 Roles

USER
-> Can register & log in
-> Can create help requests
-> Can view only their own requests
-> Can delete their own requests

VOLUNTEER
-> Can register & log in
-> Can view all open requests
-> Can claim a request
-> Can complete only the requests they claimed


🔁 Workflow
User registers and logs in
User creates a help request (title + category)
Volunteer logs in
Volunteer sees open requests
Volunteer claims a request → status becomes IN_PROGRESS
Volunteer completes the request → status becomes COMPLETED


🛠️ Tech Stack

Backend
Java Spring Boot
Spring Security
JWT Authentication
MySQL
JPA / Hibernate

Frontend
React
Fetch API
CSS (custom UI)

⚙️ How to Run the Project

✅ Backend (Spring Boot)
Open the backend project in IntelliJ / VS Code
Make sure MySQL is running and your DB config is correct in application.properties

Run:
mvn spring-boot:run
or run GuardianLinkApplication.java from your IDE.

Backend will start at:
http://localhost:8081

✅ Frontend (React)
Open the frontend folder
Install dependencies:
npm install
Start the app:
npm start
Frontend will run at:
http://localhost:3000


✅ Features
🔐 JWT-based authentication
👥 Two roles: USER and VOLUNTEER
📝 Create help requests (USER)
👀 View requests (role-based)
🏷️ Categorized requests
🙋 Volunteer can claim requests
🔄 Request status flow: OPEN → IN_PROGRESS → COMPLETED
🔒 Only assigned volunteer can complete a request
🗑️ Users can delete their own requests
🎨 Clean, simple, user-friendly UI