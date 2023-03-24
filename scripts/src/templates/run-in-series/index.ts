import { runInSeries } from "../../utils/async";
import { getFirebase, spreadDocumentsData } from "../../utils/firebase";

const template = async () => {
  const { db } = await getFirebase();

  const elements = await db
    .collectionGroup("boards")
    .get()
    .then(spreadDocumentsData);

  await runInSeries(elements, async (element) => {
    console.debug(element);
  });
};

export default template;
