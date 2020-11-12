export const cleanDoc = (doc) => {
  return { uid: doc.id, ref: doc.ref, ...doc.data() };
};

export const cleanSnapshot = (snapshot) => {
  if (Array.isArray(snapshot.docs)) {
    return snapshot.docs
      .map((doc) => {
        return cleanDoc(doc);
      })
      .filter(Boolean);
  }

  return cleanDoc(snapshot);
};
