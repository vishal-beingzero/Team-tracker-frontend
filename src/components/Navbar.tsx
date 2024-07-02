// src/components/Navbar.tsx
import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Navbar as BootstrapNavbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import sitelogo from '../assets/sitelogo.png'

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateX(0) translateY(0);
  }
  25% {
    transform: translateX(20px) translateY(-20px);
  }
  50% {
    transform: translateX(-20px) translateY(0);
  }
  75% {
    transform: translateX(10px) translateY(-10px);
  }
`;

const burst = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
`;

const particle = keyframes`
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(calc(${Math.random() * 100 - 50}vh)) translateX(calc(${Math.random() * 100 - 50}vw)) scale(0.2);
    opacity: 0;
  }
`;

const NavbarContainer = styled(BootstrapNavbar)`
  animation: ${fadeIn} 1s ease-in-out;
  background-color: #41323d;
  padding: 1rem 2rem;
  position: relative;
`;

const CustomLink = styled(Link)`
  color: #d5e4f0 !important; /* Adjust to your chosen elegant color */
  font-weight: bold;
  text-decoration: none; /* Remove underline */
  margin: 0 10px; /* Adjust margin as needed */
  padding: 0.7rem 0.9rem; /* Adjust padding as needed */
  &:hover {
    box-shadow: 1px 1px 3px white;
    border-radius: 5px;
    text-decoration: kk; /* Underline on hover */
  }
`;

const Brand = styled(BootstrapNavbar.Brand)`
  font-size: 1.5rem;
  font-weight: bold;
  color: white !important;
  text-decoration: none
`;

const AnimatedElement = styled.div<{ filled: number }>`
  position: absolute;
  top: 50%;
  right: 20px; /* Adjust as needed */
  transform: translateY(-50%);
  width: 30px; /* Adjust based on the bouncing distance */
  height: 30px; /* Adjust based on the bouncing distance */
  border: 3px solid #f0ad4e;
  border-radius: 50%;
  cursor: pointer; /* Enable pointer cursor on hover */
  animation: ${({ filled }) =>
    filled === 1
      ? css`
          ${burst} 0.5s ease-in-out forwards,
          ${particle} 1s ease-in-out forwards
        `
      : css`
          ${bounce} 2s ease-in-out infinite
        `};
`;

const FilledCircle = styled.div<{ fillPercentage: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${({ fillPercentage }) => fillPercentage * 100}%;
  height: 100%;
  background-color: #f0ad4e;
  border-radius: 50%;
  transition: width 0.2s ease; /* Smooth transition for fill effect */
`;

const BrandImage = styled.img`
  width: 47px; /* Adjust size as needed */
  height: 37px; /* Adjust size as needed */
  margin-right: 10px; /* Space between image and site name */
`;

const Particle = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #f0ad4e;
  border-radius: 50%;
  animation: ${particle} 1s ease-in-out forwards;
`;

const BringBackButton = styled.button`
  background-color: #38343c;
  color: white;
  font-weight: bold;
  border: solid;
  border-radius: 15px;
  border-width: 2px;
  border-color: #717c79;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: auto;
  margin-right: 20px; /* Adjust as needed */
  &:hover {
    box-shadow: 1px 1px 3px white;
    border-width:0;
  }
`;

const Navbar: React.FC = () => {
  const [filled, setFilled] = useState(0); // 0 to 1 range

  const handleClick = () => {
    if (filled < 1) {
      const newFilled = filled + 0.25;
      setFilled(newFilled > 1 ? 1 : newFilled);
    } else {
      // Burst animation
      setFilled(1);
      setTimeout(() => {
        setFilled(0);
      }, 1000); // Reset filled state after burst animation duration
    }
  };

  return (
    <NavbarContainer expand="lg">
      <Brand as={Link} to="/">
        <BrandImage src={sitelogo} alt="Logo" />{" "}
        {/* Update the path to your image */}
        TeamTracker
      </Brand>
      <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
      <BootstrapNavbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <CustomLink to="/Leaderboard">Leaderboard</CustomLink>
          <CustomLink to="/adduser">Add User</CustomLink>
          <CustomLink to="/teamdetails">Team's Performance</CustomLink>
          <CustomLink to="/userdetails">User Level</CustomLink>
        </Nav>
      </BootstrapNavbar.Collapse>
      <AnimatedElement filled={filled} onClick={handleClick}>
        {filled === 1 && (
          <>
            <Particle style={{ top: "20%", left: "30%" }} />
            <Particle style={{ top: "40%", left: "70%" }} />
            <Particle style={{ top: "60%", left: "10%" }} />
            <Particle style={{ top: "80%", left: "50%" }} />
          </>
        )}
        <FilledCircle fillPercentage={filled} />
      </AnimatedElement>
      {filled === 1 && (
        <BringBackButton onClick={() => setFilled(0)}>
          Recall the Ball
        </BringBackButton>
      )}
    </NavbarContainer>
  );
};

export default Navbar;