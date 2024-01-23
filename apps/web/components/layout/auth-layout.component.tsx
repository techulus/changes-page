import HeaderComponent from "./header.component";

export default function AuthLayout({ children }) {
  return (
    <div className="block h-full min-h-full bg-gray-100 dark:bg-gray-800">
      <HeaderComponent />
      {children}
    </div>
  );
}
