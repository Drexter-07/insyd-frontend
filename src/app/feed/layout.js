// src/app/feed/layout.js

// This layout no longer needs to render the Navbar,
// because the root layout in src/app/layout.js is already doing it.
// We just need to render the page content that comes from this route.
export default function FeedLayout({ children }) {
  return (
  <>
  {children}
  </>
  );
}
