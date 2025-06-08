import FeatureCard from './featureCard';
import '../styles/landingpage.css';
import Navbar from '../components/Navbar';
import runningWriter from '../assets/images/runningWriter1.png';
import theLekh from '../assets/images/theLekh.png';
import { MdArrowForward } from 'react-icons/md';
import { BsPostcardHeart } from 'react-icons/bs';
import { FaPeopleGroup } from 'react-icons/fa6';
import { FaHouseUser } from 'react-icons/fa';
import { SiGooglegemini } from 'react-icons/si';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
const LandingPage = () => {
  return (
    <>
      <div className='landingpage-navbar'>
        <Navbar />
      </div>
      <div className='landingpage-container'>
        <section className='landingpage-herosection-container'>
          <div className='ldp-herosection-image-desp-c'>
            <div className='ldp-herosection-image-c'>
              <div className='ldp-herosection-image'>
                <img src={runningWriter} alt='hero1' />
              </div>
            </div>
            <div className='ldp-herosection-desp-c'>
              <div className='ldp-herosection-desp-info'>
                <img src={theLekh} alt='The Lekh Logo' className='ldp-logo-heading' />
                <p>{`Post blogs and build Community. Powered by Google's gemini`}</p>
              </div>
              <div className='ldp-herosection-desp-action-btn-c'>
                <Link to='/login'>
                  Get Started <MdArrowForward />
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className='landingpage-features-container'>
  <div className='ldp-features-c'>
    <div className='ldp-features-header'>
      <h3>Features</h3>
    </div>
    <div className='ldp-features-cards-container'>
      <FeatureCard delay={0}>
        <div className='ldp-features-card-img-c' style={{ backgroundColor: 'rgb(255 231 231)' }}>
          <BsPostcardHeart style={{ color: '#eb7373' }} />
        </div>
        <div className='ldp-features-card-desp-c'>
          <p>create and explore awesome blog post of different categories.</p>
        </div>
      </FeatureCard>

      <FeatureCard delay={0.2}>
        <div className='ldp-features-card-img-c' style={{ backgroundColor: '#ede6ff' }}>
          <FaPeopleGroup style={{ color: '#9773eb' }} />
        </div>
        <div className='ldp-features-card-desp-c'>
          <p>Follow other blogs and stay updated on new posts.</p>
        </div>
      </FeatureCard>

      <FeatureCard delay={0.4}>
        <div className='ldp-features-card-img-c' style={{ backgroundColor: '#d5ffea' }}>
          <FaHouseUser style={{ color: '#73ebaf' }} />
        </div>
        <div className='ldp-features-card-desp-c'>
          <p>Complete user management including password reset and profile updates.</p>
        </div>
      </FeatureCard>

      <FeatureCard delay={0.6}>
        <div className='ldp-features-card-img-c' style={{ backgroundColor: '#dce4ff' }}>
          <SiGooglegemini style={{ color: '#738feb' }} />
        </div>
        <div className='ldp-features-card-desp-c'>
          <p>Generate blogs using Google&apos;s Gemini AI.</p>
        </div>
      </FeatureCard>
    </div>
  </div>
</section>

        <section className='landingpage-about-container'>
          <div className='ldp-about-c'>
            <div className='ldp-about-header'>
              <h3>About</h3>
            </div>
            <div className='ldp-about-desp'>
              <p>
                {`The Lekh is an creative and collaborative platform that leverages artificial
                intelligence to simplify content creation with google's gemini ai. Whether you're a
                professional writer or a hobbyist, our tools help you craft
                compelling blogs, manage images, and reach your audience
                efficiently.
                `}
              </p>
              <p>{`Complete user management lets you manage your profile details, reset passwords and more. Users can follow each other Interact with thier community and discover new people with Incredible insights.
                `}</p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;

