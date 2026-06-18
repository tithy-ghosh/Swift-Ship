import PrivateRoute from "@/app/routes/PrivateRoute"

export default function PrivateLayout({ children }) {
  return <PrivateRoute>{children}</PrivateRoute>
}
