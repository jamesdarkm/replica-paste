import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useSwiper } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import OnboardTwo from './OnboardTwo';
import weTransferLogo from '../Assets/wetransfer-text-logo.svg'
import './Onboard.css';

const SwiperButtonNext = ({ children }) => {
  const swiper = useSwiper();
  return <button className='continue-btn' onClick={() => swiper.slideNext()}>{children}</button>;
};

export default function Onboard() {
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
    
          <div className="profileWrapper">
            {/* <img className='profileImage' src='./src/Components/Assets/wetransfer-text-logo.svg' /> */}
            {/* <div className="profileImage"></div> */}
          </div>
    
          <p className="welcomeText">
            Welcome to WeTransfer, James
          </p>
    
          <p className="fieldQuestion">
            Firstly, which field are you in?
          </p>
    
          <div className="custom-select-wrapper">
            <div className="custom-select" ref={selectRef}>
              <div className={`select-selected ${isOpen ? 'select-arrow-active' : ''}`} onClick={toggleDropdown}>
                {selected}
                <i className="fas fa-chevron-down dropdown-icon"></i>
              </div>
              <div className={`select-items ${isOpen ? '' : 'select-hide'}`}>
                {options.map((option, index) => (
                  <div
                    key={index}
                    className={selected === option ? 'same-as-selected' : ''}
                    onClick={() => handleOptionClick(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          </div>
    
          <div className="user-data-wrapper">
            <label>
              <input type="checkbox" name="option2" value="value2"/>
              <div className="label-text">
              Let WeTransfer use data you share to show you tailored <br />
              ads on and off our websites.
              <span
                className="tooltip"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                What does this mean?
              </span>
              </div>
            </label>
          </div>
    
          {isHovered && (
            <div className="tooltip-box">
              <h2 className="tooltip-heading">How is WeTransfer using my data?</h2>
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
    
          <SwiperButtonNext>Continue</SwiperButtonNext>
        </main>
      </SwiperSlide>
      <SwiperSlide>
        <OnboardTwo></OnboardTwo>
      </SwiperSlide>
    </Swiper>
  )
}
