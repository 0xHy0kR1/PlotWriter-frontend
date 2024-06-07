import React, { useEffect, useState } from "react";
import Marquee from "react-marquee-slider";
import styled from "styled-components";
import times from "lodash/times";
import { withSize } from "react-sizeme";
import { nanoid } from "nanoid";
import { BsInstagram } from "react-icons/bs";
import { FaImdb } from "react-icons/fa";
import FullWidth from "./FullWidth";

const Height = styled.div<{ height?: number }>`
  position: relative;
  width: 100%;
  height: ${(props) => (props.height ? props.height + "px" : "auto")};
`;

const Box = styled.div<{ scale: number }>`
  padding: ${(props) => props.scale * 25}px;
`;

const Review = styled.div<{ scale: number }>`
  width: ${(props) => props.scale * 350}px;
  display: flex;
  padding: ${(props) => props.scale * 25}px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 7px 20px 0 rgba(0, 0, 0, 0.12);
`;

const Avatar = styled.div<{ scale: number }>`
  border-radius: 50%;
  width: ${(props) => props.scale * 58}px;
  height: ${(props) => props.scale * 58}px;
  overflow: hidden;
  flex-shrink: 0;
  margin-right: ${(props) => props.scale * 15}px;

  img {
    max-width: 100%;
  }
`;

const Content = styled.div<{ scale: number }>`
  p {
    margin: 0;
    color: #444;
    font-family: Helvetica, sans-serif;
    font-size: ${(props) => props.scale * 14}px;
    line-height: ${(props) => props.scale * 20}px;
    font-weight: 100;
    text-align: left;
  }
`;

const portraits = [
  "../../../../src/assets/avatars/Julie_Ryan.png",
  "../../../../src/assets/avatars/alex_smith.png",
  "../../../../src/assets/avatars/Martin_Scorsese.png",
  "../../../../src/assets/avatars/Christopher_Nolan.png",
  "../../../../src/assets/avatars/Quentin_Tarantino.png",
];

const reviewerNames = [
  "Julie Ryan",
  "Alex Smith",
  "Martin Scorsese",
  "Christopher Nolan",
  "Quentin Tarantino",
];

const reviewsText = [
  "PlotWriter's AI Co-Pilot Editor and analytics have transformed my scriptwriting. Highly recommended!",
  "The AI tools are exceptional, making my writing process faster and more enjoyable.",
  "PlotWriter's analytics and AI suggestions offer fresh perspectives and help improve my scripts.",
  "The AI Co-Pilot Editor helps overcome writer’s block with creative prompts. A must-have for scriptwriters.",
  "PlotWriter's pitch deck builder is intuitive and the AI suggestions are spot on. A huge timesaver.",
];

const reviewerInsta = [
  "https://www.instagram.com/julieryan99",
  "https://www.instagram.com/alexpsmith/",
  "https://www.instagram.com/martinscorsese_/",
  "https://www.instagram.com/christophernolann/",
  "https://www.instagram.com/tarantinoxx/",
];

const reviewerImdb = [
  "https://www.imdb.com/name/nm0752646/",
  "https://www.imdb.com/name/nm0807243/",
  "https://www.imdb.com/name/nm0000217/",
  "https://www.imdb.com/name/nm0634240/",
  "https://www.imdb.com/name/nm0000233/",
];

interface ReviewsProps {
  size: {
    width: number;
    height: number;
  };
  onStartPerformance: () => void;
  onEndPerformance: () => void;
}

const Reviews: React.FC<ReviewsProps> = ({ size, onStartPerformance, onEndPerformance }) => {
  const [key, setKey] = useState<string>(nanoid());

  useEffect(() => {
    setKey(nanoid());
  }, [size, setKey]);

  let scale: number = 0.5;

  if (size && size.width > 800) {
    scale = 0.65;
  }

  if (size && size.width > 1100) {
    scale = 0.8;
  }

  if (size && size.width > 1400) {
    scale = 1;
  }

  return (
    <FullWidth>
      <Height height={600}>
        <Marquee
          key={key}
          velocity={25}
          scatterRandomly
          onInit={onStartPerformance}
          onFinish={onEndPerformance} 
          direction={"ltr"} 
          resetAfterTries={0}>
          {reviewsText.map((review, index) => (
              <Box key={`marquee-example-review-${index}`} scale={scale}>
                <Review scale={scale}>
                  <Avatar scale={scale}>
                    <img src={portraits[index]} alt={reviewerNames[index]} />
                  </Avatar>
                  <Content scale={scale}>
                    <div className="personal-info">
                      <h3 className="text-xl text-black">{reviewerNames[index]}</h3>
                      <p>{review}</p>
                      <a href={reviewerInsta[index]} target="_blank" rel="noopener noreferrer">
                      <BsInstagram size={24} color="black" />
                      </a>
                      <a href={reviewerImdb[index]} target="_blank" rel="noopener noreferrer">
                        <FaImdb size={24} color="black"/>
                      </a>
                    </div>
                  </Content>
                </Review>
              </Box>
            ))}
        </Marquee>
      </Height>
    </FullWidth>
  );
};

// will end in a loop without React.memo
export default React.memo(withSize()(Reviews));