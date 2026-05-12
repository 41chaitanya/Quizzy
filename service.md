Service	Responsibility


auth-service/
 ├── src/
 │    ├── config/
 │    ├── controllers/
 │    ├── middlewares/
 │    ├── models/
 │    ├── routes/
 │    ├── services/
 │    ├── utils/
 │    ├── app.js
 │    └── server.js
 │
 ├── .env
 ├── .gitignore
 ├── package.json

Auth Service ----> 	Login, 
, RBAC
User/Batch Service ---> 	Students & batches
Quiz Service ---> 	Questions & tests
Upload Service	---> Parse CSV/DOCX/JSON
Scheduler Service	---> Auto-open/close tests
Analytics Service --> 	Rankings & reports
Notification Service ---> (optional)	Email/SMS alerts 





Backend (chaitanya --> project lead )

Runtime --> 	Node.js
Framework --> 	Express.js
Database ---> 	MongoDB
ORM	 --> Mongoose
Auth --> 	JWT + bcrypt
Validation --->	Zod 
Scheduler ---> 	Agenda.js
Queue ---> MQ + Redis
File Upload ---> Multer +image kit
CSV Parsing ---> 	csv-parser
DOCX Parsing  ---> 	mammoth
JSON Upload --> 	native parser
API Gateway	--> Nginx
Realtime	----> Socket.IO
Logging ---> 	Winston. morgan 
Monitoring	---> Prometheus + Grafana
API Docs	---> Swagger


Frontend. ()

UI ---> React
Routing	---> React Router
State	 ---> Redux Toolkit
API ---> 	Axios
Styling	  --> Tailwind CSS
Forms ---> 	React Hook Form
Charts	 ---> Recharts
Countdown	----> react-countdown
Tables ---> 	TanStack Table


Infrastructure

Containerization	Docker
Reverse Proxy	Nginx
CI/CD	GitHub Actions
Cloud	AWS / Render / Railway
Storage	AWS S3
Cache	Redis









http://localhost:8000/-- > api gate way 


http://localhost:8000/register



http://localhost:8001/api/auth/register--> auth-service
http://localhost:8002/api/test--> test-service
http://localhost:8003/api/test--> user-analytics

