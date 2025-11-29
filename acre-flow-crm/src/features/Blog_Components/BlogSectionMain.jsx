/** @format */

import React from "react";

function BlogSectionMain() {
  return (
    <div className='blog-section-main'>
      <header className='site-header'>
        <div className="d-flex justify-content-center">
          <img
            src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/416762/travelog-logo.png'
            alt=''
          />
        </div>
      </header>

      <div className='main'>
        <div className='container main-container'>
          <div className='blog-item blog-item1'>
            <div className='blog-item-image'></div>
            <div className='blog-item-content'>
              <h1>A trip to space?</h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque
                reprehenderit dolorum, saepe. Eum laboriosam nemo doloribus,
                quibusdam quis, dignissimos inventore doloremque.
              </p>
            </div>
          </div>

          <div className='blog-item blog-item2'>
            <div className='blog-item-image'></div>
            <div className='blog-item-content'>
              <h1>The Scottish Highlands</h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque
                reprehenderit dolorum, saepe. Eum laboriosam nemo doloribus,
                quibusdam quis, dignissimos inventore doloremque.
              </p>
            </div>
          </div>

          <div className='blog-item blog-item3'>
            <div className='blog-item-image'></div>
            <div className='blog-item-content'>
              <h1>Kayaking Holidays</h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque
                reprehenderit dolorum, saepe. Eum laboriosam nemo doloribus,
                quibusdam quis, dignissimos inventore doloremque.
              </p>
            </div>
          </div>
          
          <div className='blog-item blog-item4'>
            <div className='blog-item-image blog-item-image4'></div>
            <div className='blog-item-content'>
              <h1>New York New York</h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque
                reprehenderit dolorum, saepe. Eum laboriosam nemo doloribus,
                quibusdam quis, dignissimos inventore doloremque.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum
                dolorem, at. Quis at in, voluptas consequatur! Facere quibusdam,
                tenetur dicta pariatur animi earum, deleniti consequatur,
                incidunt iure, odit unde nesciunt iusto iste.
              </p>

              <div className='blog_post_image_grid'>
                <img
                  src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/416762/newyork1.jpg'
                  alt=''
                />
                <img
                  className='new_york_image_two'
                  src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/416762/newyork2.jpg'
                  alt=''
                />
                <img
                  src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/416762/newyork3.jpg'
                  alt=''
                />
                <img
                  src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/416762/newyork4.jpg'
                  alt=''
                />
                <img
                  src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/416762/newyork5.jpg'
                  alt=''
                />
                <img
                  src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/416762/newyork6.jpg'
                  alt=''
                />
                <img
                  src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/416762/newyork7.jpg'
                  alt=''
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .blog-section-main {
          font-family: 'Open Sans', sans-serif;
          background-color: #faf9f5;
        }
        
        img {
          max-width: 100%;
          height: auto;
        }
        
        h1 {
          font-weight: 200;
        }
        
        p {
          font-size: 17px;
          line-height: 28px;
          color: #050538;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .site-header {
          background-color: #fff;
          text-align: center;
          padding-top: 55px;
        }
        
        .main {
          padding-top: 40px;
          padding-bottom: 40px;
        }
        
        .main-container {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-gap: 30px;
        }
        
        .blog-item {
          border: 1px solid #ddd;
          background-color: #fff;
          border-radius: 3px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .blog-item-image {
          height: 220px;
          background-position: center center;
          background-size: cover;
          background-repeat: no-repeat;
        }
        
        .blog-item-content {
          padding: 20px;
        }
        
        .blog-item-content h1 {
          margin-bottom: 15px;
          color: #050538;
        }
        
        .blog-item-content p {
          margin-bottom: 15px;
        }
        
        .blog_post_image_grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 20px;
        }
        
        .blog_post_image_grid img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 5px;
        }
        
        @media (max-width: 768px) {
          .main-container {
            grid-template-columns: 1fr;
            grid-gap: 20px;
          }
          
          .blog_post_image_grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

export default BlogSectionMain; 