import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AppLayout from "./components/layout/AppLayout";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsListPage from "./pages/products/ProductsListPage";
import ProductDetailPage from "./pages/products/ProductDetailPage";
import ProductFormPage from "./pages/products/ProductFormPage";
import ReceiptsListPage from "./pages/receipts/ReceiptsListPage";
import ReceiptDetailPage from "./pages/receipts/ReceiptDetailPage";
import ReceiptFormPage from "./pages/receipts/ReceiptFormPage";
import DeliveriesListPage from "./pages/deliveries/DeliveriesListPage";
import DeliveryDetailPage from "./pages/deliveries/DeliveryDetailPage";
import DeliveryFormPage from "./pages/deliveries/DeliveryFormPage";
import { TransfersListPage, TransferDetailPage, TransferFormPage } from "./pages/transfers/TransfersPages";
import { AdjustmentsListPage, AdjustmentFormPage } from "./pages/adjustments/AdjustmentsPages";
import MoveHistoryPage from "./pages/MoveHistoryPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/settings/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: 'rgba(20, 27, 45, 0.95)',
          color: '#F1F5F9',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          borderRadius: '12px',
        },
        success: { style: { borderLeft: '3px solid #00D4AA' } },
        error: { style: { borderLeft: '3px solid #FF4444' } },
        duration: 4000,
      }}
    />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsListPage />} />
          <Route path="/products/new" element={<ProductFormPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/products/:id/edit" element={<ProductFormPage />} />
          <Route path="/receipts" element={<ReceiptsListPage />} />
          <Route path="/receipts/new" element={<ReceiptFormPage />} />
          <Route path="/receipts/:id" element={<ReceiptDetailPage />} />
          <Route path="/deliveries" element={<DeliveriesListPage />} />
          <Route path="/deliveries/new" element={<DeliveryFormPage />} />
          <Route path="/deliveries/:id" element={<DeliveryDetailPage />} />
          <Route path="/transfers" element={<TransfersListPage />} />
          <Route path="/transfers/new" element={<TransferFormPage />} />
          <Route path="/transfers/:id" element={<TransferDetailPage />} />
          <Route path="/adjustments" element={<AdjustmentsListPage />} />
          <Route path="/adjustments/new" element={<AdjustmentFormPage />} />
          <Route path="/move-history" element={<MoveHistoryPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
