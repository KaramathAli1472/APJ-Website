import { useCallback, useEffect, useState } from "react";

import {
  addData,
  getData,
  updateData,
  deleteData,
} from "../../services/firestore/firestoreService";

function useFirestore(collectionName) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!collectionName) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getData(collectionName);
      setData(result);
    } catch (err) {
      console.error("Firestore fetch error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  const createData = async (newData) => {
    try {
      const id = await addData(
        collectionName,
        newData
      );

      await fetchData();

      return id;
    } catch (err) {
      console.error("Firestore create error:", err);
      setError(err);
      throw err;
    }
  };

  const editData = async (documentId, updatedData) => {
    try {
      await updateData(
        collectionName,
        documentId,
        updatedData
      );

      await fetchData();
    } catch (err) {
      console.error("Firestore update error:", err);
      setError(err);
      throw err;
    }
  };

  const removeData = async (documentId) => {
    try {
      await deleteData(
        collectionName,
        documentId
      );

      await fetchData();
    } catch (err) {
      console.error("Firestore delete error:", err);
      setError(err);
      throw err;
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    fetchData,
    createData,
    editData,
    removeData,
  };
}

export default useFirestore;