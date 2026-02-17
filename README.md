# Dev Guidelines for the Tong Class Website 2.0

> By [Xiyao Tian](https://github.com/Prince-cjml). Last update on Feb 17, 2025. Happy Chinese New Year!

This is the repository for the next generation of the official Tong Class website tongclass.ac.cn

## Top issues to be resolved:

1. Current design is based on desktop view. Do we need to design a mobile-friendly version of the website? If so, should we implement a responsive design that adapts to different screen sizes, or should we create a separate mobile version of the website? 

2. On whose behalf are we registering the important services we are using, such as the domain name, the convex account, the email account for sending verification emails, etc.? It would be ideal if these services are registered under the name of the institute, so that they can be easily transferred to new admins in the future. 

3. Course assessment layout and design. 

## Basic Information

Source code of the website will eventually be hosted on Github Repo: [TP-Tong/Cyber-TongClass](https://github.com/TP-Tong/Cyber-Tongclass), and is temporarily stored in [Prince-cjml/Cyber-TongClass](https://github.com/Prince-cjml/Cyber-TongClass) for development. The project is currently still under planning, and a preliminary sketch by [Yinghan Chen](https://github.com/Chenyinghan) is summarized and appended. 

The domain name for this website will still be [tongclass.ac.cn](https://tongclass.ac.cn/), as per the previous generation. The previous generation will be migrated to [nostalgic.tongclass.ac.cn](https://nostalgic.tongclass.ac.cn/)

## Current Sketch

### Pipeline

**Database** (Convex) -> **API** (TypeScript) -> **Framework** (Next.js) -> **UI components** (Shadcn/UI) -> **User's Browser**

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

Update from Yinghan: a poll has been done by 23' and 24' Tong Class students, and Tianzhuo Yang has the statistics. We may simply upload the results to the database, and add a simple API to fetch and display them on the frontend. We can also add a hook for students to submit their own assessments, which will be stored in the database and displayed after admin approval. This way we can keep the content authentic and up-to-date. 

#### News and Calendar

Like the previous generation, we would also like to display **news** on the homepage, and list upcoming events in a **calendar** page. **Admins** should have access to a dashboard where they can manage the posts and events graphically (instead of having to directly modify this repo). 

Current solution:

Should be straightforward to implement with convex. We can define a `news` table and an `events` table in the database, and create backend functions for admins to create, update, and delete news posts and events. The frontend can then fetch and display this information accordingly. Markdown support can be added for news posts to allow for rich formatting. For the calendar, we can use a React calendar component to display the events in a user-friendly way. (e.g. [react-calendar](https://www.npmjs.com/package/react-calendar))

(This solution is generated by GitHub Copilot, and may not be the best one. Please feel free to suggest improvements or alternatives.)

### Frontend

The frontend will be built with **Next.js**, a popular React framework that supports server-side rendering and static site generation. We will use **Shadcn/UI** for UI components, which provides a set of accessible and customizable components that can help us build a modern and responsive user interface. This also makes it friendly for vibe coding. 

I'm thinking making the frontend classy, maybe refer to [stanford.edu](https://www.stanford.edu/) or [yale.edu](https://www.yale.edu/) for design inspiration. Yinghan provided a version from [Cambridge Chinese Students Society](www.cambridgeccs.com), which is also a good reference. The latter is a rather lightweight website and looks more like a blog, while the former is more comprehensive and has a more complex structure. The bubble design on the Cambridge website is modern and visually appealing, while the Stanford website has a more traditional and academic vibe. However, the Stanford design requires much heavier real content to fill in the homepage, which may pose a challenge for us. Therefore, I would actually lean toward the Yale design, which looks clean yet professional, and can be easily adapted to our content structure. 

Here is a sketch of the homepage layout from Yinghan, polished by Xiyao Tian:

#### Top banner

Listed from left to right:

- Logo of Tong Class, and the Chinese name of the class “通用人工智能实验班”. The logo pic would also serve as the home button. 

- A navigation bar with the following items. Each item with sub-categories can have a dropdown menu when the cursor hovers over it to show more specific sections. Alternatively, we can add a little arrow next to the item to indicate that it has a dropdown menu, and will be expanded when clicked. 
    - 动态/News
    - 成员/People
        - 学生/Students
        - 校友/Alumni
        - (optional) 教职工/Faculty
    - 成果/Works & Publications (or more concisely Academics)
        - 最新成果/Latest Works
        - 成果库/Archive
    - (Optional) 研究/Research
        - 研究方向/Research directions
        - 研究资源/Research resources
    - 资源/Resources (Items in this section may be accessible to members only. Clicking on this category or any of its sub-categories will require users to log in first if they haven't already.)
        - 课程测评/Course Assessments
        - 自学资源/Study materials
        - 生存指南/Survival Guide
        - 常用素材/Assets
    - 活动/Events Calendar
    - 关于通班/About us
        This section would be docs-like. The tree would look somewhat like this:
        - PKU
            - 概况/Introduction
            - 官号/Official accounts 
            - 生活在通班/Campus life
            - 自治委员会/Student council
            - 文创/Merchandise
            - 联系我们/Contact us
        - THU
            (They'll design their own pages)
        
        A "回到旧版/Nostalgic version" button can be added to the sidebar of this section, which will redirect users to the previous generation of the website. 
    
- A search bar for users to quickly find information on the website.

- A **striking** login button for users to access their accounts. After logging in, this will be replaced by the user's profile picture, which can be clicked to access their profile page and personal canvas.

All frontend pages should have a consistent header and footer design. The header will contain the top banner as described above, while the footer can include contact information, social media links, and any other relevant information about Tong Class. 

#### Homepage

We want:
 - A huge sliding banner right below the top banner, displaying the latest news and important announcements. Each slide should contain an image, a title, a brief description, and a link to the full news post. Refer to [CoRe Lab](https://pku.ai/) for an example of a well-designed sliding banner. The banner would be occupying the full width of the page, and the height can be adjusted according to the content. 

 - Below the sliding banner, we can have a section that briefly introduces Tong Class, with a "Learn more" button that redirects users to the "About us" section. This section can also include some eye-catching statistics or highlights about Tong Class, such as the number of students, notable achievements, etc.

 - Below the introduction section, we can have a "Latest News" section that displays the most recent news posts in a grid or list format. Each news post should include a title, a brief description, and a link to read more. We can also add a "View all news" button that redirects users to the full news page. 

 - Maybe snippets of the six major research directions can also be displayed on the homepage. If we are to implement this, we can add a "Research" category to the top banner, and each research direction can have its own page with more detailed information. 

#### News section

In this section we host an extensive collection of news posts related to Tong Class, including but not limited to: 
- Important announcements (e.g. registration, events, etc.)
- Research updates from students and faculty
- Achievements and awards
- Alumni news
- Group activities and gatherings
- Any other newsworthy events or information related to Tong Class

We may adopt the current timeline design, and it would be ideal if we can add a filter function for users to sort news posts by categories (e.g. announcements, research updates, etc.) or by date. The aesthetics of this page must be redesigned though. 

#### People section

Student page:

A collective photo of all students can be displayed at the top of the page, followed by a grid of individual student profiles. Each profile should include the name, photo and quick links (e.g. email, Google Scholar, Github etc.). Clicking on a student's profile will redirect users to their public personal profile page, which contains more detailed information about them, such as their bio, research interests, publications, etc. 

We want to list students in the following order:
- Options right below the collective photo: 北大通班/PKU Tong Class, 清华通班/THU Tong Class. By default, the PKU students will be displayed first, and users can click on the THU option to view the THU students. 

- Within each school, students will be listed in the order of their enrollment year (latest first), and then by their names in pinyin. 

Alumni page:

This page can be designed similarly to the student page, using the exact same logic. 

#### Works & Publications section

- Latest works: This section will showcase the most recent and notable works and publications from Tong Class students and faculty. Each work/publication should include a title, a brief description, the authors, the publication venue (e.g. journal or conference), and a link to the full paper if available. DOI links are preffered. We can also add a "View all works" button that redirects users to the full archive of works and publications. 

- Archive: This section will serve as a comprehensive repository of all works and publications from Tong Class students and faculty. It should be organized in a searchable and filterable format, allowing users to easily find specific works or browse through the collection. Each entry in the archive should include the same information as the latest works section (title, description, authors, publication venue, link to full paper). We can also add tags or categories to each work/publication to facilitate searching and browsing (i.e. ML, Robotics, CoRe, etc.)

#### Resources section

This section could be blog like. Refer to [Yixin's homepage](https://yzhu.io/) for inspiration. The course assessment page should be designed more carefully, however. 

#### Events Calendar section

Not much to say here. We can use a React calendar component to display upcoming events in a user-friendly way. Each event should include a title, date, time, location (if applicable), and a brief description. We can also add a "View all events" button that redirects users to a page with a full calendar view of all upcoming events. Previous design can be adapted with improved aesthetics.

#### About us section

This section will be docs-like, as mentioned before. Should be straightforward to implement with Next.js. We can create a sidebar with the different categories (PKU, THU, etc.) and sub-categories (Introduction, Official accounts, Campus life, etc.), and the main content area will display the corresponding information when a category is selected. We can also add a "Back to homepage" button for easy navigation. 