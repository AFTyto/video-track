// Empty middleware - all routing handled by Next.js pages
export const config = {
  matcher: ["/"],
};

export default function middleware() {
  return;
}
