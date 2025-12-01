import { useAuthStore } from "@/shared/stores/auth.store";

export const DashboardPage = () => {
  const { user, logout } = useAuthStore();

  return (
    <div>
      <h1>Bem-vindo, {user?.username}!</h1>
      <button onClick={logout}>Sair</button>
    </div>
  );
};
