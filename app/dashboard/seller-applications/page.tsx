import { redirect } from "next/navigation"

/**
 * Seller applications now live as a tab on /dashboard/sellers. This route is
 * kept so existing links and bookmarks land on the right tab instead of 404ing.
 */
export default function SellerApplicationsPage() {
  redirect("/dashboard/sellers")
}
