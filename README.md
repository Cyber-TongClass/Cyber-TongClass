# Dev Guidelines for the Tong Class Website 2.0

> By [Xiyao Tian](https://github.com/Prince-cjml). Last update on Feb 14, 2025.

This is the repository for the next generation of the official Tong Class website tongclass.ac.cn

## Basic Information

Source code of the website will eventually be hosted on Github Repo: [TP-Tong/Cyber-TongClass](https://github.com/TP-Tong/Cyber-Tongclass), and is temporarily stored in [Prince-cjml/Cyber-TongClass](https://github.com/Prince-cjml/Cyber-TongClass) for development. The project is currently still under planning, and a preliminary sketch by [Yinghan Chen](https://github.com/Chenyinghan) is summarized and appended. 

The domain name for this website will still be [tongclass.ac.cn](https://tongclass.ac.cn/), as per the previous generation. The previous generation will be migrated to [nostalgic.tongclass.ac.cn](https://nostalgic.tongclass.ac.cn/)

## Current Sketch

### Backend

Here is a list of the functions that the backend should support, along with the current solution envisioned by [Xiyao Tian](https://github.com/Prince-cjml). 

#### Account and profile management

There will be two types of accounts: **member** and **admin**. 

**Members** of Tong Class are expected to create and maintain their personal accounts on this website. They will be granted access to:

 - A **personal profile** including their name, photo, correspondence methods, bio, research interests, spotlight **publications**, etc. These information are collected upon the registration of a new account, and demographic information will be locked henceforth. Other information may be edited. Ideally, students already into research may also upload their Google Scholar information and ORCID. 
 - A **personal canvas** they can freely edit, most probably a markdown renderer. 
 - A portal for them to upload their **publications** to the website, which will be displayed and archived in the "成果/Works & Publications" section. 
    - Optional QoL Enhancements: an API that scrapes the latest papers from Google Scholar when called. 
 - Possibly more...

Admins of Tong Class will have full access to this Github Repo. However, to minimize trouble regarding daily updates and administrative affairs, designing a dashboard specifically for admins would be optimal. 

Current solution:

1. We use **convex**, a modern Backend-as-a-Service platform, to handle all backend logic and database management. This allows us to keep the website serverless and scalable, while also providing a simple interface for defining database schemas and writing backend functions. <br>

    From Yinghan: the Cambridge team uses **railway**, which is also a BaaS platform. We can compare the two and choose the one that best fits our needs. Convex seems to have a more intuitive API and better documentation, but railway may offer more features or better performance. We should also consider the cost and ease of deployment for both platforms. A comparison from gemini:<br>

    Think of it this way: Convex is a ready-to-use "smart" backend, while Railway is a "blank canvas" server where you can build anything.

    | Feature | **Convex (BaaS)** | **Railway (PaaS)** |
    | :--- | :--- | :--- |
    | **Category** | Backend-as-a-Service | Infrastructure Platform |
    | **The Vibe** | **"Batteries Included"** — the database and logic are pre-integrated. | **"Bring Your Own Code"** — you deploy a container (Docker/Node.js). |
    | **Real-time Sync** | **Native.** If you change a value in the DB, the UI updates instantly without refresh. | **Manual.** You have to set up WebSockets or polling yourself. |
    | **Database** | Built-in (Custom JSON-like DB). | You choose (PostgreSQL, MySQL, Redis, etc.). |
    | **Hugo Integration** | **Very easy.** You just add a small JS script to your Hugo template. | **Moderate.** You'd have to build an API first, then call it from Hugo. |
    | **Auth** | Designed to work with **Clerk** or **Auth.js** out of the box. | You must build or configure the auth server yourself. |
2. Account registration will be completed through the built-in authentication system provided by **convex**, which supports email/password sign-up and sign-in. We will define a `users` table to store user profiles and roles (**member** or **admin**). When a user registers, they will be assigned the "**member**" role by default. Admin accounts can be created manually in the database or through an admin dashboard. <br>

    A database of student IDs will be stored and hashed in advance. Students will provide their organization (determining the domain for their student email) and student ID to first identify themselves in the database. Then, a verification email will be sent to the corresponding student email upon registration containing a verification token, and they must verify their email before gaining access to the website. It seems that a professional email dispatch service like SendGrid is not viable (due to the limited free trial time), so currently we are sticking to SMTP-based email sending. I have already tested with my personal 126 mail and it works fine, but we may need to set up a dedicated email account on behalf of the institute for this purpose. Also, it is unclear whether there would be issues regarding the email sending frequency and volume, which may cause delays in the registration process. <br>
    
    We do not know yet if it is possible to implement the real-time email verification process with convex's built-in authentication system, but if not, we may need to implement a custom authentication flow.<br>
    
    After verification, users will set their passwords and complete their profiles. They will then have access to the member-only sections of the website. Further logins will no longer require email verification, only the email and password. To change email (in case the domain changes, i.e. from `stu.pku.edu.cn` to `pku.edu.cn` or `alumni.pku.edu.cn`) or reset password, users will need to go through the email verification process again. To edit demographic information, users will need to contact the admins. 
    <br>
3. Each user will have a **personal profile page** that displays their information and **publications**. I'm thinking mounting these pages at `tongclass.ac.cn/users/`. They will also have a **personal canvas**, which is a markdown editor where they can write and format their own content. This canvas can be used for sharing research updates, thoughts, or any other content they wish to share with the community. 
    - We may consider giving the devs a privilege to fully customize their personal page, meaning full control over the html/css. 
    <br>
4. For publication uploads, we will provide an API on the profile page for users to input the title, authors, journal/conference, year, and optionally upload a PDF. This information will be stored in a `publications` table in the database and displayed on their profile page and in the "成果/Works & Publications" section. We can also implement a feature that allows users to link their Google Scholar profiles, which would automatically import their **publications**. Maybe there should also be an automatic verification system in case of discrepancies or errors in the imported publications.We have full faith in our students that there will not be academic misconduct.<br>

#### Course Assessments

Registered students will automatically gain access to an internal page that works as a BBS where students share authentic experience on the numerous courses we are to take throughout undergraduate (or even graduate) education at PKU & THU. A widget will be provided for them to post and manage course assessments (Anonymous?). 

Current solution:

Don't have one yet. Maybe refer to [treehole](https://treehole.pku.edu.cn/) or contact the developers of [courses.pinzhixiaoyuan.com](https://courses.pinzhixiaoyuan.com/) for advice.

#### News and Calendar

Like the previous generation, we would also like to display **news** on the homepage, and list upcoming events in a **calendar** page. **Admins** should have access to a dashboard where they can manage the posts and events graphically (instead of having to directly modify this repo). 

Current solution:

Should be straightforward to implement with convex. We can define a `news` table and an `events` table in the database, and create backend functions for admins to create, update, and delete news posts and events. The frontend can then fetch and display this information accordingly. Markdown support can be added for news posts to allow for rich formatting. For the calendar, we can use a React calendar component to display the events in a user-friendly way. (e.g. [react-calendar](https://www.npmjs.com/package/react-calendar))

(This solution is generated by GitHub Copilot, and may not be the best one. Please feel free to suggest improvements or alternatives.)

### Frontend

(To be continued...)
