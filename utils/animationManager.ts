export type AnimationItem = {
  id: number;
  text: string;
};

let animationCount = 0;

export const addAnimation = (text: string): AnimationItem => {
  animationCount++;
  return {
    id: Date.now() + animationCount,
    text: text.substring(0, 50),
  };
};
