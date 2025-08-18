"use client";
import { useUser } from "@/app/provider";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabaseClient";
import { Video } from "lucide-react";
import react, { useEffect, useState } from "react";
import InterviewCard from "../dashboard/_components/interviewcard";
import { useRouter } from "next/navigation";

function AllInterview() {
  const router = useRouter();
  const [InterviewList, setInterviewList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    user && GetInterviewList();
  }, [user]);

  const GetInterviewList = async () => {
let { data: interviews, error } = await supabase
    .from("Interviews")
    .select("*, interview_results(*)") // <-- JOIN the related table
    .eq("userEmail", user?.email)
    .order('id', { ascending: false })

    console.log("Error:", error);
    console.log("Interviews:", interviews);
    setInterviewList(interviews);
  };

  return (
    <div className="my-5">
      <h2 className="font-bold text-2xl mb-4">Previously Created Interviews</h2>

      {InterviewList?.length === 0 ? (
        <div className="p-5 flex flex-col items-center gap-3 text-center text-gray-500 bg-white border rounded-xl shadow-sm">
          <Video className="text-primary h-10 w-10" />
          <h2 className="text-base">You don't have any interview created</h2>
          <Button
            className="cursor-pointer"
            onClick={() => router.push("/recruiter/dashboard/create-interview")}
          >
            + Create New Interview
          </Button>
        </div>
      ) : (
        InterviewList && (
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
            {InterviewList.map((interview, index) => (
              <InterviewCard interview={interview} key={index} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
export default AllInterview;
