export function requireRole(...roles: string[]) {
  return (req: any, res: any, next: any) => {
    const role = req.user?.role || "guest";
    if (!roles.includes(role)) return res.status(403).json({ message: "Forbidden" });
    next();
  };
}

// Helper for common role combinations
export const requireAdmin = () => requireRole("admin");
export const requireManagerOrAbove = () => requireRole("admin", "portfolio-manager");
export const requireOwnerOrAbove = () => requireRole("admin", "portfolio-manager", "owner");
export const requireStaffOrAbove = () => requireRole("admin", "portfolio-manager", "owner", "staff");
export const requireAnyAuthenticated = () => requireRole("admin", "portfolio-manager", "owner", "staff", "retail-agent", "referral-agent");