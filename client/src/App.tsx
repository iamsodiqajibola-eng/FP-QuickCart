import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import ShopPage from "./pages/shop/ShopPage";
import CategoriesPage from "./pages/shop/CategoriesPage";
import ProductDetailsPage from "./pages/shop/ProductDetailsPage";
import CartPage from "./pages/cart/CartPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import CheckoutPage from "./pages/cart/CheckoutPage";
import OrderconfirmationPage from "./pages/cart/OrderconfirmationPage";
import OrderHistory from "./pages/account/OrderHistory";
import SavedItemsPage from "./pages/account/SavedItemsPage";
import AccountSettingsPage from "./pages/account/AccountSettingsPage";
import AddressesPage from "./pages/account/AddressesPage";
import OrderDetailsPage from "./pages/account/OrderDetailsPage";
// import InfoPage from "./pages/InfoPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminProductsFormPage from "./pages/admin/AdminProductsFormPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import MainLayout from "./layouts/MainLayout";
import AccountLayout from "./layouts/AccountLayout";
import AdminLayout from "./layouts/AdminLayout";
import AccountOverviewPage from "./pages/account/AccountOverviewPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* everyone can access these pages */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route
              path="/product/:productId"
              element={<ProductDetailsPage />}
            />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Password reset link includes the token from the email */}
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage />}
            />

            {/* Pages that need a login */}
            <Route element={<ProtectedRoute />}>
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route
                path="/order-confirmation/:orderId"
                element={<OrderconfirmationPage />}
              />

              {/* Account pages: account menu on the left */}
              <Route path="/account" element={<AccountLayout />}>
                <Route index element={<AccountOverviewPage />} />
                <Route path="orders" element={<OrderHistory />} />
                <Route path="addresses" element={<AddressesPage />} />
                <Route path="saved" element={<SavedItemsPage />} />
                <Route path="settings" element={<AccountSettingsPage />} />
              </Route>

              {/* order details in full width design, so it has no account menu */}
              <Route
                path="/account/orders/:orderId"
                element={<OrderDetailsPage />}
              />
            </Route>

            {/* shipping, returns, FAQs, about, terms, privacy... (one route each, all using InfoPage) */}
            {/* {InfoPage.map((page) => {
              return <Route key={page.path}
              path={page.path}
              element={<InfoPage page={page}/>/>;
            })} */}

            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* admin login: no layout */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin pages: only admins get in */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="products/new" element={<AdminProductsFormPage />} />
              <Route
                path="products/:productId/edit"
                element={<AdminProductsFormPage />}
              />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />

              {/* Any other admin address shows the 404 page inside the admin layout */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
