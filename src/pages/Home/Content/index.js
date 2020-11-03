import { NonIdealState, Spinner } from "@blueprintjs/core";
import { Box } from "components/Box";
import { useReadData } from "hooks/useReadData";
import { sortBy } from "lodash/fp";
import User from "pages/Home/Content/User";

function Home() {
  const [users = [], loading] = useReadData({
    collection: "users",
  });

  if (loading) {
    return (
      <Box style={{ marginTop: "40px" }}>
        <Spinner />
      </Box>
    );
  }

  if (!users.length) {
    return (
      <Box style={{ marginTop: "40px" }}>
        <NonIdealState icon="lock" title="No access" />;
      </Box>
    );
  }

  return (
    <Box style={{ padding: "10px" }}>
      {sortBy("name", users).map((user) => (
        <User key={user.name} user={user} />
      ))}
    </Box>
  );
}

export default Home;
