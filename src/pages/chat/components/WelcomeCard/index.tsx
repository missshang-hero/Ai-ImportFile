import React from 'react';

interface WelcomeCardProps {
  description: string;
  imgUrl: string;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ description, imgUrl }) => (
  <div className="welcome-card">
    <div className="welcome-card-text">
      {/* <div className="welcome-card-title">{title}</div> */}
      <div className="welcome-card-desc">{description}</div>
    </div>
    <div className="welcome-card-img">
      <img src={imgUrl} alt="welcome" />
    </div>
  </div>
);

export default WelcomeCard; 