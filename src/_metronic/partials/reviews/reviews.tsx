import React, { useEffect, useState } from "react";
import Marquee from "react-marquee-slider";
import styled from "styled-components";
import times from "lodash/times";
import { withSize } from "react-sizeme";
import { nanoid } from "nanoid";

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
  "../../../../src/assets/avatars/300-1.jpg",
  "../../../../src/assets/avatars/300-2.jpg",
  "../../../../src/assets/avatars/300-3.jpg",
  "../../../../src/assets/avatars/300-4.jpg",
  "../../../../src/assets/avatars/300-5.jpg",
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
          {times(5, String).map((id) => (
            <Box key={`marquee-example-review-${id}`} scale={scale}>
              <Review scale={scale}>
                <Avatar scale={scale}>
                  <img src={portraits[parseInt(id)]} alt="" />
                </Avatar>
                <Content scale={scale}>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua.
                  </p>
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