import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useSwiper } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import onboardImage from '../Assets/onboard.png'
import weTransferLogo from '../Assets/wetransfer-text-logo.svg'
import './Onboard.css';

const SwiperButtonNext = ({ children }) => {
  const swiper = useSwiper();
  return <button className={children === "Continue" ? 'submit-continue-btn-1' : 'submit-continue-btn-2'} onClick={() => swiper.slideNext()}>{children}</button>;
};

export default function OnboardTwo() {
  const [selected, setSelected] = useState("Hmm, let's see...");
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const options = [
    'Design / Illustration',
    'Photography',
    'Video / Animation',
    'Music / Sound',
    'Marketing / PR',
    'Sales / Client relations',
    'Eduaction / Training',
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

  return (
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
        <main onClick={closeDropdown}>
          <div className="logoWrapper">
            <img className='weTransferLogo' src={weTransferLogo} alt="WeTransfer Logo" />
          </div>
    
          <div className="onboardWrapper">
            {/* <img className='profileImage' src='./src/Components/Assets/wetransfer-text-logo.svg' /> */}
            {/* <div className="profileImage"></div> */}
            <img src={onboardImage} alt="" className="onboardImage" />
          </div>
    
          <div className="onboard-success-wrapper">
            <div className="onboard-success-text">
                Now that we know a bit about you, we'd love to let you know a bit about us. 
                Want in on stories <br /> about creativity and the latest WeTransfer news?
            </div>
          </div>

          <div className="onboard-success-wrapper">
            <div className="onboard-success-sub-text">
                You can always unsubscribe later - no hard feelings.
            </div>
          </div>
    
          <div className="submit">
            <SwiperButtonNext>Continue</SwiperButtonNext>
            <SwiperButtonNext>No thanks</SwiperButtonNext>
          </div>
        </main>
      </SwiperSlide>
      <SwiperSlide>
        <main></main>
      </SwiperSlide>
    </Swiper>
  )
}
