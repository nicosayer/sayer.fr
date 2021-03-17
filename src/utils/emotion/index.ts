import createEmotion from "@emotion/css/create-instance";

const emotion = createEmotion({
  key: "ns",
});
const { css, cx, injectGlobal, keyframes } = emotion;

export { css, cx, injectGlobal, keyframes };
