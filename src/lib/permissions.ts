export interface Permissions {
  manageRoster: boolean;
  manageJoinRequests: boolean;
  managePostings: boolean;
  manageEvents: boolean;
}

const FULL: Permissions = {
  manageRoster: true,
  manageJoinRequests: true,
  managePostings: true,
  manageEvents: true,
};

const NONE: Permissions = {
  manageRoster: false,
  manageJoinRequests: false,
  managePostings: false,
  manageEvents: false,
};

// President/VP run the club end-to-end. Secretary handles correspondence
// (postings + join requests). Event Head owns the events calendar only.
// Treasurer gets view-only access (no dues/budget module yet to manage).
export function getPermissions(
  position: string | undefined,
  isAdmin: boolean,
): Permissions {
  if (isAdmin) return FULL;
  switch (position) {
    case "President":
    case "Vice President":
      return FULL;
    case "Secretary":
      return { ...NONE, manageJoinRequests: true, managePostings: true };
    case "Event Head":
      return { ...NONE, manageEvents: true };
    case "Treasurer":
      return NONE;
    default:
      return NONE;
  }
}
