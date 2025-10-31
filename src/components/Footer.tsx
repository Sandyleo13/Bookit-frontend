export default function Footer() {
  return (
    <footer className="bg-white text-center py-6 border-t mt-8">
      <p className="text-textSecondary text-sm">
        © {new Date().getFullYear()} BookIt. All rights reserved.
      </p>
    </footer>
  );
}
