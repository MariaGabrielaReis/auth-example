import { useAuthContext } from "@/contexts/AuthContext";
import { validateUserPermissions } from "@/utils/validateUserPermissions";

type useCanProps = {
  permissions?: string[];
  roles?: string[];
};

export function useCan({ permissions = [], roles = [] }: useCanProps) {
  const { user, isAuthenticated } = useAuthContext();

  if (!isAuthenticated) return false;

  const userHasValidPermissions = validateUserPermissions({
    user,
    permissions,
    roles,
  });

  return userHasValidPermissions;
}
