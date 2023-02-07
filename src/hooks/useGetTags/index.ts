import { DocumentReference } from "firebase/firestore";
import { useCallback } from "react";
import { useBoards } from "routes/Home/Boards/Provider";
import { TagDocument } from "types/firebase/collections";

const useGetTags = () => {
  const { tags } = useBoards();

  return useCallback(
    (tagRefs?: DocumentReference<TagDocument>[]) => {
      const tagRefIds = (tagRefs ?? []).map((tagRef) => tagRef.id);

      return (tags ?? []).filter((tag) => {
        return tagRefIds.includes(String(tag.id));
      });
    },
    [tags]
  );
};

export default useGetTags;
