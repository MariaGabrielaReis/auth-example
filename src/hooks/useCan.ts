import { useAuthContext } from "@/contexts/AuthContext";

type useCanProps = {
  permissions?: string[];
  roles?: string[];
};

export function useCan({ permissions = [], roles = [] }: useCanProps) {
  const { user, isAuthenticated } = useAuthContext();

  if (!isAuthenticated) return false;

  if (permissions.length > 0) {
    const hasAllPermissions = permissions.every(permission => {
      return user?.permissions.includes(permission);
    });

    if (!hasAllPermissions) return false;
  }

  if (roles.length > 0) {
    const hasAllRoles = roles.some(role => {
      return user?.roles.includes(role);
    });

    if (!hasAllRoles) return false;
  }

  return true;
}
