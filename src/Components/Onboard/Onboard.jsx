import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { useSwiper } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import OnboardTwo from './OnboardTwo';
import weTransferLogo from '../Assets/wetransfer-text-logo.svg';

const SwiperButtonNext = ({ children }) => {
  const swiper = useSwiper();
  return <button className='mt-20 py-6 px-12 mx-auto block cursor-pointer bg-[#4f15a6] text-xl font-bold rounded-full text-white' onClick={() => swiper.slideNext()}>{children}</button>;
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
        <main className="h-screen p-[20px]" onClick={closeDropdown}>
          <div className="flex justify-center">
            <img className='invert' src={weTransferLogo} alt="WeTransfer Logo" />
          </div>
    
          <div className="w-[140.5px] h-[127px] bg-[#000] mx-[auto] rounded-[45%] mt-[4%]">
          </div>
    
          <p className="font-gt-super text-[3rem] text-center mt-[40px]">
            Welcome to WeTransfer, James
          </p>
    
          <p className="text-xl mt-16 text-center">
            Firstly, which field are you in?
          </p>
    
          <div className="relative font-arial w-[550px] mx-auto my-5 border border-gray-300 rounded-xl p-2.5">
            <div className="custom-select rounded-[20px] w-[550px] mx-[auto] my-[20px] p-[0.5%] font-[Arial] border border-red-500" ref={selectRef}>
              <div className={`flex justify-between items-center p-5 cursor-pointer ${isOpen ? 'select-arrow-active' : ''}`} onClick={toggleDropdown}>
                {selected}
                <i className="fas fa-chevron-down ml-2"></i>
              </div>
              <div className={`absolute left-0 right-0 top-full bg-white z-10 ${isOpen ? '' : 'hidden'}`}>
                {options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-2 cursor-pointer ${selected === option ? 'bg-gray-200' : ''}`}
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
    
          <SwiperButtonNext>Continue</SwiperButtonNext>
        </main>
      </SwiperSlide>
      <SwiperSlide>
        <OnboardTwo />
      </SwiperSlide>
    </Swiper>
  )
}
