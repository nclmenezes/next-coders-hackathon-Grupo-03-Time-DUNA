import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Inter";

    ::-webkit-scrollbar {
      width: 8px;
      height: 5px;
      @media(max-width:600px) {
        width: 0px;
      }
    }
    ::-webkit-scrollbar-thumb {
      background: #22c25f;
      border-radius: 10px;
    }
    ::-webkit-scrollbar-track{
      background: green;
    }

  //carousel Home..
    .swiper-slide {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    
    .swiper-pagination-bullet {
      width: 15px;
      height: 15px;
      color: #000;
      opacity: 1;
      background: rgba(0, 0, 0, 0.2);
    }
    
    .swiper-pagination-bullet-active {
      border-radius: 12px;
      background: #4263EB;
      width: 45px;
      transition: width 0.5s ease;
    }
`;
