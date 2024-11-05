import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Pagination } from 'swiper/modules';
import onboardImage from '../Assets/onboard.png';
import weTransferLogo from '../Assets/wetransfer-text-logo.svg';
import { useAuth } from '../../Context/authContext';
import { db, auth,  } from '../../../firebase';
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import axios from '../../../axios';
import { useState } from 'react';

const SwiperButtonNext = ({ children }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const currentUserEmail = currentUser.email;

  const subscribeToEmail = async (action) => {
    const handleSubscription = async (subscribed) => {
      const subscribedUserData = {
        userEmail: currentUserEmail,
        subscribedToEmail: subscribed,
        onBoarding: true,
      };
  
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          await updateDoc(docRef, subscribedUserData);
        } else {
          await setDoc(docRef, subscribedUserData);
          console.log("No such avatar!");
        }
        console.log("Document successfully written!");
  
        await axios.post('/subscribe-newsletter', { email: currentUserEmail });
        navigate('/dashboard');
      } catch (error) {
        console.error("Error writing document: ", error);
      }
    };
  
    if (action === 'Continue') {
      await handleSubscription(true);
    } else {
      await handleSubscription(false);
      navigate('/dashboard');
    }
  };  
  
  return (
    <button
      className={`mt-5 py-4 px-12 block cursor-pointer font-bold rounded-full text-[16px] font-semibold font-[Inter] ${
        children === 'Continue'
          ? 'bg-socialpaste-purple text-white'
          : 'bg-socialpaste-lightergray text-[#000]'
      }`}
      onClick={() => subscribeToEmail(children)}
    >
      {children}
    </button>
  );
};

export default function SecondOnboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  if (!currentUser) {
      //return <Navigate to="/" replace={true} />;
  }
  
  // when page initially loads, we check if user is subscribed or not(by checking if the user exists on firebase "users" collection)
  // if subscribed(meaning document exists), we can go to home page, if not, load home page
  // 
  useEffect(() => {
    async function checkUserOnboardingStatus() {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().onBoarding) {
        console.log("Document data:", docSnap.data());
        navigate('/dashboard', { replace: true });
      } else {
        console.log("No such doc!");
      }
    }

    checkUserOnboardingStatus();
  }, [])
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={1}
      onSlideChange={() => console.log('slide change')}
      onSwiper={(swiper) => console.log(swiper)}
      pagination={false}
      modules={[Pagination]}
      className="mySwiper"
    >
      <SwiperSlide>
        <main className="h-screen p-5 flex justify-center items-center">
          <section className='flex justify-center flex-col w-[586px]'>
            <div>
              <p className='font-[Inter] font-black text-[46px] text-center mb-5'>
                Get to know us
              </p>
              <p className='font-[Inter] font-normal text-[16px] text-socialpaste-gray text-center'>
                Now that we know a bit about you, we’d love to let you know a bit about us. Want in on stories about creativity 
                and the latest SocialPaste news?
                <br />
                <br />
                You can always unsubscribe later - no hard feelings.
              </p>
            </div>
      
            <div className="flex justify-center gap-4 mt-3">
              <SwiperButtonNext>Continue</SwiperButtonNext>
              <SwiperButtonNext>No thanks</SwiperButtonNext>
            </div>
          </section>
        </main>
      </SwiperSlide>
    </Swiper>
  );
}
