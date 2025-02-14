import { useEffect, useState } from "react";
import { httpGet } from "../../utils/http";

export default function MemeberDetails({ id }: { id: string }) {
  const [memberDetails, setMemberDetails] = useState<{
    email: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    httpGet({ url: `/api/teams/member/${id}` }).then((data) => {
      setMemberDetails(data);
    });
  }, []);

  if (!memberDetails) {
    return (
      <div className="animate-pulse w-24 h-6 bg-gray-200 dark:bg-gray-600 rounded"></div>
    );
  }

  return <span>{memberDetails.name ?? memberDetails.email}</span>;
}
