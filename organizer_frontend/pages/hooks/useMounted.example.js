function Navigation() {
  const hasMounted = useHasMounted();
  if (!hasMounted) return null;
  const user = getUser();
  if (user) return <AuthenticatedNav user={user} />;
  return (
    <nav>
      <a href="/login">Login</a>
    </nav>
  );
}
