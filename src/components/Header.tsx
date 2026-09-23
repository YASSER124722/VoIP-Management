export default function Header() {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || "";

  return (
    <header>
      <h1>{companyName}</h1>
    </header>
  );
}
