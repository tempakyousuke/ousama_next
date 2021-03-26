import useSWR from "swr";
import Link from "next/link";
import { firestore } from "utils/firebase";
import { AuthContext } from "context/auth";
import { useState, useContext } from "react";
import HiCard from "components/Card/hiCard";

export default function CreateList(): JSX.Element {
  const [activeTab, setTab] = useState("creating");
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

  const { data: boardTitles } = useSWR(
    `/question_board/${currentUser?.uid}`,
    getQuestions
  );
  let questions;

  if (boardTitles === undefined) {
    questions = [];
  } else if (activeTab === "approved") {
    questions = boardTitles.filter((v) => {
      return v.isApply === 2;
    });
  } else if (activeTab === "notApproved") {
    questions = boardTitles.filter((v) => {
      return v.isApply === 1;
    });
  } else {
    questions = boardTitles.filter((v) => {
      return v.isApply !== 1 && v.isApply !== 2;
    });
  }

  const activeClass = "px-6 py-2 bg-white rounded-t-lg";
  const normalClass =
    "px-6 py-2 text-gray-500 bg-white bg-gray-200 rounded-t-lg";

  const creatingClass = activeTab === "creating" ? activeClass : normalClass;
  const notApprovedClass =
    activeTab === "notApproved" ? activeClass : normalClass;
  const approvedClass = activeTab === "approved" ? activeClass : normalClass;

  return (
    <HiCard className="mx-auto mt-5" title="問題一覧">
      <div className="max-w-2xl mx-auto mt-5">
        <ul className="flex cursor-pointer">
          <li
            className={creatingClass}
            onClick={() => {
              setTab("creating");
            }}
          >
            作成中
          </li>
          <li
            className={notApprovedClass}
            onClick={() => {
              setTab("notApproved");
            }}
          >
            申請中
          </li>
          <li
            className={approvedClass}
            onClick={() => {
              setTab("approved");
            }}
          >
            掲載済み
          </li>
        </ul>
        <div>
          {questions.map((v) => {
            return (
              <Link href={`/create/edit/${v.id}/`} key={v.id}>
                <div className="px-2 py-3 border">
                  {v.title || "タイトル未設定"}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </HiCard>
  );
}
