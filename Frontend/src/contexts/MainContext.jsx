import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';
export const MainContext = createContext();

export const MainContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [bookmarkedEvents, setBookmarkedEvents] = useState([])
  const navigate = useNavigate();
  useEffect(() => {
    async function getUser() {
      try {
        const res = await axios.get('http://localhost:9294/api/auth/me', {
          withCredentials: true,
        });
        if (res.status === 200) {
          setUser(res.data);
        } else {
          console.error('Failed to fetch user data:', res.status);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle the error (e.g., setUser(null), show error message)
      }
    }
    getUser();
  }, []);
  async function fetchBookmarkedEvents() {
    try {
      const response = await axios.get('http://localhost:9294/api/user/bookmarkedEvents', {
        withCredentials: true,
      });

      setBookmarkedEvents(response.data.bookmarkedEvents);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }

  useEffect(() => {
    fetchBookmarkedEvents();
  }, []);
  const bookmarkEvent = async (eventId) => {
    try {
      const response = await axios.post(
        'http://localhost:9294/api/user/bookmark',
        { id: eventId },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Bookmarked the event");
        // Optionally refresh the bookmarked events
        await fetchBookmarkedEvents();
      } else {
        toast.error("Failed to bookmark the event");
      }
    } catch (error) {
      console.error('Error bookmarking event:', error);
      toast.error("Error bookmarking the event. Please try again.");
    }
  };
  async function fetchNotifications() {
    try {
      const response = await axios.get('http://localhost:9294/api/notifications/mynotifications', {
        withCredentials: true,
      });

      setNotifications(response.data); // Assuming this is an array of notifications
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }

  useEffect(() => {
    fetchNotifications();
  }, []);
  const logout = async () => {
    try {
      const res = await axios.post('http://localhost:9294/api/auth/logout', {}, {
        withCredentials: true,
      });
      if (res.status === 200) {
        toast.success("Logged Out Successfully")
        setUser(null);
        navigate('/')

      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  
  const handleLogin = async (e,formData) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:9294/api/auth/login', formData, {
        withCredentials: true,
      });
      if (response.status === 201) {
        toast.success('Logged In');
        setUser(response.data); // Set user state
        navigate('/home');
      } else {
        toast.error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials and try again.');
    }
  };
  return (<MainContext.Provider value={{ user, notifications, setNotifications, bookmarkEvent, bookmarkedEvents, logout,handleLogin }}>
    {children}
  </MainContext.Provider>
  );
};
