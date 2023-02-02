import { useAuthContext } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuthContext();

  return <h1>Dashboard: {user?.email}</h1>;
}
