import HeaderComponent from "./header.component";

export default function AuthLayout({ children }) {
  return (
    <div className="block h-full min-h-full">
      <HeaderComponent />
      {children}
    </div>
  );
}
