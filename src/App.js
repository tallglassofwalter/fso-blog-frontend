import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import Footer from './components/Footer';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (user !== null) {
      blogService.getAll().then(blogs =>
        setBlogs(blogs)
      );
    }
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const addBlog = (e) => {
    e.preventDefault();
    const blogObj = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: 0,
      user: user.username
    };
    blogService
      .create(blogObj)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog));
        setNewTitle('');
        setNewAuthor('');
        setNewUrl('');
      });
  }

  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({
        username, password
      });
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      );
      blogService.setToken(user.token);
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

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
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

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        <label>
          title: 
          <input
            type="text"
            value={newTitle}
            name="Title"
            onChange={handleTitleChange}
          />
        </label>
      </div>

      <div>
        <label>
          author: 
          <input
            type="text"
            value={newAuthor}
            name="Author"
            onChange={({ target }) => setNewAuthor(target.value)}
          />
        </label>
      </div>
      
      <div>
        <label>
          url: 
          <input
            type="text"
            value={newUrl}
            name="url"
            onChange={({ target }) => setNewUrl(target.value)}
          />
        </label>
      </div>
      
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
            <button onClick={handleLogout}>log out</button>
            {blogForm()}
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