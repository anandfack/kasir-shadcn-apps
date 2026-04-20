import Providers from "../providers/Providers";

export default function ClientLayout({ children }) {
  return (
    <div>
      <Providers className="font-jakarta">{children}</Providers>
    </div>
  );
}