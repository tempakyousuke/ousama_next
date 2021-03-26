// import React from "react";
import useSWR from "swr";
import Link from "next/link";
import { firestore } from "utils/firebase";
import { AuthContext } from "context/auth";
import { useContext } from "react";

export default function CreateList(): JSX.Element {
  const { currentUser } = useContext(AuthContext);
  const getQuestions = async () => {
    const docs = await firestore
      .collection("questions")
      .where("uid", "==", currentUser.uid)
      .orderBy("modified", "desc")
      .get();
    const boardTitles = [];
    docs.forEach((doc) => {
      boardTitles.push({
        id: doc.id,
        title: doc.data().title,
        isApply: doc.data().isApply,
      });
    });
    return boardTitles;
  };

  const boardTitles = useSWR("/question_board/", getQuestions);
  console.log(boardTitles);

  return <></>;
}
