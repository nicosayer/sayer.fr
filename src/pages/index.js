import { Button, Intent } from "@blueprintjs/core";
import { Center } from "components/Center";
import { useToaster } from "providers/ToasterProvider";
import { useState } from "react";

function Root() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToaster();

  return (
    <Center>
      <Button
        loading={loading}
        large
        onClick={() => {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            toast({
              icon: "hand",
              message: "What did you expect?",
              intent: Intent.PRIMARY,
            });
          }, 1000);
        }}
        icon="hand"
        intent={Intent.SUCCESS}
        style={{ whiteSpace: "nowrap" }}
      >
        Welcome
      </Button>
    </Center>
  );
}

export default Root;
