import React from 'react'



import HeroSection from './HeroSection'
import FeaturedCollection from './FeaturedCollection'
import WhyChooseUs from './WhyChooseUs'
import ShopNowPage from './ShopNowPage'
import ImageShowcase from './PinterestGallery'


export default function() {
  return (
   <>
   <div className='mt-10'>
    <HeroSection />
    <FeaturedCollection />
    <ShopNowPage/>
  <ImageShowcase/>
    <WhyChooseUs />
   </div>
   </>
  )
}
