import HeaderComponent from "@/components/HeaderComponent";

export default function MainLayout({ children }) {
  return (
    <div id="main">
      <HeaderComponent />
      {children}
    </div>
  );
}
