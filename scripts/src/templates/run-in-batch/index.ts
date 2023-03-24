import { runInBatch } from "../../utils/async";
import { getFirebase, spreadDocumentsData } from "../../utils/firebase";

const template = async () => {
  const { db } = await getFirebase();

  const elements = await db
    .collectionGroup("boards")
    .get()
    .then(spreadDocumentsData);

  await runInBatch(100, elements, async (element) => {
    console.debug(element);
  });
};

export default template;
