// // src/app/pages/Home/Home.tsx
// import React from 'react';
// import { Container, Row, Col, Card, Button } from "react-bootstrap";
// import home_top_right from "./../../../../src/assets/home_top_right.png";
// import builder from "./../../../../src/assets/presentation_builder.png";
// import signup from "./../../../../src/assets/account.png"
// import copilot from "./../../../../src/assets/copilot.png"
// import "./Home.css";
// import { TypeAnimation } from "react-type-animation";
// import { Link, } from "react-router-dom";
// import { motion } from "framer-motion"

// const Home = () => {
//   const containerVariants = {
//     hidden: {
//       opacity: 0,
//     },
//     visible: {
//       opacity: 1,
//       transition: { delay: 0.5, duration: 0.5}
//     },
//     exit: {
//       y: '100vh',
//       transition: { ease: 'easeInOut'}
//     }
//   }
  
//   return (
//     <motion.div 
//       className="home-block"
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//       exit="exit"
//     >
//       <Container fluid>
//         <Row className="top-box">
//           <Col className="mx-2">
//             <TypeAnimation
//               sequence={[
//                 "Welcome to ReclaimHub",
//                 1000,
//                 "Create An Account",
//                 1000,
//                 "List Your Lost Items",
//                 1000,
//                 "Get Notified",
//                 1000,
//               ]}
//               wrapper="span"
//               speed={50}
//               style={{ fontSize: "2em", display: "inline-block"  }}
//               repeat={Infinity}
//             />
//             <p>
//               Find what's lost, and reunite with what matters most - where lost
//               items discover their way back home
//             </p>
//           </Col>
//           <Col>
//             <img
//               src={home_top_right}
//               alt="home_top_right_img"
//               className="home-top-img"
//             />
//           </Col>
//         </Row>
//           {/* How it works section */}
//         <Row>
//           <Col>
//             <h2 className="how-work-head">HOW IT WORKS?</h2>
//           </Col>
//         </Row>
//         {/* How it works section cards */}
//         <Row className="card-section">
//           <Col className="card-box">
//             <Card className="card">
//               <Card.Img
//                 variant="top"
//                 src={signup}
//                 className="card-img-container"
//               />
//               <Card.Body>
//                 <Card.Title>Create an account</Card.Title>
//                 <Card.Text>
//                   Sign up to start utilizing the AI-driven script writing tools
//                 </Card.Text>
//                 {/* {isLoggedIn ? '': 
//                   <Link to="/Signup">
//                     <Button className="card1-bottom-button" variant="success">Sign up</Button>
//                   </Link>
//                 } */}
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col className="card-box">
//             <Card className="card">
//               <Card.Img
//                 variant="top"
//                 src={copilot}
//                 className="card-img-container"
//               />
//               <Card.Body>
//                 <Card.Title>AI Co-Pilot Editor</Card.Title>
//                 <Card.Text>
//                   Receive AI-driven writing prompts and assistance to overcome writer’s block.
//                 </Card.Text>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col className="card-box">
//             <Card className="card">
//               <Card.Img
//                 variant="top"
//                 src={builder}
//                 className="card-img-container"
//               />
//               <Card.Body>
//                 <Card.Title>AI Pitch Deck Builder</Card.Title>
//                 <Card.Text>
//                 Create compelling pitch decks effortlessly with AI suggestions.
//                 </Card.Text>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col className="card-box">
//             <Card className="card">
//               <Card.Img
//                 variant="top"
//                 src={copilot}
//                 className="card-img-container"
//               />
//               <Card.Body>
//                 <Card.Title>Analytics</Card.Title>
//                 <Card.Text>
//                 Identify plot holes and get detailed script coverage analysis.
//                 </Card.Text>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col className="card-box">
//             <Card className="card">
//               <Card.Img
//                 variant="top"
//                 src={copilot}
//                 className="card-img-container"
//               />
//               <Card.Body>
//                 <Card.Title>AI Script Breakdown</Card.Title>
//                 <Card.Text>
//                 Streamline pre-production with automatic script breakdowns.
//                 </Card.Text>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </motion.div>
//   );
// };


// export default Home;