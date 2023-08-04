# Node.js, Express, MongoDB, Mongoose Blog App
This is a simple blog app built with Node.js, Express, MongoDB, and Mongoose. It allows users to create, delete, and edit posts, as well as search for specific posts. The app also has an admin panel where admins can register and login using JWT.

> ## Features
> - Create, delete, and edit posts
> - Search for specific posts
> - Admin panel with JWT authentication
> - Home, Blog, and About routes
> - Uses EJS templating engine
## Database Schema

The app uses a MongoDB database to store its data. The database schema consists of the following tables:

* **Posts:** This table stores the blog posts. The columns in this table are:
    * `id`: The unique ID of the post.
    * `title`: The title of the post.
    * `content`: The content of the post.
    * `createdAt`: The date and time the post was created.
    * `updatedAt`: The date and time the post was updated.

## Routing Structure

The app has the following routes:

* `/`: The home page.
* `/blog`: A list of all the blog posts.
* `/blog/:id`: A single blog post.
* `/admin`: The admin panel.

The admin panel is protected by JWT authentication.

## Authentication

The app supports the following authentication mechanisms:

* Username/password authentication
* JWT authentication

To log in to the app, you can use the `/login` route. The `/login` route accepts a username and password as a JSON object. If the username and password are valid, the app will return a JWT token.

To use JWT authentication to access the admin panel, you need to add the JWT token to the `Authorization` header of your request. The value of the `Authorization` header should be `Bearer <token>`, where `<token>` is the JWT token.

## JWT Authentication

JWT stands for JSON Web Token. JWT is a standard way to authenticate users. A JWT token is a string that contains the user's identity and other information.

To learn more about JWT authentication, you can visit the following resources:

* [JWT.io](https://jwt.io/)
* [How to Implement JWT Authentication in Node.js](https://www.digitalocean.com/community/tutorials/how-to-implement-jwt-authentication-in-node-js)

## Additional Resources

* [Node.js Documentation](https://nodejs.org/en/docs/)
* [Express Documentation](https://expressjs.com/en/api.html)
* [MongoDB Documentation](https://docs.mongodb.com/manual/)
* [Mongoose Documentation](https://mongoosejs.com/docs/)
* [EJS Documentation](https://ejs.co/docs/)


## Getting Started
- Clone the repository
- Install the dependencies `npm install`
- Start the app `npm run dev`
- The app will be running on http://localhost:3000.
