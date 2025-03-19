// frontend/src/pages/Landing/Landing.js
import React from 'react';
import LandingHeader from '../../components/landing/LandingHeader';
import LandingHero from '../../components/landing/LandingHero';
import LandingFeatures from '../../components/landing/LandingFeatures';
import LandingPricing from '../../components/landing/LandingPricing';
import LandingTestimonials from '../../components/landing/LandingTestimonials';
import LandingFAQ from '../../components/landing/LandingFAQ';
import LandingCTA from '../../components/landing/LandingCTA';
import LandingFooter from '../../components/landing/LandingFooter';

const Landing = () => {
    return (
        <div className="bg-white">
            <LandingHeader />
            <LandingHero />
            <LandingFeatures />
            <LandingPricing />
            <LandingTestimonials />
            <LandingFAQ />
            <LandingCTA />
            <LandingFooter />
        </div>
    );
};

export default Landing;