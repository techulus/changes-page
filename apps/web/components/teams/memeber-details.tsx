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
      <div className="animate-pulse h-4 bg-gray-200 dark:bg-gray-600 col-span-2 rounded"></div>
    );
  }

  return <span>{memberDetails.name ?? memberDetails.email}</span>;
}
