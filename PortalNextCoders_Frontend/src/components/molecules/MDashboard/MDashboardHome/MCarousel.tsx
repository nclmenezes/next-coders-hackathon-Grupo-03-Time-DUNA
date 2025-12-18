import Player from '../../../atoms/Player';

import { Navigation, Pagination } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { Box } from '@mui/material';

var items = [
  {   
      id: 1,
      url: "https://www.youtube.com/watch?v=JJqXeRFsLjE&ab_channel=KansasCityZoo"
  },
  {
      id: 2,
      url: "https://www.youtube.com/watch?v=rkPCR6Ujtak&ab_channel=DreamM%C3%BAsica"
  },
  {
    id: 3,
    url: "https://www.youtube.com/watch?v=rkPCR6Ujtak&ab_channel=DreamM%C3%BAsica"
  },
  
]


function MCarousel() {
  const pagination = {
    clickable: true,
  };
  
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', marginTop: 5}}>
      <Swiper  
      style={{width: '1480px',  paddingBottom: '50px' , overflowX: 'hidden'}}
      modules={[Pagination, Navigation]}
      spaceBetween={50}
      slidesPerView={2}
      navigation
      pagination={pagination}>
        {
          items.map (item => (
            <SwiperSlide key={item.id} style={{width: '500px'}}>
              <Player url={item.url} width='900px'/>
            </SwiperSlide>

          ))
        }
        <div className="swiper-pagination"></div>
      </Swiper>  
    </Box>
              
  )
}

export default MCarousel