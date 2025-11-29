import React from "react";

function BlogFlex() {
  return (
    <div className='blog-flex-section'>
      <div style={{position:"relative"}}>
        <div className='blog-card spring-fever'>
          <div className='title-content'>
            <h3>
              <a href='#'>10 inspiring photos</a>
            </h3>
            <div className='intro'>
              {" "}
              <a href='#'>Inspiration</a>{" "}
            </div>
          </div>
          <div className='card-info'>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim...
            <a href='#'>
              Read Article<span className='licon icon-arr icon-black'></span>
            </a>
          </div>

          <div className='gradient-overlay'></div>
          <div className='color-overlay'></div>
        </div>
      </div>

      <style jsx>{`
        .blog-flex-section {
          font-family: "PT Serif", serif;
        }
        
        .blog-card {
          max-width: 350px;
          width: 100%;
          height: 400px;
          position: absolute;
          font-family: "Droid Serif", serif;
          color: #fff;
          top: 20%;
          right: 0;
          left: 0;
          overflow: hidden;
          border-radius: 0px;
          box-shadow: 0px 10px 20px -9px rgba(0, 0, 0, 0.5);
          text-align: center;
          transition: all 0.4s;
          background: url(https://unsplash.it/600/800?image=1061) center no-repeat;
          background-size: 100%;
        }
        
        .spring-fever {
          border-radius: 10px;
        }
        
        .blog-card a {
          color: #fff;
          text-decoration: none;
          transition: all 0.2s;
        }
        
        .blog-card .color-overlay {
          background: rgba(64, 84, 94, 0.5);
          width: 550px;
          height: 500px;
          position: absolute;
          z-index: 10;
          top: 0;
          left: 0;
          transition: background 0.3s cubic-bezier(0.33, 0.66, 0.66, 1);
        }
        
        .blog-card .gradient-overlay {
          background-image: linear-gradient(transparent 0%, rgba(0, 0, 0, 0.6) 21%);
          width: 550px;
          height: 500px;
          position: absolute;
          top: 350px;
          left: 0;
          z-index: 15;
        }
        
        .blog-card:hover {
          box-shadow: 0px 18px 20px -9px rgba(0, 10, 30, 0.75);
        }
        
        .blog-card:hover .card-info {
          opacity: 1;
          bottom: 50px;
        }
        
        .blog-card:hover .color-overlay {
          background: rgba(64, 64, 70, 0.8);
        }
        
        .blog-card:hover .title-content {
          margin-top: 40px;
        }
        
        .title-content {
          text-align: center;
          margin: 170px 0 0 0;
          position: absolute;
          z-index: 20;
          width: 100%;
          top: 0;
          left: 0;
          transition: all 0.6s;
        }
        
        .blog-card h3,
        h1 {
          font-size: 1.9em;
          font-weight: 400;
          letter-spacing: 1px;
          font-family: "Abril Fatface", serif;
          margin-bottom: 0;
          display: inline-block;
        }
        
        .blog-card h3 a {
          text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
          transition: all 0.2s;
        }
        
        .blog-card h3 a:hover {
          text-shadow: 0px 8px 20px rgba(0, 0, 0, 0.95);
        }
        
        .intro {
          font-size: 1.1em;
          font-style: italic;
          line-height: 18px;
          opacity: 0.8;
          font-weight: 400;
          font-family: "Droid Serif", serif;
          margin-top: 15px;
        }
        
        .card-info {
          width: 100%;
          position: absolute;
          bottom: -100px;
          left: 0;
          margin: 0 auto;
          padding: 0 50px;
          color: #fff;
          z-index: 20;
          opacity: 0;
          transition: bottom 0.64s, opacity 0.63s cubic-bezier(0.33, 0.66, 0.66, 1);
        }
        
        .card-info a {
          color: #fff;
          text-decoration: none;
          font-weight: 400;
          text-transform: uppercase;
          border-bottom: 1px solid #fff;
          padding-bottom: 2px;
          line-height: 1;
          font-size: 0.9em;
          letter-spacing: 1px;
        }
        
        .card-info a:hover {
          text-shadow: 0px 8px 20px rgba(0, 0, 0, 0.95);
        }
        
        .icon-arr {
          font-size: 0.9em;
        }
        
        .icon-black {
          color: #000;
        }
      `}</style>
    </div>
  );
}

export default BlogFlex; 