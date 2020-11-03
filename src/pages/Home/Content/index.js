import { Box } from "components/Box";
import { useReadData } from "hooks/useReadData";
import { sortBy } from "lodash/fp";
import User from "pages/Home/Content/User";

function Home() {
  const [users = []] = useReadData({
    collection: "users",
  });

  return (
    <Box style={{ padding: "10px" }}>
      {sortBy("name", users).map((user) => (
        <User key={user.name} user={user} />
      ))}
    </Box>
  );
}

export default Home;
