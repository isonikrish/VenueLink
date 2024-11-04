import React, { useState, useRef, useEffect, useContext } from 'react';
import useravatar from '../../assets/user-avatar.png'
import Calendar from 'react-calendar';
import TabList from '../../components/TabList/TabList';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { RxCross1 } from "react-icons/rx";
import { toast } from 'react-hot-toast'
import axios from 'axios'
import debounce from 'lodash.debounce'; // Import debounce from lodash
import { useNavigate } from 'react-router-dom'
import Loader from '../../components/Loader';
import { MainContext } from '../../contexts/MainContext'
function CreateEvent() {
  const navigate = useNavigate();
  const { user } = useContext(MainContext)
  const [activeTab, setActiveTab] = useState('Details'); // Default tab
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const fileInputRef = useRef(null);
  const [emailInput, setEmailInput] = useState('');
  const [userSearchResult, setUserSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    eventDescription: '',
    eventType: '',
    eventDate: '',
    eventPrice: '',
    eventPriceValue: '',
    eventTimeFrom: '10:00',
    eventTimeTo: '10:00',
    eventLocation: '',
    eventLink: '',
    eventAddress: '',
    eventThumbnail: null,
    coorganizerEmail: []
  });
  const tabList = [
    { name: 'Details' },
    { name: 'Date and Location' },
    { name: 'Co-Organizers' },
  ];
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };


  const debouncedSearch = useRef(
    debounce(async (email) => {
      try {
        const response = await axios.get('http://localhost:9294/api/event/findUser', {
          params: { email },
          withCredentials: true, // Move this inside the config object
        });
        setUserSearchResult(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }, 1000) // Adjust debounce delay as needed
  ).current;
  useEffect(() => {
    if (emailInput) {
      debouncedSearch(emailInput);
    } else {
      setUserSearchResult(null);
    }
  }, [emailInput]);


  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'radio') {
      setFormData({ ...formData, [name]: value });
    }
    if (name === 'eventThumbnail') {
      const file = files[0];
      if (file) {
        setFormData({ ...formData, eventThumbnail: file });
        setThumbnailUrl(URL.createObjectURL(file));
      }
    }
    else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleDateChange = (date) => {
    const formattedDate = date.toLocaleDateString('en-CA');
    console.log(formattedDate)
    setFormData({ ...formData, eventDate: formattedDate });
  };
  const handleTimeChange = (name) => (time) => {
    setFormData({ ...formData, [name]: time });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const Formdata = new FormData();
    Formdata.append('eventName', formData.eventName);
    Formdata.append('eventDescription', formData.eventDescription);
    Formdata.append('eventType', formData.eventType);
    Formdata.append('eventDate', formData.eventDate);
    Formdata.append('eventPrice', formData.eventPrice);
    Formdata.append('eventPriceValue', formData.eventPriceValue);
    Formdata.append('eventTimeFrom', formData.eventTimeFrom);
    Formdata.append('eventTimeTo', formData.eventTimeTo);
    Formdata.append('eventLocation', formData.eventLocation);
    Formdata.append('eventLink', formData.eventLink);
    Formdata.append('eventAddress', formData.eventAddress);

    formData.coorganizerEmail.forEach((email, index) => {
      Formdata.append(`coorganizerEmail[]`, email); // You can use any format your backend expects
    });
    if (formData.eventThumbnail) {
      Formdata.append('eventThumbnail', formData.eventThumbnail);
    }

    try {
      const response = await axios.post('http://localhost:9294/api/event/create', Formdata, {
        withCredentials: true,
      });
      if (response.status === 201) {
        toast.success('Event created successfully!');
        navigate(`/event/${response.data._id}`);
        setFormData({
          eventName: '',
          eventDescription: '',
          eventType: '',
          eventDate: '',
          eventPrice: '',
          eventPriceValue: '',
          eventTimeFrom: '10:00',
          eventTimeTo: '10:00',
          eventLocation: '',
          eventLink: '',
          eventAddress: '',
          eventThumbnail: null,
          coorganizerEmail: []
        });
        setThumbnailUrl('');
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error creating event:', error);
      if (error.response) {
        // Server responded with a status other than 2xx
        toast.error(`Failed to create event: ${error.response.data.message || error.response.statusText}`);
      }
    } finally {
      setIsLoading(false); // End loading
    }

  };
  const clearThumbnail = () => {
    setThumbnailUrl(''); // Clear the thumbnail URL
    fileInputRef.current.value = ''; // Reset the file input value
  };
  const addEmail = (e) => {
    e.preventDefault();
    if (formData.coorganizerEmail.length >= 4) {
      toast.error('You can only add up to 4 co-organizers.');
      return;
    }

    if (emailInput === user.email) {
      toast.error('You cannot add yourself as a co-organizer.');
      return;
    }
    if (emailInput && !formData.coorganizerEmail.includes(emailInput)) {
      setFormData({
        ...formData,
        coorganizerEmail: [...formData.coorganizerEmail, emailInput] // Add the new email
      });
      setEmailInput('');
    } else if (!emailInput) {
      toast.error('Please enter an email.');
    } else if (formData.coorganizerEmail.includes(emailInput)) {
      toast.error('This email is already in the list.');
    }
  };
  const handleRemoveCoOrganizer = (indexToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      coorganizerEmail: prevData.coorganizerEmail.filter((_, index) => index !== indexToRemove)
    }));
  };
  return (
    <div className="max-w-4xl mx-auto mt-10">

      <TabList tabs={tabList} activeTab={activeTab} onTabClick={handleTabClick} />

      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-8" onSubmit={handleSubmit}>
        {isLoading ? <Loader /> : (

          activeTab === 'Details' && (
            <div className="space-y-6 my-5">
              <h2 className="text-xl font-bold mb-4">Event Details</h2>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Event Thumbnail</label>
                {thumbnailUrl && (
                  <div className="mb-4 flex gap-3">
                    <img src={thumbnailUrl} alt="Event Thumbnail" className="w-32 h-32 object-cover" />
                    <RxCross1 onClick={clearThumbnail} className='cursor-pointer' />
                  </div>
                )}
                <input
                  type="file"
                  name="eventThumbnail"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={handleChange}
                  accept="image/*"
                  ref={fileInputRef}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Event Name:</label>
                <input
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Event Description:</label>
                <textarea
                  name="eventDescription"
                  value={formData.eventDescription}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Event Price:</label>
                <select
                  name="eventPrice"
                  value={formData.eventPrice}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={handleChange}
                >
                  <option value="">Select Type</option>
                  <option value="free">Free</option>
                  {/*<option value="paid">Paid</option>*/}


                </select>
                {formData.eventPrice === 'paid' && (
                  <div className='flex flex-row items-center gap-3'>
                    <p>₹</p>
                    <input
                      type="number"
                      name="eventPriceValue"
                      value={formData.eventPriceValue}
                      className="shadow appearance-none border rounded w-40 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline my-4"
                      min={1}
                      placeholder='Enter Price'
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Event Type:</label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  required
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={handleChange}
                >
                  <option value="">Select Type</option>
                  <option value="private">Private</option>
                  <option value="public">Public</option>

                </select>
              </div>
            </div>
          )
        )}

        {/* Date and Location Form */}
        {activeTab === 'Date and Location' && (
          <div className="space-y-10">
            <h2 className="text-xl font-bold mb-4">Date and Location</h2>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Event Date:</label>

              <Calendar
                className="rounded-md border border-gray-300"
                view="month"
                onChange={handleDateChange}
                value={formData.eventDate}

              />

            </div>
            <div className="flex items-center gap-3">
              <p>From</p>
              <TimePicker
                onChange={handleTimeChange('eventTimeFrom')}
                value={formData.eventTimeFrom}
              />
              <p>To</p>
              <TimePicker
                onChange={handleTimeChange('eventTimeTo')}
                value={formData.eventTimeTo}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Event Location:</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="offline"
                    name="eventLocation"
                    value="offline"
                    checked={formData.eventLocation === 'offline'}
                    className="form-radio text-blue-500 focus:ring-blue-500 cursor-pointer"
                    onChange={handleChange}
                  />
                  <span className="text-gray-800">Offline</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="online"
                    name="eventLocation"
                    value="online"
                    checked={formData.eventLocation === 'online'}
                    className="form-radio text-blue-500 focus:ring-blue-500 cursor-pointer"
                    onChange={handleChange}
                  />
                  <span className="text-gray-800">Online</span>
                </label>
              </div>
            </div>
            {formData.eventLocation === 'online' ? (
              <div>
                <input
                  type="text"
                  name="eventLink"
                  value={formData.eventLink}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder='Link to the meeting'
                  onChange={handleChange}
                />
              </div>
            ) : <div>
              <input
                type="text"
                name="eventAddress"
                value={formData.eventAddress}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder='Address'
                onChange={handleChange}
              />
            </div>}
          </div>
        )}
        {activeTab === 'Co-Organizers' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-4">Co-Organizers</h2>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Co-Organizer Email:</label>
              <div>


                <input
                  type="email"
                  name="coorganizerEmail"
                  value={emailInput}
                  className="shadow appearance-none border rounded w-60 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder='Email'
                />
                {userSearchResult && (
                  <div className="results flex items-center gap-4 my-6 p-4 border border-gray-300 rounded-lg shadow-md bg-white">

                    <div className="profile-img">
                      <img
                        src={userSearchResult.profilePicUrl || useravatar} // Provide a default image if none is available
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </div>
                    <div className="user-info flex flex-col">
                      <span className="text-lg font-semibold text-gray-800">{userSearchResult.fullname}</span>
                      <span className="text-sm text-gray-600">{userSearchResult.email}</span>
                    </div>
                    <button
                      className="ml-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={addEmail}
                    >
                      Add
                    </button>
                  </div>
                )}

              </div>
              <ul className="space-y-2">
                {formData.coorganizerEmail.map((email, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-100 text-gray-800 rounded-lg px-4 py-2 shadow-md my-4">
                    {email}
                    <button
                      onClick={() => handleRemoveEmail(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <RxCross1 onClick={() => handleRemoveCoOrganizer(index)} />
                    </button>
                  </li>
                ))}
              </ul>

            </div>

            <button
              type="submit"
              className="mt-8 bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Create Event
            </button>
          </div>
        )}

      </form>
    </div>
  );
}

export default CreateEvent;