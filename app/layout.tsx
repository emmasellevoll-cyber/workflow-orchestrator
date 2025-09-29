import './globals.css';

export const metadata = {
  title: 'Workflow Orchestrator Web',
  description: 'Simple Next.js UI for your API',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
