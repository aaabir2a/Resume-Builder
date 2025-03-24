import Header from "@/components/header"

export default function CVLayout({ children }) {
  return (
    (<div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">{children}</main>
    </div>)
  );
}

