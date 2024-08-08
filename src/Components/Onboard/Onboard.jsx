import React, { useState, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useSwiper } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import OnboardTwo from './OnboardTwo';
import weTransferLogo from '../Assets/wetransfer-text-logo.svg';
import { useAuth } from '../../Context/authContext';
import { db, auth, storage } from '../../../firebase';
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL  } from "firebase/storage";

const SwiperButtonNext = ({ children, selected, avatar }) => {
  const swiper = useSwiper();
  const { currentUser } = useAuth();
  const currentUserEmail = currentUser.email;

  const saveFieldInterest = async () => {
    const userOnboardInterestData = {
      userEmail: currentUserEmail,
      subscribedToEmail: false,
      onBoarding: false,
      fieldInterest: selected,
      avatar
    };

    try {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
    
      if (docSnap.exists()) {
        await updateDoc(docRef, userOnboardInterestData);
        console.log("Document successfully written!");
      } else {
        await setDoc(docRef, userOnboardInterestData);
        console.log("No such avatar!");
      }
      swiper.slideNext()
    } catch (error) {
      console.error("Error writing document: ", error);
    }
  }

  return <button className='mt-20 py-6 px-12 mx-auto block cursor-pointer bg-[#4f15a6] text-xl font-bold rounded-full text-white' onClick={saveFieldInterest}>{children}</button>;
};

export default function Onboard() {
  const { currentUser } = useAuth();
  if (!currentUser) {
      //return <Navigate to="/" replace={true} />;
  }
  // console.log(currentUser)

  const [selected, setSelected] = useState("Hmm, let's see...");
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [avatar, setAvatar] = useState(null);
  
  const options = [
    'Design / Illustration',
    'Photography',
    'Video / Animation',
    'Music / Sound',
    'Marketing / PR',
    'Sales / Client relations',
    'Education / Training',
    'Architecture / Construction',
    'Product / Software',
    'Data / Finance / Legal',
    'Other (and proud of it)',
  ];

  const selectRef = useRef();

  const handleOptionClick = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = (e) => {
    if (selectRef.current && !selectRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const fileInputRef = useRef(null);

  const handleDivClick = () => {
    // Trigger the file input click
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:5000/optimize-image', {
        method: 'POST',
        body: formData,
      });
      console.log(response)
      if (!response.ok) {
        
        throw new Error(`Error: ${response.statusText}`);
      }

      const imageResponse = await response.json();
      const downloadedImage = await getDownloadURL(ref(storage, `avatars/${imageResponse.firebaseImage}`));
      const docRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(docRef);
      console.log(downloadedImage, docRef)
    
      if (docSnap.exists()) {
        await updateDoc(docRef, {avatar: downloadedImage,});
        setAvatar(downloadedImage)
      } else {
        await setDoc(docRef, {avatar: downloadedImage,});
        console.log("No such avatar!");
      }
      
    } catch (error) {
      console.error('Error uploading the image:', error);
    }
  };

  console.log(currentUser.emailVerified)


  return (
    <>
      {/* {!currentUser && <Navigate to="/" replace={true} />} */}
    
    <Swiper
      spaceBetween={50}
      slidesPerView={1}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
      pagination={true}
      modules={[Pagination]}
      className="mySwiper"
    >
      <SwiperSlide>
        <main className="h-screen p-[20px]" onClick={closeDropdown}>
          <div className="flex justify-center">
            <img className='invert' src={weTransferLogo} alt="WeTransfer Logo" />
          </div>
      
          {!currentUser.displayName && (
            <div className={avatar ? "cursor-pointer w-[150.5px] h-[137px] bg-[#fff] mx-[auto] rounded-[45%] mt-[4%] flex justify-center items-center relative" : "cursor-pointer w-[150.5px] h-[137px] bg-[#000] mx-[auto] rounded-[45%] mt-[4%] flex justify-center items-center relative"}>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
            />
            {(currentUser.emailVerified) ? 
              <img className="block w-full h-full object-cover" src={currentUser.photoURL} referrerPolicy="no-referrer"/>  : 
              <div className="flex flex-col justify-center items-center h-full w-full">
              <ion-icon onClick={handleDivClick} name="cloud-upload-outline" style={{color: "white", width: '30px', height: '30px', display: avatar && 'none'}}></ion-icon>
              <p onClick={handleDivClick} className={avatar ? 'hidden' : 'text-[white] mt-[15px] text-sm text-center'}>Click here to upload image</p>
              {avatar && <img className="block w-full h-full object-contain" src={avatar} referrerPolicy="no-referrer"/>}
              </div>
            }
            </div>
          )}
    
          <p className="font-gt-super text-[3rem] text-center mt-[40px]">
            Welcome to WeTransfer, {currentUser.displayName ? currentUser.displayName.split(' ')[0] 
                                    : ''}{' '}
          </p>
    
          <p className="text-xl mt-16 text-center">
            Firstly, which field are you in?
          </p>
          
          <div className="relative font-arial w-[550px] mx-auto my-5 border border-gray-300 rounded-xl p-2.5">
            <div className="custom-select rounded-[20px] w-[550px] mx-[auto] my-[20px] p-[0.5%] font-[Arial] border border-solid border-[##0000004d]" ref={selectRef}>
              <div className={`flex justify-between items-center p-5 cursor-pointer ${isOpen ? 'select-arrow-active' : ''}`} onClick={toggleDropdown}>
                {selected}
                <i className="fas fa-chevron-down ml-2"></i>
              </div>
              <div className={`absolute left-0 right-0 top-full bg-white z-10 overflow-y-scroll  h-[260px] ${isOpen ? '' : 'hidden'}`}>
                {options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-5 cursor-pointer ${selected === option ? 'bg-gray-200' : ''}`}
                    onClick={() => handleOptionClick(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          </div>
    
          <div className="flex justify-center">
            <label className="flex items-center">
              <input className="w-7 h-7 rounded" type="checkbox" name="option2" value="value2"/>
              <div className="ml-3">
                Let WeTransfer use data you share to show you tailored <br />
                ads on and off our websites.
                <span
                  className="text-blue-500 underline cursor-pointer ml-1"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  What does this mean?
                </span>
              </div>
            </label>
          </div>
    
          {isHovered && (
            <div className="absolute top-12 right-12 w-72 h-112 bg-gray-900 text-white rounded-lg p-6 z-20 shadow-lg">
              <h2 className="text-2xl text-left mb-4">How is WeTransfer using my data?</h2>
              <p>
                We use your email address to show you (and others like you). 
                We Transfer ads on websites you visit, such as social media. 
              </p>
              <br/> 
              <p>
                We also use your field work to give you a better experience on our websites. 
              </p>
              <br/> 
              <p>
                The data you choose to share with us remains secure at all times
              </p>
            </div>
          )}
    
          <SwiperButtonNext selected={selected} avatar={avatar}>Continue</SwiperButtonNext>
        </main>
      </SwiperSlide>
      <SwiperSlide>
        <OnboardTwo />
      </SwiperSlide>
    </Swiper>
    </>
  )
}
