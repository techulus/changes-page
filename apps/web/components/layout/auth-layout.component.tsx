import HeaderComponent from "./header.component";

export default function AuthLayout({ children }) {
  return (
    <div className="block h-full min-h-full">
      <HeaderComponent />
      {children}
      <script
        data-jsd-embedded
        data-key="0b2ca96c-0f7b-4bb3-b51c-e58d76d8e37d"
        data-base-url="https://jsd-widget.atlassian.com"
        src="https://jsd-widget.atlassian.com/assets/embed.js"
      />
    </div>
  );
}
