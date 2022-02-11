import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import Footer from './components/Footer';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, []);

  const addBlog = (e) => {
    e.preventDefault();
    // const blogObj = {
    //   title: ,
    //   url,
    //   likes,
    //   user
    // }
    const blogObj = {};
    blogService
      .create(blogObj)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog));
        setNewBlog('');
      });
  }

  const handleBlogChange = (e) => {
    setNewBlog(e.target.value);
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({
        username, password
      });
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const noteForm = () => (
    <form onSubmit={addBlog}>
      <input
        value={newBlog}
        onChange={handleBlogChange}
      />
      <button type="submit">save</button>
    </form>
  );

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} />

      {
        user === null ?
          loginForm() :
          <div>
            <p>{user.name} logged in</p>
            {noteForm()}
          </div>
      }

      <div>
        <ul>
          {
            user !== null ? blogs.map(blog =>
              <Blog key={blog.id} blog={blog} />
            ) : null
          }
        </ul>
        <Footer />
      </div>
    </div>
  )
}

export default App