import { useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { api } from "@/services/apiClient";
import { withSSRAuth } from "@/utils/withSSRAuth";
import { setupAPIClient } from "@/services/api";
import { Can } from "@/components/Can";

export default function Dashboard() {
  const { user } = useAuthContext();

  useEffect(() => {
    api
      .get("/me")
      .then(response => console.log(response))
      .catch(error => console.error(error));
  }, []);

  return (
    <>
      <h1>Dashboard: {user?.email}</h1>

      <Can roles={["administrator", "editor"]}>
        <h4>Metrics</h4>
      </Can>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async ctx => {
  const apiClient = setupAPIClient(ctx);

  await apiClient.get("/me");

  return {
    props: {},
  };
});
