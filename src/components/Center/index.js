import { Box } from "components/Box";

export const Center = (props) => {
  return (
    <Box
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
      {...props}
    />
  );
};
